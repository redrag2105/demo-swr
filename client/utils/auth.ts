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
 * Get sample account for demonstration
 */
export const getSampleAccount = () => ({
  email: "user@healthcare.vn",
  password: "123456",
  name: "Nguyễn Văn A",
  phone: "0123456789",
  role: "patient",
  profile: {
    age: 28,
    gender: "Nam",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    emergencyContact: "0987654321"
  }
});

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
