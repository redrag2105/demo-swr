import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  getUserFromStorage, 
  clearUserFromStorage, 
  isRememberMeEnabled,
  isSessionValid 
} from "@/utils/auth";
import { Eye, EyeOff, RefreshCw, Trash2, Database, Clock } from "lucide-react";

export default function StorageDemo() {
  const { user, isAuthenticated } = useAuth();
  const [showRawData, setShowRawData] = useState(false);
  const [storageData, setStorageData] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to check storage data
  const checkStorageData = () => {
    const localStorageUser = localStorage.getItem('healthcare_user');
    const sessionStorageUser = sessionStorage.getItem('healthcare_user');
    const rememberFlag = localStorage.getItem('healthcare_remember');
    
    const fromStorage = getUserFromStorage();
    
    setStorageData({
      localStorage: localStorageUser ? JSON.parse(localStorageUser) : null,
      sessionStorage: sessionStorageUser ? JSON.parse(sessionStorageUser) : null,
      rememberFlag,
      fromUtility: fromStorage,
      isRemembered: isRememberMeEnabled(),
      isValid: fromStorage ? isSessionValid(fromStorage) : false
    });
  };

  useEffect(() => {
    checkStorageData();
  }, [refreshKey, user]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    checkStorageData();
  };

  const handleClearStorage = () => {
    clearUserFromStorage();
    setRefreshKey(prev => prev + 1);
    checkStorageData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            LocalStorage Demo
          </h1>
          <p className="text-gray-600">
            Kiểm tra dữ liệu người dùng được lưu trữ trong localStorage và sessionStorage
          </p>
        </div>

        {/* Auth Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Trạng thái xác thực</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Đã đăng nhập:</span>
                  <Badge variant={isAuthenticated ? "default" : "destructive"}>
                    {isAuthenticated ? "Có" : "Không"}
                  </Badge>
                </div>
                {user && (
                  <>
                    <div className="flex items-center justify-between">
                      <span>Người dùng:</span>
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Email:</span>
                      <span className="font-medium">{user.email}</span>
                    </div>
                  </>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Ghi nhớ đăng nhập:</span>
                  <Badge variant={storageData?.isRemembered ? "default" : "secondary"}>
                    {storageData?.isRemembered ? "Có" : "Không"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Session hợp lệ:</span>
                  <Badge variant={storageData?.isValid ? "default" : "destructive"}>
                    {storageData?.isValid ? "Có" : "Không"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Thời gian đăng nhập:</span>
                  <span className="text-sm">
                    {user?.loginTime ? new Date(user.loginTime).toLocaleTimeString('vi-VN') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Storage Data Inspection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Dữ liệu lưu trữ</span>
              </div>
              <div className="space-x-2">
                <Button size="sm" variant="outline" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Làm mới
                </Button>
                <Button size="sm" variant="destructive" onClick={handleClearStorage}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa storage
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* LocalStorage */}
              <Card className="border-blue-200">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="text-lg text-blue-700">LocalStorage</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {storageData?.localStorage ? (
                    <div className="space-y-3">
                      <div className="text-sm space-y-1">
                        <p><strong>Tên:</strong> {storageData.localStorage.name}</p>
                        <p><strong>Email:</strong> {storageData.localStorage.email}</p>
                        <p><strong>Session ID:</strong> <code className="text-xs">{storageData.localStorage.sessionId}</code></p>
                        <p><strong>Thời gian:</strong> {new Date(storageData.localStorage.loginTime).toLocaleString('vi-VN')}</p>
                      </div>
                      <Badge variant="default" className="bg-blue-500">Có dữ liệu</Badge>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      <p>Không có dữ liệu trong localStorage</p>
                      <Badge variant="outline">Trống</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* SessionStorage */}
              <Card className="border-green-200">
                <CardHeader className="bg-green-50">
                  <CardTitle className="text-lg text-green-700">SessionStorage</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {storageData?.sessionStorage ? (
                    <div className="space-y-3">
                      <div className="text-sm space-y-1">
                        <p><strong>Tên:</strong> {storageData.sessionStorage.name}</p>
                        <p><strong>Email:</strong> {storageData.sessionStorage.email}</p>
                        <p><strong>Session ID:</strong> <code className="text-xs">{storageData.sessionStorage.sessionId}</code></p>
                        <p><strong>Thời gian:</strong> {new Date(storageData.sessionStorage.loginTime).toLocaleString('vi-VN')}</p>
                      </div>
                      <Badge variant="default" className="bg-green-500">Có dữ liệu</Badge>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      <p>Không có dữ liệu trong sessionStorage</p>
                      <Badge variant="outline">Trống</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Raw Data View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Dữ liệu thô (JSON)</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowRawData(!showRawData)}
              >
                {showRawData ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showRawData ? "Ẩn" : "Hiện"}
              </Button>
            </CardTitle>
          </CardHeader>
          {showRawData && (
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">localStorage['healthcare_user']:</h4>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                    {localStorage.getItem('healthcare_user') || 'null'}
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium mb-2">sessionStorage['healthcare_user']:</h4>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                    {sessionStorage.getItem('healthcare_user') || 'null'}
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium mb-2">localStorage['healthcare_remember']:</h4>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                    {localStorage.getItem('healthcare_remember') || 'null'}
                  </pre>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Usage Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Hướng dẫn sử dụng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="bg-blue-50 p-3 rounded">
                <p><strong>Tài khoản mẫu:</strong></p>
                <p>Email: user@healthcare.vn</p>
                <p>Mật khẩu: 123456</p>
              </div>
              <div className="space-y-2">
                <p><strong>Cách hoạt động:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Khi chọn "Ghi nhớ đăng nhập": Dữ liệu lưu trong localStorage (tồn tại lâu dài)</li>
                  <li>Khi không chọn "Ghi nhớ": Dữ liệu lưu trong sessionStorage (chỉ tồn tại trong phiên)</li>
                  <li>Session tự động hết hạn sau 8 giờ (hoặc 24 giờ nếu ghi nhớ)</li>
                  <li>Dữ liệu được tự động xóa khi đăng xuất</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
