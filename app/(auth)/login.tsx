import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { Fingerprint, Eye, EyeOff, User, Lock } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import tw from 'twrnc';
import * as Animatable from 'react-native-animatable';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const Colors = {
  primary: '#1E3A8A', // Deep navy blue
  accent: '#3B82F6', // Bright blue
  background: '#FFFFFF',
  secondary: '#F5F7FA',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  border: '#D1D5DB',
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, biometricAuth, isBiometricSupported, isBiometricEnabled } = useAuth();

  // Animation for button press
  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    if (!isBiometricSupported || !isBiometricEnabled) return;

    const authenticated = await biometricAuth();
    if (authenticated) {
      setEmail('demo@example.com');
      setPassword('password');
      await signIn('demo@example.com', 'password');
    }
  };

  useEffect(() => {
    if (isBiometricEnabled) {
      handleBiometricAuth();
    }
  }, [isBiometricEnabled]);

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-[${Colors.background}]`}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={tw`flex-grow justify-center p-6`}>
        {/* Header with Logo and Tagline */}
        <Animatable.View
          animation="fadeInDown"
          duration={1000}
          style={tw`items-center mb-10`}
        >
          <Text style={tw`text-4xl font-bold text-[${Colors.primary}]`}>
            Arigo Pay
          </Text>
          <Text style={tw`text-base text-[${Colors.textSecondary}] mt-2`}>
            Secure Banking, Simplified
          </Text>
        </Animatable.View>

        {/* Form */}
        <Animatable.View animation="fadeInUp" duration={1200} style={tw`w-full`}>
          <Text style={tw`text-2xl font-semibold text-[${Colors.textPrimary}] mb-6`}>
            Welcome Back
          </Text>

          {/* Email Input */}
          <Animatable.View
            animation="slideInLeft"
            duration={1400}
            style={tw`flex-row items-center mb-4 border border-[${Colors.border}] rounded-xl bg-[${Colors.secondary}] p-4`}
          >
            <User size={20} color={Colors.textSecondary} style={tw`mr-3`} />
            <TextInput
              style={tw`flex-1 text-base text-[${Colors.textPrimary}] font-medium`}
              placeholder="Email or Phone"
              placeholderTextColor={Colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Animatable.View>

          {/* Password Input */}
          <Animatable.View
            animation="slideInLeft"
            duration={1600}
            style={tw`flex-row items-center mb-4 border border-[${Colors.border}] rounded-xl bg-[${Colors.secondary}] p-4`}
          >
            <Lock size={20} color={Colors.textSecondary} style={tw`mr-3`} />
            <TextInput
              style={tw`flex-1 text-base text-[${Colors.textPrimary}] font-medium`}
              placeholder="Password"
              placeholderTextColor={Colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={tw`p-2`}
            >
              {showPassword ? (
                <EyeOff size={20} color={Colors.textSecondary} />
              ) : (
                <Eye size={20} color={Colors.textSecondary} />
              )}
            </TouchableOpacity>
          </Animatable.View>

          {/* Forgot Password */}
          <Animatable.View animation="fadeIn" duration={1800}>
            <TouchableOpacity style={tw`self-end mb-6`}>
              <Text style={tw`text-sm font-medium text-[${Colors.accent}]`}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </Animatable.View>

          {/* Login Button */}
          <Animatable.View animation="bounceIn" duration={2000}>
            <Animated.View style={[animatedButtonStyle]}>
              <TouchableOpacity
                style={tw`bg-[${Colors.primary}] rounded-xl h-14 justify-center items-center mb-4 shadow-lg`}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={tw`text-white text-lg font-semibold`}>
                    LOGIN
                  </Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          </Animatable.View>

          {/* Biometric Button */}
          {isBiometricSupported && isBiometricEnabled && (
            <Animatable.View
              animation="pulse"
              iterationCount="infinite"
              duration={2000}
              style={tw`flex-row justify-center items-center mt-4 p-3 border border-[${Colors.border}] rounded-xl bg-[${Colors.secondary}]`}
            >
              <TouchableOpacity
                onPress={handleBiometricAuth}
                style={tw`flex-row items-center`}
              >
                <Fingerprint size={24} color={Colors.accent} />
                <Text style={tw`text-[${Colors.accent}] font-medium ml-2 text-sm`}>
                  Login with Biometrics
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          )}

          {/* Footer */}
          <Animatable.View
            animation="fadeIn"
            duration={2200}
            style={tw`flex-row justify-center mt-8`}
          >
            <Text style={tw`text-sm text-[${Colors.textSecondary}]`}>
              Don't have an account?{' '}
            </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text style={tw`text-sm font-semibold text-[${Colors.accent}]`}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Link>
          </Animatable.View>
        </Animatable.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}