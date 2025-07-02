import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CustomerOnly } from "@/components/RoleGuard";
import {
  Calendar,
  Bell,
  Heart,
  TrendingUp,
  Plus,
  Droplets,
  Moon,
  Sun,
  AlertCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getUserCycleData, 
  saveUserCycleData, 
  getUserCycleSettings, 
  saveUserCycleSettings 
} from "@/utils/userStorage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CycleDay {
  date: string;
  period: boolean;
  symptoms: string[];
  mood: string;
  notes: string;
}

interface CyclePrediction {
  nextPeriod: string;
  ovulation: string;
  fertilityWindow: { start: string; end: string };
  cycleLength: number;
}

export default function CycleTracking() {
  const [cycleDays, setCycleDays] = useState<CycleDay[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [lastPeriodDate, setLastPeriodDate] = useState("");
  const [averageCycleLength, setAverageCycleLength] = useState(28);
  const [currentDay, setCurrentDay] = useState<Partial<CycleDay>>({
    symptoms: [],
    mood: "",
    notes: "",
  });
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [prediction, setPrediction] = useState<CyclePrediction | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Check authentication and load data
  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để theo dõi chu kỳ sinh sản",
      });
      navigate("/login");
      return;
    }

    // Load user cycle data
    if (user?.email) {
      const savedCycleData = getUserCycleData(user.email);
      const savedSettings = getUserCycleSettings(user.email);
      
      setCycleDays(savedCycleData);
      setLastPeriodDate(savedSettings.lastPeriodDate);
      setAverageCycleLength(savedSettings.averageCycleLength);
    }
  }, [isAuthenticated, isLoading, navigate, toast, user]);

  // Save cycle data when it changes
  useEffect(() => {
    if (user?.email && cycleDays.length > 0) {
      saveUserCycleData(user.email, cycleDays);
    }
  }, [cycleDays, user]);

  // Save settings when they change
  useEffect(() => {
    if (user?.email && (lastPeriodDate || averageCycleLength !== 28)) {
      saveUserCycleSettings(user.email, { lastPeriodDate, averageCycleLength });
    }
  }, [lastPeriodDate, averageCycleLength, user]);

  const symptoms = [
    "Đau bụng",
    "Đau lưng",
    "Buồn nôn",
    "Đau đầu",
    "Căng thẳng vú",
    "Mệt mỏi",
    "Thay đổi cảm xúc",
    "Tăng cường ham muốn",
    "Dịch tiết âm đạo tăng",
    "Mụn trứng cá",
  ];

  const moods = [
    { value: "happy", label: "Vui vẻ", icon: "😊" },
    { value: "neutral", label: "Bình thường", icon: "😐" },
    { value: "sad", label: "Buồn", icon: "😢" },
    { value: "angry", label: "Tức giận", icon: "😠" },
    { value: "anxious", label: "Lo lắng", icon: "😰" },
    { value: "energetic", label: "Năng động", icon: "💪" },
  ];

  // Calculate predictions based on last period and cycle length
  useEffect(() => {
    if (lastPeriodDate && averageCycleLength) {
      const lastPeriod = new Date(lastPeriodDate);
      const nextPeriodDate = new Date(lastPeriod);
      nextPeriodDate.setDate(lastPeriod.getDate() + averageCycleLength);

      const ovulationDate = new Date(lastPeriod);
      ovulationDate.setDate(
        lastPeriod.getDate() + Math.round(averageCycleLength / 2),
      );

      const fertilityStart = new Date(ovulationDate);
      fertilityStart.setDate(ovulationDate.getDate() - 5);

      const fertilityEnd = new Date(ovulationDate);
      fertilityEnd.setDate(ovulationDate.getDate() + 1);

      setPrediction({
        nextPeriod: nextPeriodDate.toISOString().split("T")[0],
        ovulation: ovulationDate.toISOString().split("T")[0],
        fertilityWindow: {
          start: fertilityStart.toISOString().split("T")[0],
          end: fertilityEnd.toISOString().split("T")[0],
        },
        cycleLength: averageCycleLength,
      });
    }
  }, [lastPeriodDate, averageCycleLength]);

  const handleSymptomToggle = (symptom: string) => {
    const currentSymptoms = currentDay.symptoms || [];
    const updatedSymptoms = currentSymptoms.includes(symptom)
      ? currentSymptoms.filter((s) => s !== symptom)
      : [...currentSymptoms, symptom];

    setCurrentDay({ ...currentDay, symptoms: updatedSymptoms });
  };

  const handleSaveEntry = () => {
    const newEntry: CycleDay = {
      date: selectedDate,
      period: currentDay.period || false,
      symptoms: currentDay.symptoms || [],
      mood: currentDay.mood || "",
      notes: currentDay.notes || "",
    };

    setCycleDays((prev) => {
      const filtered = prev.filter((day) => day.date !== selectedDate);
      return [...filtered, newEntry].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    });

    setCurrentDay({ symptoms: [], mood: "", notes: "" });
    setShowAddEntry(false);
    toast({
      title: "Đã lưu thông tin",
      description: "Thông tin chu kỳ đã được cập nhật",
    });
  };

  const getDaysUntilNextPeriod = () => {
    if (!prediction) return null;
    const today = new Date();
    const nextPeriod = new Date(prediction.nextPeriod);
    const diffTime = nextPeriod.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isInFertilityWindow = () => {
    if (!prediction) return false;
    const today = new Date().toISOString().split("T")[0];
    return (
      today >= prediction.fertilityWindow.start &&
      today <= prediction.fertilityWindow.end
    );
  };

  const isOvulationDay = () => {
    if (!prediction) return false;
    const today = new Date().toISOString().split("T")[0];
    return today === prediction.ovulation;
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang kiểm tra đăng nhập...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <CustomerOnly>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <Calendar className="mx-auto h-16 w-16 text-medical-500" />
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Theo dõi chu kỳ sinh sản
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Quản lý và theo dõi chu kỳ kinh nguyệt một cách khoa học và chính
                xác
              </p>
            </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Setup Section */}
        {!lastPeriodDate && (
          <Card className="mb-8 border-medical-200 bg-medical-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5 text-medical-600" />
                Thiết lập theo dõi chu kỳ
              </CardTitle>
              <CardDescription>
                Để bắt đầu theo dõi, vui lòng nhập thông tin chu kỳ cuối cùng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lastPeriod">Ngày đầu kỳ kinh cuối</Label>
                  <Input
                    id="lastPeriod"
                    type="date"
                    value={lastPeriodDate}
                    onChange={(e) => setLastPeriodDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cycleLength">
                    Độ dài chu kỳ trung bình (ngày)
                  </Label>
                  <Input
                    id="cycleLength"
                    type="number"
                    min="21"
                    max="35"
                    value={averageCycleLength}
                    onChange={(e) =>
                      setAverageCycleLength(parseInt(e.target.value))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Status */}
        {prediction && (
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-medical-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Kỳ kinh tiếp theo
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {getDaysUntilNextPeriod()} ngày
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={isOvulationDay() ? "ring-2 ring-pink-300" : ""}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Sun className="h-8 w-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Ngày rụng trứng
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(prediction.ovulation).toLocaleDateString(
                        "vi-VN",
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={isInFertilityWindow() ? "ring-2 ring-green-300" : ""}
            >
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Heart className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Cửa sổ sinh sản
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(
                        prediction.fertilityWindow.start,
                      ).toLocaleDateString("vi-VN")}{" "}
                      -{" "}
                      {new Date(
                        prediction.fertilityWindow.end,
                      ).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Độ dài chu kỳ
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {prediction.cycleLength} ngày
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Alerts */}
        {isInFertilityWindow() && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 border border-green-200">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Đang trong cửa sổ sinh sản
                </h3>
                <p className="mt-1 text-sm text-green-700">
                  Đây là thời gian khả năng thụ thai cao nhất trong chu kỳ của
                  bạn.
                </p>
              </div>
            </div>
          </div>
        )}

        {isOvulationDay() && (
          <div className="mb-6 rounded-lg bg-pink-50 p-4 border border-pink-200">
            <div className="flex">
              <Sun className="h-5 w-5 text-pink-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-pink-800">
                  Hôm nay là ngày rụng trứng
                </h3>
                <p className="mt-1 text-sm text-pink-700">
                  Đây là ngày khả năng thụ thai cao nhất trong chu kỳ.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Add Daily Entry */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Nhật ký chu kỳ</CardTitle>
                    <CardDescription>
                      Ghi lại thông tin hàng ngày về chu kỳ và triệu chứng
                    </CardDescription>
                  </div>
                  <Dialog open={showAddEntry} onOpenChange={setShowAddEntry}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm ghi chú
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Thêm thông tin ngày</DialogTitle>
                        <DialogDescription>
                          Nhập thông tin cho ngày{" "}
                          {new Date(selectedDate).toLocaleDateString("vi-VN")}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="entryDate">Ngày</Label>
                          <Input
                            id="entryDate"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Có kinh nguyệt?</Label>
                          <div className="flex items-center space-x-4">
                            <Button
                              variant={
                                currentDay.period ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                setCurrentDay({ ...currentDay, period: true })
                              }
                            >
                              <Droplets className="mr-2 h-4 w-4" />
                              Có
                            </Button>
                            <Button
                              variant={
                                !currentDay.period ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                setCurrentDay({ ...currentDay, period: false })
                              }
                            >
                              Không
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Triệu chứng</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {symptoms.map((symptom) => (
                              <Button
                                key={symptom}
                                variant={
                                  currentDay.symptoms?.includes(symptom)
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => handleSymptomToggle(symptom)}
                              >
                                {symptom}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Tâm trạng</Label>
                          <Select
                            value={currentDay.mood}
                            onValueChange={(value) =>
                              setCurrentDay({ ...currentDay, mood: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn tâm trạng" />
                            </SelectTrigger>
                            <SelectContent>
                              {moods.map((mood) => (
                                <SelectItem key={mood.value} value={mood.value}>
                                  {mood.icon} {mood.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="notes">Ghi chú</Label>
                          <Textarea
                            id="notes"
                            placeholder="Ghi chú thêm..."
                            value={currentDay.notes}
                            onChange={(e) =>
                              setCurrentDay({
                                ...currentDay,
                                notes: e.target.value,
                              })
                            }
                          />
                        </div>

                        <Button onClick={handleSaveEntry} className="w-full">
                          Lưu thông tin
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {cycleDays.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      Chưa có dữ liệu
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Bắt đầu ghi lại thông tin chu kỳ của bạn
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cycleDays.slice(-7).map((day) => (
                      <div
                        key={day.date}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-lg font-bold">
                              {new Date(day.date).getDate()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(day.date).toLocaleDateString("vi-VN", {
                                month: "short",
                              })}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              {day.period && (
                                <Badge variant="destructive">
                                  <Droplets className="mr-1 h-3 w-3" />
                                  Kinh nguyệt
                                </Badge>
                              )}
                              {day.mood && (
                                <Badge variant="secondary">
                                  {
                                    moods.find((m) => m.value === day.mood)
                                      ?.icon
                                  }{" "}
                                  {
                                    moods.find((m) => m.value === day.mood)
                                      ?.label
                                  }
                                </Badge>
                              )}
                            </div>
                            {day.symptoms.length > 0 && (
                              <div className="mt-1 text-sm text-gray-600">
                                {day.symptoms.join(", ")}
                              </div>
                            )}
                            {day.notes && (
                              <div className="mt-1 text-sm text-gray-600">
                                {day.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Insights & Tips */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Thống kê chu kỳ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Độ dài chu kỳ</span>
                  <span className="font-medium">{averageCycleLength} ngày</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ghi chú đã tạo</span>
                  <span className="font-medium">{cycleDays.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Kinh nguyệt gần nhất
                  </span>
                  <span className="font-medium">
                    {lastPeriodDate
                      ? new Date(lastPeriodDate).toLocaleDateString("vi-VN")
                      : "Chưa có"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Nhắc nhở
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg bg-medical-50 p-3">
                  <div className="text-sm font-medium text-medical-800">
                    💊 Uống thuốc tránh thai
                  </div>
                  <div className="text-xs text-medical-600">
                    Nhắc nhở hàng ngày lúc 8:00 PM
                  </div>
                </div>
                <div className="rounded-lg bg-blue-50 p-3">
                  <div className="text-sm font-medium text-blue-800">
                    🌡️ Đo thân nhiệt cơ bản
                  </div>
                  <div className="text-xs text-blue-600">
                    Nhắc nhở hàng sáng lúc 6:00 AM
                  </div>
                </div>
                <div className="rounded-lg bg-green-50 p-3">
                  <div className="text-sm font-medium text-green-800">
                    📝 Ghi chú triệu chứng
                  </div>
                  <div className="text-xs text-green-600">
                    Nhắc nhở hàng tối lúc 9:00 PM
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </CustomerOnly>
  );
}
