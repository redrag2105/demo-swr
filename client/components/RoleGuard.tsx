import { useAuth } from "@/contexts/AuthContext";
import { hasRole, isAdmin, isMedicalStaff, getRoleDisplayName } from "@/utils/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShieldX } from "lucide-react";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRoles: string[];
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  requiredRoles, 
  fallback 
}) => {
  const { user, isAuthenticated } = useAuth();
  
  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <ShieldX className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Yêu cầu đăng nhập
            </h3>
            <p className="text-gray-600 mb-6">
              Vui lòng đăng nhập để truy cập trang này
            </p>
            <Button asChild>
              <Link to="/login">Đăng nhập</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If authenticated but doesn't have required role
  if (!hasRole(user?.role || '', requiredRoles)) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <ShieldX className="mx-auto h-16 w-16 text-red-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có quyền truy cập
            </h3>
            <p className="text-gray-600 mb-2">
              Trang này chỉ dành cho: {requiredRoles.map(role => getRoleDisplayName(role)).join(', ')}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Vai trò hiện tại: {getRoleDisplayName(user?.role || '')}
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/">Về trang chủ</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/profile">Xem thông tin tài khoản</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user has required role, render children
  return <>{children}</>;
};

// Convenience components for specific roles
export const AdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <RoleGuard requiredRoles={['admin']} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const MedicalStaffOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <RoleGuard requiredRoles={['doctor', 'consultant', 'admin']} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const DoctorOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <RoleGuard requiredRoles={['doctor', 'admin']} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const ConsultantOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <RoleGuard requiredRoles={['consultant', 'admin']} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const CustomerOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <RoleGuard requiredRoles={['customer']} fallback={fallback}>
    {children}
  </RoleGuard>
);

// Hook for role checking in components
export const useRoles = () => {
  const { user } = useAuth();
  
  return {
    userRole: user?.role || '',
    isAdmin: isAdmin(user?.role || ''),
    isMedicalStaff: isMedicalStaff(user?.role || ''),
    hasRole: (roles: string[]) => hasRole(user?.role || '', roles),
    roleDisplayName: getRoleDisplayName(user?.role || '')
  };
};
