import { useAuth } from "@/contexts/AuthContext";

/**
 * Utility functions for user-specific data storage
 */

// Get user-specific storage key
export const getUserStorageKey = (baseKey: string, userEmail?: string): string => {
  if (!userEmail) return baseKey;
  return `${baseKey}_${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
};

// Save data for specific user
export const saveUserData = (key: string, data: any, userEmail?: string): void => {
  try {
    const storageKey = getUserStorageKey(key, userEmail);
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

// Load data for specific user
export const loadUserData = <T>(key: string, defaultValue: T, userEmail?: string): T => {
  try {
    const storageKey = getUserStorageKey(key, userEmail);
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Error loading user data:', error);
    return defaultValue;
  }
};

// Remove data for specific user
export const removeUserData = (key: string, userEmail?: string): void => {
  try {
    const storageKey = getUserStorageKey(key, userEmail);
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error('Error removing user data:', error);
  }
};

// Hook for user-specific storage
export const useUserStorage = () => {
  const { user } = useAuth();
  
  const save = (key: string, data: any) => {
    saveUserData(key, data, user?.email);
  };
  
  const load = <T>(key: string, defaultValue: T): T => {
    return loadUserData(key, defaultValue, user?.email);
  };
  
  const remove = (key: string) => {
    removeUserData(key, user?.email);
  };
  
  return { save, load, remove, userEmail: user?.email };
};

// Storage keys constants
export const STORAGE_KEYS = {
  TESTING_BOOKINGS: 'healthcare_testing_bookings',
  CONSULTATION_BOOKINGS: 'healthcare_consultation_bookings', 
  QA_QUESTIONS: 'healthcare_qa_questions',
  CYCLE_DATA: 'healthcare_cycle_data',
  BOOKING_HISTORY: 'healthcare_booking_history'
} as const;

// Cycle tracking specific functions
export const getUserCycleData = (userEmail: string) => {
  return loadUserData('healthcare_cycle_data', [], userEmail);
};

export const saveUserCycleData = (userEmail: string, cycleData: any[]) => {
  saveUserData('healthcare_cycle_data', cycleData, userEmail);
};

export const getUserCycleSettings = (userEmail: string) => {
  return loadUserData('healthcare_cycle_settings', {
    lastPeriodDate: '',
    averageCycleLength: 28
  }, userEmail);
};

export const saveUserCycleSettings = (userEmail: string, settings: { lastPeriodDate: string; averageCycleLength: number }) => {
  saveUserData('healthcare_cycle_settings', settings, userEmail);
};

// Booking specific functions
export const getUserBookings = (userEmail: string) => {
  return loadUserData('healthcare_bookings', [], userEmail);
};

export const saveUserBooking = (userEmail: string, booking: any) => {
  const existingBookings = getUserBookings(userEmail);
  const updatedBookings = [...existingBookings, booking];
  saveUserData('healthcare_bookings', updatedBookings, userEmail);
};
