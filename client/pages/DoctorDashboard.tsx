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
  Stethoscope, 
  Calendar, 
  Users, 
  ClipboardList,
  CheckCircle,
  Clock,
  Search,
  FileText,
  Phone,
  MapPin,
  AlertCircle
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

interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  service: string;
  date: string;
  time: string;
  location: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  price: string;
  createdAt: string;
}

interface PatientRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  medicalHistory: string[];
  lastVisit: string;
  totalVisits: number;
}

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  // Load appointments from all users
  useEffect(() => {
    const loadAppointments = () => {
      try {
        const sampleAccounts = getSampleAccounts();
        const allAppointments: Appointment[] = [];
        
        // Load appointments from all customer accounts (including sample customers)
        const customerAccounts = sampleAccounts.filter(acc => acc.role === 'customer');
        
        customerAccounts.forEach(customer => {
          // Get all bookings for this customer
          const userBookings = getUserBookings(customer.email);
          
          // Add all bookings as appointments (only testing for doctors)
          userBookings.forEach((booking: any) => {
            if (booking.type === 'testing') {
              allAppointments.push({
                id: `${customer.email}_${booking.id}`,
                patientName: customer.name,
                patientEmail: customer.email,
                patientPhone: customer.phone || 'Chưa cập nhật',
                service: booking.title || 'Xét nghiệm',
                date: booking.date,
                time: booking.time || '09:00',
                location: booking.location || 'Phòng khám',
                status: booking.status || 'pending',
                price: booking.price || '500.000đ',
                createdAt: booking.createdAt || new Date().toISOString(),
                notes: booking.details?.notes || ''
              });
            }
          });
        });

        setAppointments(allAppointments);
      } catch (error) {
        console.error('Error loading appointments:', error);
      }
    };

    loadAppointments();
  }, []);

  // Update appointment status
  const updateAppointmentStatus = (appointmentId: string, newStatus: string, notes?: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: newStatus as any, notes }
          : apt
      )
    );

    toast({
      title: "Cập nhật thành công",
      description: `Đã cập nhật trạng thái cuộc hẹn`,
    });
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get appointments by status
  const pendingAppointments = appointments.filter(apt => apt.status === 'pending').length;
  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.date === today;
  }).length;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <MedicalStaffOnly>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard Bác sĩ - Xét nghiệm STIs
            </h1>
            <p className="text-gray-600">
              Chào mừng Dr. {user?.name} - Quản lý lịch xét nghiệm và bệnh nhân
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng lịch hẹn</p>
                    <p className="text-2xl font-bold">{appointments.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-500 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Chờ xác nhận</p>
                    <p className="text-2xl font-bold">{pendingAppointments}</p>
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
                    <p className="text-sm text-gray-600">Hôm nay</p>
                    <p className="text-2xl font-bold">{todayAppointments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-500 p-3 rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bệnh nhân</p>
                    <p className="text-2xl font-bold">{new Set(appointments.map(apt => apt.patientEmail)).size}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="appointments" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="appointments">Lịch hẹn</TabsTrigger>
              <TabsTrigger value="patients">Bệnh nhân</TabsTrigger>
              <TabsTrigger value="schedule">Lịch làm việc</TabsTrigger>
            </TabsList>

            <TabsContent value="appointments" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Quản lý lịch hẹn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Tìm kiếm bệnh nhân, dịch vụ..."
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
                        <SelectItem value="pending">Chờ xác nhận</SelectItem>
                        <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                        <SelectItem value="completed">Hoàn thành</SelectItem>
                        <SelectItem value="cancelled">Đã hủy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Appointments List */}
              <div className="space-y-4">
                {filteredAppointments.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">Không có lịch hẹn nào</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <h3 className="font-semibold text-lg">{appointment.patientName}</h3>
                              <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4" />
                                  <span>{appointment.patientPhone}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <FileText className="h-4 w-4" />
                                  <span>{appointment.patientEmail}</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Stethoscope className="h-4 w-4 text-blue-500" />
                                <span className="font-medium">{appointment.service}</span>
                              </div>
                              <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>{formatDate(appointment.date)} - {appointment.time}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{appointment.location}</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Badge 
                                variant={
                                  appointment.status === 'completed' ? 'default' :
                                  appointment.status === 'confirmed' ? 'secondary' :
                                  appointment.status === 'cancelled' ? 'destructive' : 'outline'
                                }
                              >
                                {appointment.status === 'pending' ? 'Chờ xác nhận' :
                                 appointment.status === 'confirmed' ? 'Đã xác nhận' :
                                 appointment.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                              </Badge>
                              <p className="text-sm font-medium text-green-600">{appointment.price}</p>
                            </div>
                          </div>

                          <div className="flex flex-col space-y-2 ml-4">
                            <Select 
                              value={appointment.status} 
                              onValueChange={(value) => updateAppointmentStatus(appointment.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Chờ xác nhận</SelectItem>
                                <SelectItem value="confirmed">Xác nhận</SelectItem>
                                <SelectItem value="completed">Hoàn thành</SelectItem>
                                <SelectItem value="cancelled">Hủy</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{appointment.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="patients" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Danh sách bệnh nhân</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Tính năng quản lý hồ sơ bệnh nhân đang được phát triển</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch làm việc</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Tính năng quản lý lịch làm việc đang được phát triển</p>
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
