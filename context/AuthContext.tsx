import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

// Define the shape of our authentication context
interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  createPin: (pin: string) => Promise<void>;
  confirmPin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  isBiometricSupported: boolean;
  biometricAuth: () => Promise<boolean>;
  setBiometricEnabled: (enabled: boolean) => Promise<void>;
  isBiometricEnabled: boolean;
}

// Create the authentication context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  createPin: async () => {},
  confirmPin: async () => {},
  verifyPin: async () => false,
  isBiometricSupported: false,
  biometricAuth: async () => false,
  setBiometricEnabled: async () => {},
  isBiometricEnabled: false,
});

// Platform-specific storage implementation
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

// Authentication Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  // Check if the user is authenticated and if biometric authentication is supported
  useEffect(() => {
    // Check if biometric authentication is supported
    (async () => {
      if (Platform.OS !== 'web') {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        setIsBiometricSupported(compatible);

        // Check if biometric is enabled for this app
        const biometricEnabled = await storage.getItem('biometricEnabled');
        setIsBiometricEnabled(biometricEnabled === 'true');
      }
    })();

    // Check if the user is logged in
    const checkUserAuth = async () => {
      try {
        const userJson = await storage.getItem('user');
        if (userJson) {
          const userData = JSON.parse(userJson);
          setUser(userData);
          router.replace('/(app)');
        } else {
          router.replace('/(auth)/login');
        }
      } catch (e) {
        console.error('Error checking user auth:', e);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAuth();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, we would make an API call to authenticate the user
      // Here we're just simulating a successful authentication
      const userData = {
        id: '1',
        email,
        name: 'John Doe',
        phone: '+234 800 123 4567',
        accountNumber: '0123456789',
        balance: 25000.50,
      };

      // Store user data securely
      await storage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Check if the user has set a PIN
      const hasPin = await storage.getItem('transactionPin');
      
      if (hasPin) {
        router.replace('/(app)');
      } else {
        router.replace('/(auth)/create-pin');
      }
    } catch (e) {
      console.error('Error signing in:', e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, phone: string) => {
    setIsLoading(true);
    try {
      // In a real app, we would make an API call to register the user
      // Here we're just simulating a successful registration
      const userData = {
        id: '1',
        email,
        name: email.split('@')[0],
        phone,
        accountNumber: '0123456789',
        balance: 1000.00,
      };

      // Store user data securely
      await storage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Navigate to create PIN screen
      router.replace('/(auth)/create-pin');
    } catch (e) {
      console.error('Error signing up:', e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    setIsLoading(true);
    try {
      // Remove user data
      await storage.removeItem('user');
      setUser(null);
      router.replace('/(auth)/login');
    } catch (e) {
      console.error('Error signing out:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Create transaction PIN
  const createPin = async (pin: string) => {
    try {
      await storage.setItem('transactionPin', pin);
      router.replace('/(app)');
    } catch (e) {
      console.error('Error creating PIN:', e);
      throw e;
    }
  };

    // Confirm transaction PIN
    const confirmPin = async (pin: string) => {
      try {
        await storage.setItem('transactionPin', pin);
        router.replace('/(app)');
      } catch (e) {
        console.error('Error creating PIN:', e);
        throw e;
      }
    };
  

  // Verify transaction PIN
  const verifyPin = async (pin: string) => {
    try {
      const storedPin = await storage.getItem('transactionPin');
      return storedPin === pin;
    } catch (e) {
      console.error('Error verifying PIN:', e);
      return false;
    }
  };

  // Authenticate with biometrics
  const biometricAuth = async () => {
    if (Platform.OS === 'web' || !isBiometricSupported) {
      return false;
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your account',
        fallbackLabel: 'Use PIN instead',
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  };

  // Enable or disable biometric authentication
  const setBiometricEnabled = async (enabled: boolean) => {
    try {
      await storage.setItem('biometricEnabled', enabled ? 'true' : 'false');
      setIsBiometricEnabled(enabled);
    } catch (e) {
      console.error('Error setting biometric enabled:', e);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signIn,
      signUp,
      signOut,
      createPin,
      confirmPin,
      verifyPin,
      isBiometricSupported,
      biometricAuth,
      setBiometricEnabled,
      isBiometricEnabled,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}