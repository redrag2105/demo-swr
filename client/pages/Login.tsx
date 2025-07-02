import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getSampleAccounts, getRoleDisplayName } from "@/utils/auth";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  
  // Get sample accounts data
  const SAMPLE_ACCOUNTS = getSampleAccounts();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let userFound = false;
      let userSession = null;

      // Check sample accounts first
      const foundSampleAccount = SAMPLE_ACCOUNTS.find(account => 
        account.email === email && account.password === password
      );
      
      if (foundSampleAccount) {
        userSession = {
          email: foundSampleAccount.email,
          name: foundSampleAccount.name,
          phone: foundSampleAccount.phone,
          role: foundSampleAccount.role,
          loginTime: new Date().toISOString(),
          sessionId: Math.random().toString(36).substring(2, 15)
        };
        userFound = true;
      } else {
        // Check registered users
        const registeredUsers = JSON.parse(localStorage.getItem('healthcare_registered_users') || '[]');
        const foundUser = registeredUsers.find((user: any) => 
          user.email === email && user.password === password
        );

        if (foundUser) {
          userSession = {
            email: foundUser.email,
            name: foundUser.name,
            phone: foundUser.phone,
            role: foundUser.role,
            loginTime: new Date().toISOString(),
            sessionId: Math.random().toString(36).substring(2, 15)
          };
          userFound = true;
        }
      }

      if (userFound && userSession) {
        // Update auth context with remember me option
        login(userSession, rememberMe);

        toast({
          title: "Đăng nhập thành công!",
          description: `Chào mừng ${userSession.name} quay trở lại`,
        });

        // Redirect to home page after successful login
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast({
          variant: "destructive",
          title: "Đăng nhập thất bại",
          description: "Email hoặc mật khẩu không chính xác",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Có lỗi xảy ra trong quá trình đăng nhập",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fill sample account credentials
  const fillSampleAccount = (account: any) => {
    setEmail(account.email);
    setPassword(account.password);
    toast({
      title: "Đã điền thông tin mẫu",
      description: `${getRoleDisplayName(account.role)}: ${account.email}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-medical-500">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>
            Đăng nhập vào tài khoản HealthCare+ của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
            <p className="text-sm font-medium text-blue-700 mb-3">
              🎯 Tài khoản mẫu theo vai trò:
            </p>
            <div className="space-y-2">
              {SAMPLE_ACCOUNTS.map((account, index) => (
                <div key={account.email} className="flex items-center justify-between bg-white rounded p-2">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-900">
                      {getRoleDisplayName(account.role)}
                    </p>
                    <p className="text-xs text-gray-600">{account.email}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1"
                    onClick={() => fillSampleAccount(account)}
                  >
                    Sử dụng
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-3">
              <em>💡 Mật khẩu cho tất cả tài khoản: [role]123 (vd: admin123)</em>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-medical-600 focus:ring-medical-500"
                />
                <Label htmlFor="remember" className="text-sm">
                  Ghi nhớ đăng nhập
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-medical-600 hover:text-medical-700"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Button className="w-full" size="lg" type="submit" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-medical-600 hover:text-medical-700 font-medium"
            >
              Đăng ký ngay
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
