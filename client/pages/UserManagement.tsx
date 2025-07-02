import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AdminOnly } from "@/components/RoleGuard";
import { getSampleAccounts, getRoleDisplayName } from "@/utils/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search, 
  Trash2, 
  Eye, 
  UserCheck,
  Calendar,
  Mail,
  Phone,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface RegisteredUser {
  email: string;
  name: string;
  phone: string;
  role: string;
  password: string;
  profile: {
    firstName: string;
    lastName: string;
    birthDate: string;
    age: number;
    gender: string;
    registeredAt: string;
  };
}

export default function UserManagement() {
  const { user, isAuthenticated } = useAuth();
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<RegisteredUser[]>([]);
  const { toast } = useToast();
  
  // Get sample accounts
  const sampleAccounts = getSampleAccounts();

  // Load registered users from localStorage
  const loadUsers = () => {
    try {
      const users = JSON.parse(localStorage.getItem('healthcare_registered_users') || '[]');
      setRegisteredUsers(users);
      setFilteredUsers(users);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách người dùng",
      });
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(registeredUsers);
    } else {
      const filtered = registeredUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, registeredUsers]);

  // Delete user
  const deleteUser = (email: string) => {
    try {
      const updatedUsers = registeredUsers.filter(user => user.email !== email);
      localStorage.setItem('healthcare_registered_users', JSON.stringify(updatedUsers));
      setRegisteredUsers(updatedUsers);
      
      toast({
        title: "Đã xóa người dùng",
        description: `Người dùng ${email} đã được xóa khỏi hệ thống`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa người dùng",
      });
    }
  };

  // Clear all users
  const clearAllUsers = () => {
    try {
      localStorage.removeItem('healthcare_registered_users');
      setRegisteredUsers([]);
      setFilteredUsers([]);
      
      toast({
        title: "Đã xóa tất cả người dùng",
        description: "Danh sách người dùng đã được làm sạch",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa người dùng",
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Không xác định';
    }
  };

  return (
    <AdminOnly>
      <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý người dùng
          </h1>
          <p className="text-gray-600">
            Xem và quản lý danh sách người dùng đã đăng ký
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 p-3 rounded-full">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng người dùng</p>
                  <p className="text-2xl font-bold">{registeredUsers.length + sampleAccounts.length}</p>
                  <p className="text-xs text-gray-500">+{sampleAccounts.length} tài khoản mẫu</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 p-3 rounded-full">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Đã đăng ký</p>
                  <p className="text-2xl font-bold">{registeredUsers.length}</p>
                  <p className="text-xs text-gray-500">Qua form đăng ký</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-500 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Đăng ký mới nhất</p>
                  <p className="text-sm font-medium">
                    {registeredUsers.length > 0 
                      ? formatDate(registeredUsers[registeredUsers.length - 1]?.profile?.registeredAt)
                      : 'Chưa có'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Tìm kiếm người dùng</span>
              </CardTitle>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={loadUsers}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Làm mới
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive" disabled={registeredUsers.length === 0}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa tất cả
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận xóa tất cả</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc muốn xóa tất cả {registeredUsers.length} người dùng đã đăng ký? 
                        Hành động này không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction onClick={clearAllUsers}>
                        Xóa tất cả
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm theo tên, email hoặc số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sample Accounts */}
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-700">Tài khoản mẫu (Built-in)</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid gap-4">
              {sampleAccounts.map((account, index) => (
                <div key={account.email} className="grid md:grid-cols-3 gap-4 p-3 border rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{account.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{account.name}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{account.phone}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Mật khẩu: {account.password}
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <Badge 
                      variant="default" 
                      className={`
                        ${account.role === 'admin' ? 'bg-red-500' : 
                          account.role === 'doctor' ? 'bg-green-500' : 
                          account.role === 'consultant' ? 'bg-purple-500' : 
                          account.role === 'customer' ? 'bg-blue-500' : 'bg-gray-500'}
                      `}
                    >
                      {getRoleDisplayName(account.role)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Người dùng đã đăng ký ({filteredUsers.length})
          </h2>
          
          {filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  {searchTerm ? 'Không tìm thấy người dùng nào' : 'Chưa có người dùng nào đăng ký'}
                </p>
                {searchTerm && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setSearchTerm('')}
                  >
                    Xóa bộ lọc
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredUsers.map((user, index) => (
                <Card key={user.email} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 grid md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{user.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{user.email}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{user.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {user.profile.age} tuổi • {user.profile.gender}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {formatDate(user.profile.registeredAt)}
                            </span>
                          </div>
                          <Badge variant="outline">
                            {getRoleDisplayName(user.role)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc muốn xóa người dùng "{user.name}" ({user.email})?
                                Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteUser(user.email)}>
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </AdminOnly>
  );
}
