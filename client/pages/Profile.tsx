import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Edit,
  Save,
  X,
  LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getRoleDisplayName } from "@/utils/auth";

export default function Profile() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name,
        phone: user.phone,
        email: user.email
      });
    }
  }, [user]);

  const handleSave = () => {
    if (!editData.name.trim() || !editData.email.trim()) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
      });
      return;
    }

    // In a real app, this would update via API
    setIsEditing(false);
    toast({
      title: "Cập nhật thành công",
      description: "Thông tin cá nhân đã được cập nhật",
    });
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-gray-600">Vui lòng đăng nhập để xem thông tin cá nhân</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Không xác định';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thông tin cá nhân
          </h1>
          <p className="text-gray-600">
            Quản lý thông tin tài khoản của bạn
          </p>
        </div>

        {/* Profile Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <User className="h-12 w-12 text-white" />
            </div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <div className="flex justify-center">
              <Badge className="bg-blue-100 text-blue-800">
                {getRoleDisplayName(user.role)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Họ và tên</span>
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 p-2 bg-gray-50 rounded-md">{user.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 p-2 bg-gray-50 rounded-md">{user.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Số điện thoại</span>
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editData.phone}
                      onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 p-2 bg-gray-50 rounded-md">{user.phone}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Ngày đăng nhập</span>
                  </Label>
                  <p className="mt-1 p-2 bg-gray-50 rounded-md">
                    {formatDate(user.loginTime)}
                  </p>
                </div>

                <div>
                  <Label className="flex items-center space-x-2">
                    <span>🏷️</span>
                    <span>Vai trò</span>
                  </Label>
                  <p className="mt-1 p-2 bg-gray-50 rounded-md">
                    {getRoleDisplayName(user.role)}
                  </p>
                </div>

                <div>
                  <Label className="flex items-center space-x-2">
                    <span>🆔</span>
                    <span>Session ID</span>
                  </Label>
                  <p className="mt-1 p-2 bg-gray-50 rounded-md text-xs font-mono">
                    {user.sessionId.substring(0, 16)}...
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-6 border-t">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Lưu thay đổi</span>
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="flex items-center space-x-2">
                    <X className="h-4 w-4" />
                    <span>Hủy</span>
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
                  <Edit className="h-4 w-4" />
                  <span>Chỉnh sửa</span>
                </Button>
              )}
              <Button 
                variant="destructive" 
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle>Bảo mật tài khoản</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Tính năng quản lý mật khẩu và bảo mật đang được phát triển
              </p>
              <Button variant="outline" disabled>
                Đổi mật khẩu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
