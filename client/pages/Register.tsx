import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface RegisterFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Vui lòng nhập họ";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Vui lòng nhập tên";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (10-11 số)";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "Vui lòng chọn ngày sinh";
    } else {
      const age = calculateAge(formData.birthDate);
      if (age < 13) {
        newErrors.birthDate = "Phải từ 13 tuổi trở lên";
      } else if (age > 120) {
        newErrors.birthDate = "Ngày sinh không hợp lệ";
      }
    }

    if (!formData.gender) {
      newErrors.gender = "Vui lòng chọn giới tính";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "Vui lòng đồng ý với điều khoản sử dụng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if email already exists (simulate checking against existing users)
  const checkEmailExists = (email: string): boolean => {
    // Check against sample account and any stored registrations
    const sampleEmail = "user@healthcare.vn";
    if (email === sampleEmail) return true;

    // Check localStorage for existing registrations
    const existingUsers = JSON.parse(localStorage.getItem('healthcare_registered_users') || '[]');
    return existingUsers.some((user: any) => user.email === email);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Lỗi validation",
        description: "Vui lòng kiểm tra lại thông tin đã nhập",
      });
      return;
    }

    if (checkEmailExists(formData.email)) {
      setErrors({ email: "Email này đã được sử dụng" });
      toast({
        variant: "destructive",
        title: "Email đã tồn tại",
        description: "Vui lòng sử dụng email khác hoặc đăng nhập",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create user data
      const newUser = {
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        role: "patient",
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.birthDate,
          age: calculateAge(formData.birthDate),
          gender: formData.gender === 'male' ? 'Nam' : formData.gender === 'female' ? 'Nữ' : 'Khác',
          registeredAt: new Date().toISOString()
        },
        loginTime: new Date().toISOString(),
        sessionId: Math.random().toString(36).substring(2, 15)
      };

      // Save to registered users list
      const existingUsers = JSON.parse(localStorage.getItem('healthcare_registered_users') || '[]');
      existingUsers.push({
        ...newUser,
        password: formData.password // In real app, this would be hashed
      });
      localStorage.setItem('healthcare_registered_users', JSON.stringify(existingUsers));

      // Auto login the new user
      login(newUser, true); // Auto remember for new registrations

      toast({
        title: "Đăng ký thành công!",
        description: `Chào mừng ${newUser.name} đến với HealthCare+`,
      });

      // Redirect to home page
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi đăng ký",
        description: "Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof RegisterFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field as keyof RegisterFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field as keyof RegisterFormErrors]: undefined
      }));
    }
  };

  // Auto-fill demo data
  const fillDemoData = () => {
    setFormData({
      firstName: "Nguyễn",
      lastName: "Thị B",
      email: "demo@healthcare.vn",
      phone: "0987654321",
      birthDate: "1995-05-15",
      gender: "female",
      password: "123456789",
      confirmPassword: "123456789",
      agreeToTerms: true,
    });

    toast({
      title: "Đã điền thông tin mẫu",
      description: "Kiểm tra và chỉnh sửa thông tin nếu cần",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-medical-500">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Đăng ký tài khoản</CardTitle>
          <CardDescription>
            Tạo tài khoản HealthCare+ để bắt đầu chăm sóc sức khỏe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Demo Data Button */}
          <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
            <p className="text-sm text-green-700 mb-2">
              <strong>Thử nghiệm nhanh:</strong>
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fillDemoData}
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              Điền thông tin mẫu
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Họ</Label>
                <Input 
                  id="firstName" 
                  placeholder="Nguyễn" 
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={errors.firstName ? "border-red-500" : ""}
                  required 
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Tên</Label>
                <Input 
                  id="lastName" 
                  placeholder="Văn A" 
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={errors.lastName ? "border-red-500" : ""}
                  required 
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? "border-red-500" : ""}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="0901234567" 
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={errors.phone ? "border-red-500" : ""}
                required 
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Ngày sinh</Label>
              <Input 
                id="birthDate" 
                type="date" 
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                className={errors.birthDate ? "border-red-500" : ""}
                max={new Date(Date.now() - 13 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                required 
              />
              {errors.birthDate && (
                <p className="text-sm text-red-500">{errors.birthDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Giới tính</Label>
              <Select 
                value={formData.gender} 
                onValueChange={(value) => handleInputChange('gender', value)}
              >
                <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Nữ</SelectItem>
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tối thiểu 8 ký tự"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={errors.password ? "border-red-500" : ""}
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
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeToTerms', !!checked)}
                />
                <Label htmlFor="terms" className="text-sm">
                  Tôi đồng ý với{" "}
                  <Link
                    to="/terms"
                    className="text-medical-600 hover:text-medical-700"
                  >
                    Điều khoản sử dụng
                  </Link>{" "}
                  và{" "}
                  <Link
                    to="/privacy"
                    className="text-medical-600 hover:text-medical-700"
                  >
                    Chính sách bảo mật
                  </Link>
                </Label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
              )}
            </div>

            <Button className="w-full" size="lg" type="submit" disabled={isLoading}>
              {isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-medical-600 hover:text-medical-700 font-medium"
            >
              Đăng nhập
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
