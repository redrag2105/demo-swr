// Utility functions for localStorage operations

export const AUTH_STORAGE_KEY = 'healthcare_user';
export const REMEMBER_STORAGE_KEY = 'healthcare_remember';

export interface StoredUser {
  email: string;
  name: string;
  phone: string;
  role: string;
  loginTime: string;
  sessionId: string;
}

/**
 * Save user data to storage
 */
export const saveUserToStorage = (user: StoredUser, remember: boolean = false): void => {
  try {
    const userData = JSON.stringify(user);
    
    if (remember) {
      localStorage.setItem(AUTH_STORAGE_KEY, userData);
      localStorage.setItem(REMEMBER_STORAGE_KEY, 'true');
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, userData);
    }
  } catch (error) {
    console.error('Error saving user to storage:', error);
  }
};

/**
 * Get user data from storage
 */
export const getUserFromStorage = (): StoredUser | null => {
  try {
    // Check localStorage first (remember me)
    let userData = localStorage.getItem(AUTH_STORAGE_KEY);
    
    // If not in localStorage, check sessionStorage
    if (!userData) {
      userData = sessionStorage.getItem(AUTH_STORAGE_KEY);
    }

    if (userData) {
      return JSON.parse(userData);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user from storage:', error);
    clearUserFromStorage(); // Clear corrupted data
    return null;
  }
};

/**
 * Remove user data from all storage
 */
export const clearUserFromStorage = (): void => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(REMEMBER_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing user from storage:', error);
  }
};

/**
 * Check if user chose to be remembered
 */
export const isRememberMeEnabled = (): boolean => {
  try {
    return localStorage.getItem(REMEMBER_STORAGE_KEY) === 'true';
  } catch (error) {
    return false;
  }
};

/**
 * Get sample accounts for demonstration with different roles
 */
export const getSampleAccounts = () => [
  {
    email: "admin@healthcare.vn",
    password: "admin123",
    name: "Nguyễn Văn Admin",
    phone: "0901234567",
    role: "admin",
    profile: {
      age: 35,
      gender: "Nam",
      address: "456 Đường Quản Trị, Quận 1, TP.HCM",
      department: "Quản lý hệ thống",
      employeeId: "ADM001"
    }
  },
  {
    email: "doctor@healthcare.vn",
    password: "doctor123",
    name: "BS. Trần Thị Bác Sĩ",
    phone: "0902345678",
    role: "doctor",
    profile: {
      age: 42,
      gender: "Nữ",
      address: "789 Đường Y Khoa, Quận 3, TP.HCM",
      specialty: "Sản phụ khoa",
      experience: "15 năm",
      license: "DOC12345"
    }
  },
  {
    email: "consultant@healthcare.vn",
    password: "consultant123",
    name: "Tư vấn viên Lê Văn Tư Vấn",
    phone: "0903456789",
    role: "consultant",
    profile: {
      age: 30,
      gender: "Nam",
      address: "321 Đường Tư Vấn, Quận 7, TP.HCM",
      specialty: "Tư vấn sức khỏe sinh sản",
      certification: "CONS567",
      languages: ["Tiếng Việt", "English"]
    }
  },
  {
    email: "customer@healthcare.vn",
    password: "customer123",
    name: "Khách hàng Phạm Thị Khách",
    phone: "0904567890",
    role: "customer",
    profile: {
      age: 28,
      gender: "Nữ",
      address: "123 Đường Khách Hàng, Quận 10, TP.HCM",
      membershipLevel: "Gold",
      joinDate: "2024-01-15"
    }
  }
];

/**
 * Get sample account for demonstration (backward compatibility)
 */
export const getSampleAccount = () => ({
  email: "customer@healthcare.vn",
  password: "customer123",
  name: "Khách hàng Phạm Thị Khách",
  phone: "0904567890",
  role: "customer",
  profile: {
    age: 28,
    gender: "Nữ",
    address: "123 Đường Khách Hàng, Quận 10, TP.HCM",
    membershipLevel: "Gold",
    joinDate: "2024-01-15"
  }
});

/**
 * Check if user has required role
 */
export const hasRole = (userRole: string, requiredRoles: string[]): boolean => {
  return requiredRoles.includes(userRole);
};

/**
 * Check if user has admin privileges
 */
export const isAdmin = (userRole: string): boolean => {
  return userRole === 'admin';
};

/**
 * Check if user is medical staff (doctor or consultant)
 */
export const isMedicalStaff = (userRole: string): boolean => {
  return ['doctor', 'consultant'].includes(userRole);
};

/**
 * Get role display name in Vietnamese
 */
export const getRoleDisplayName = (role: string): string => {
  const roleNames: Record<string, string> = {
    admin: "Quản trị viên",
    doctor: "Bác sĩ", 
    consultant: "Tư vấn viên",
    customer: "Khách hàng",
    patient: "Bệnh nhân" // for backward compatibility
  };
  return roleNames[role] || role;
};

/**
 * Validate user session (check if session is still valid)
 */
export const isSessionValid = (user: StoredUser): boolean => {
  try {
    const loginTime = new Date(user.loginTime);
    const now = new Date();
    const diffHours = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
    
    // Session expires after 24 hours for remembered users, 8 hours for others
    const maxHours = isRememberMeEnabled() ? 24 : 8;
    
    return diffHours < maxHours;
  } catch (error) {
    return false;
  }
};
