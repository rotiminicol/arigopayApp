import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { Animated } from 'react-native';

export default function AuthLayout() {
  // Animation setup
  const fadeAnim = new Animated.Value(0); // Initial opacity of 0

  useEffect(() => {
    // Fade in effect
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="create-pin" />
        <Stack.Screen name="confirm-pin" />
      </Stack>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Light background for a clean look
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});