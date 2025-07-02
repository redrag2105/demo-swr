import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MedicalStaffOnly } from "@/components/RoleGuard";
import { getSampleAccounts } from "@/utils/auth";
import { getUserBookings } from "@/utils/userStorage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageCircle, 
  HelpCircle, 
  Users, 
  Clock,
  CheckCircle,
  Search,
  Send,
  Eye,
  Star,
  Calendar,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Question {
  id: string;
  patientName: string;
  patientEmail: string;
  age: string;
  question: string;
  category: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "answered" | "closed";
  createdAt: string;
  answer?: string;
  answeredAt?: string;
  consultantName?: string;
  rating?: number;
}

interface ConsultationSession {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  time: string;
  duration: number;
  topic: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
}

export default function ConsultantDashboard() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [consultations, setConsultations] = useState<ConsultationSession[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const { toast } = useToast();

  // Load questions and consultations from all users
  useEffect(() => {
    const loadQuestions = () => {
      try {
        const sampleAccounts = getSampleAccounts();
        const allQuestions: Question[] = [];
        
        // Load questions from all customer accounts
        const customerAccounts = sampleAccounts.filter(acc => acc.role === 'customer');
        
        customerAccounts.forEach(customer => {
          const userBookings = getUserBookings(customer.email);
          
          userBookings.forEach((booking: any) => {
            if (booking.type === 'qa') {
              allQuestions.push({
                id: `${customer.email}_${booking.id}`,
                patientName: customer.name,
                patientEmail: customer.email,
                age: booking.details?.age || 25,
                question: booking.details?.question || '',
                category: booking.details?.category || 'Tổng quát',
                priority: booking.details?.urgent ? 'high' : 'medium',
                status: booking.status || 'pending',
                createdAt: booking.createdAt || new Date().toISOString(),
                answer: booking.details?.answer,
                answeredAt: booking.details?.answeredAt,
                consultantName: booking.details?.consultantName,
                rating: booking.details?.rating
              });
            }
          });
        });
        
        setQuestions(allQuestions);
      } catch (error) {
        console.error('Error loading questions:', error);
      }
    };

    const loadConsultations = () => {
      try {
        const sampleAccounts = getSampleAccounts();
        const allConsultations: ConsultationSession[] = [];
        
        // Load consultations from all customer accounts
        const customerAccounts = sampleAccounts.filter(acc => acc.role === 'customer');
        
        customerAccounts.forEach(customer => {
          const userBookings = getUserBookings(customer.email);
          
          userBookings.forEach((booking: any) => {
            if (booking.type === 'consultation') {
              allConsultations.push({
                id: `${customer.email}_${booking.id}`,
                patientName: customer.name,
                patientEmail: customer.email,
                patientPhone: customer.phone || 'Chưa cập nhật',
                date: booking.date,
                time: booking.time,
                duration: 30, // Default 30 minutes
                topic: booking.details?.symptoms || booking.details?.reason || 'Tư vấn sức khỏe',
                status: booking.status === 'pending' ? 'scheduled' : booking.status,
                notes: booking.details?.symptoms || booking.details?.reason || '',
                createdAt: booking.createdAt || new Date().toISOString()
              });
            }
          });
        });
        
        setConsultations(allConsultations);
      } catch (error) {
        console.error('Error loading consultations:', error);
      }
    };

    loadQuestions();
    loadConsultations();
  }, []);

  // Answer a question
  const answerQuestion = () => {
    if (!selectedQuestion || !answer.trim()) return;

    const updatedQuestions = questions.map(q => 
      q.id === selectedQuestion.id 
        ? {
            ...q,
            answer: answer.trim(),
            status: 'answered' as const,
            answeredAt: new Date().toISOString(),
            consultantName: user?.name || 'Tư vấn viên'
          }
        : q
    );

    setQuestions(updatedQuestions);
    
    // Update localStorage
    const qaData = updatedQuestions.map(q => ({
      id: q.id,
      name: q.patientName,
      email: q.patientEmail,
      age: q.age,
      question: q.question,
      category: q.category,
      urgent: q.priority === 'high',
      status: q.status,
      createdAt: q.createdAt,
      answer: q.answer,
      answeredAt: q.answeredAt,
      consultantName: q.consultantName,
      rating: q.rating
    }));
    localStorage.setItem('healthcare_qa_questions', JSON.stringify(qaData));

    setSelectedQuestion(null);
    setAnswer("");

    toast({
      title: "Đã trả lời câu hỏi",
      description: "Câu trả lời đã được gửi đến bệnh nhân",
    });
  };

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || q.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || q.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Get stats
  const pendingQuestions = questions.filter(q => q.status === 'pending').length;
  const answeredToday = questions.filter(q => {
    if (!q.answeredAt) return false;
    const today = new Date().toDateString();
    return new Date(q.answeredAt).toDateString() === today;
  }).length;
  const totalRating = questions.filter(q => q.rating).reduce((sum, q) => sum + (q.rating || 0), 0);
  const ratedQuestions = questions.filter(q => q.rating).length;
  const averageRating = ratedQuestions > 0 ? (totalRating / ratedQuestions).toFixed(1) : "0";

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Khẩn cấp';
      case 'medium': return 'Bình thường';
      default: return 'Thấp';
    }
  };

  return (
    <MedicalStaffOnly>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard Tư vấn viên
            </h1>
            <p className="text-gray-600">
              Chào mừng {user?.name} - Quản lý tư vấn trực tuyến và hỗ trợ bệnh nhân
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-500 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Chờ trả lời</p>
                    <p className="text-2xl font-bold">{pendingQuestions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Trả lời hôm nay</p>
                    <p className="text-2xl font-bold">{answeredToday}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500 p-3 rounded-full">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng câu hỏi</p>
                    <p className="text-2xl font-bold">{questions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-500 p-3 rounded-full">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Đánh giá TB</p>
                    <p className="text-2xl font-bold">{averageRating}/5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="questions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="questions">Câu hỏi</TabsTrigger>
              <TabsTrigger value="consultations">Tư vấn</TabsTrigger>
              <TabsTrigger value="analytics">Thống kê</TabsTrigger>
            </TabsList>

            <TabsContent value="questions" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Quản lý câu hỏi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Tìm kiếm câu hỏi, bệnh nhân..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Lọc theo trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="pending">Chờ trả lời</SelectItem>
                        <SelectItem value="answered">Đã trả lời</SelectItem>
                        <SelectItem value="closed">Đã đóng</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Lọc theo độ ưu tiên" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="high">Khẩn cấp</SelectItem>
                        <SelectItem value="medium">Bình thường</SelectItem>
                        <SelectItem value="low">Thấp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Questions List */}
              <div className="space-y-4">
                {filteredQuestions.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <HelpCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">Không có câu hỏi nào</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredQuestions.map((question) => (
                    <Card key={question.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold">{question.patientName}</h3>
                              <Badge className={getPriorityColor(question.priority)}>
                                {getPriorityText(question.priority)}
                              </Badge>
                              <Badge 
                                variant={
                                  question.status === 'answered' ? 'default' :
                                  question.status === 'closed' ? 'secondary' : 'outline'
                                }
                              >
                                {question.status === 'pending' ? 'Chờ trả lời' :
                                 question.status === 'answered' ? 'Đã trả lời' : 'Đã đóng'}
                              </Badge>
                            </div>

                            <p className="text-gray-700">{question.question}</p>

                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Tuổi: {question.age}</span>
                              <span>Danh mục: {question.category}</span>
                              <span>{formatDate(question.createdAt)}</span>
                            </div>

                            {question.answer && (
                              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                  <MessageCircle className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm font-medium text-blue-700">
                                    Trả lời bởi {question.consultantName}
                                  </span>
                                </div>
                                <p className="text-gray-700">{question.answer}</p>
                                {question.rating && (
                                  <div className="flex items-center space-x-1 mt-2">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i}
                                        className={`h-4 w-4 ${i < question.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                      />
                                    ))}
                                    <span className="text-sm text-gray-600 ml-2">({question.rating}/5)</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex space-x-2 ml-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setSelectedQuestion(question)}
                                  disabled={question.status === 'answered'}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                            </Dialog>

                            {question.status === 'pending' && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm"
                                    onClick={() => setSelectedQuestion(question)}
                                  >
                                    <Send className="h-4 w-4 mr-2" />
                                    Trả lời
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Trả lời câu hỏi</DialogTitle>
                                    <DialogDescription>
                                      Câu hỏi từ {question.patientName}
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                      <p className="font-medium mb-2">Câu hỏi:</p>
                                      <p className="text-gray-700">{question.question}</p>
                                    </div>
                                    
                                    <div>
                                      <label className="block text-sm font-medium mb-2">
                                        Câu trả lời:
                                      </label>
                                      <Textarea
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                        placeholder="Nhập câu trả lời của bạn..."
                                        rows={6}
                                      />
                                    </div>
                                  </div>

                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => {
                                      setSelectedQuestion(null);
                                      setAnswer("");
                                    }}>
                                      Hủy
                                    </Button>
                                    <Button onClick={answerQuestion} disabled={!answer.trim()}>
                                      <Send className="h-4 w-4 mr-2" />
                                      Gửi trả lời
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="consultations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch tư vấn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {consultations.length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">Chưa có lịch tư vấn nào</p>
                      </div>
                    ) : (
                      consultations.map((consultation) => (
                        <Card key={consultation.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <h4 className="font-semibold">{consultation.patientName}</h4>
                                <p className="text-sm text-gray-600">{consultation.topic}</p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(consultation.date)} - {consultation.time}
                                </p>
                              </div>
                              <Badge variant="outline">{consultation.status}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thống kê hiệu suất</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Tính năng thống kê đang được phát triển</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MedicalStaffOnly>
  );
}
