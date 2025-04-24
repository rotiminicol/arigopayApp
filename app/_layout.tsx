import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { SplashScreen } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Add slight delay for smoother transition
      const timer = setTimeout(() => {
        SplashScreen.hideAsync();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <StatusBar style="light" /> {/* Changed to light for Arigo's blue theme */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFFFFF' }, // White background for all screens
        }}
      >
        <Stack.Screen 
          name="splash" 
          options={{ 
            headerShown: false,
            animation: 'fade', // Smoother splash transition
          }} 
        />
        <Stack.Screen 
          name="(auth)" 
          options={{ 
            headerShown: false,
            animation: 'slide_from_right' 
          }} 
        />
        <Stack.Screen 
          name="(app)" 
          options={{ 
            headerShown: false,
            animation: 'fade_from_bottom' 
          }} 
        />
        <Stack.Screen 
          name="+not-found" 
          options={{ 
            title: 'Oops!', 
            headerShown: true,
            headerStyle: { backgroundColor: '#00B4FF' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontFamily: 'Poppins-SemiBold' }
          }} 
        />
      </Stack>
    </AuthProvider>
  );
}