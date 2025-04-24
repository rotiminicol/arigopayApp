import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';

export default function SplashScreen() {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.95);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to auth after splash animation
    const timer = setTimeout(() => {
      router.replace('/(auth)/welcome');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.logo}>Arigo Pay</Text>
        <Text style={styles.tagline}>Seamless Digital Payments</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary, // Uses the sky blue from your theme
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    fontFamily: 'Poppins-Bold',
    fontSize: 48,
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.95)',
    letterSpacing: 0.5,
  },
});