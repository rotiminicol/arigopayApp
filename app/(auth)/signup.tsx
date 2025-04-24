import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Eye, EyeOff, User, Lock, Phone, ChevronLeft } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

const Colors = {
  primary: '#1E90FF',
  primaryLight: '#A6D8FF',
  background: '#FFFFFF',
  textPrimary: '#1A1A1A',
  textSecondary: '#7F8C8D',
  border: '#E0E0E0',
};

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();

  // Animation states
  const buttonScale = useRef(new Animated.Value(1)).current;
  const [focusedInput, setFocusedInput] = useState('');

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !phone) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const phoneRegex = /^\+?[0-9]{10,}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, phone);
    } catch (error) {
      Alert.alert('Signup Failed', 'An error occurred during signup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }),
      Animated.spring(buttonScale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.logo}>Arigo Pay</Text>
          <Text style={styles.subtitle}>Seamless Payments, Simplified</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Create Your Account</Text>

          {/* Email Input */}
          <View style={[
            styles.inputContainer, 
            focusedInput === 'email' && styles.inputFocused
          ]}>
            <User size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput('')}
            />
          </View>

          {/* Phone Input */}
          <View style={[
            styles.inputContainer, 
            focusedInput === 'phone' && styles.inputFocused
          ]}>
            <Phone size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              onFocus={() => setFocusedInput('phone')}
              onBlur={() => setFocusedInput('')}
            />
          </View>

          {/* Password Input */}
          <View style={[
            styles.inputContainer, 
            focusedInput === 'password' && styles.inputFocused
          ]}>
            <Lock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput('')}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} color={Colors.textSecondary} /> : <Eye size={20} color={Colors.textSecondary} />}
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={[
            styles.inputContainer, 
            focusedInput === 'confirmPassword' && styles.inputFocused
          ]}>
            <Lock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              onFocus={() => setFocusedInput('confirmPassword')}
              onBlur={() => setFocusedInput('')}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff size={20} color={Colors.textSecondary} /> : <Eye size={20} color={Colors.textSecondary} />}
            </TouchableOpacity>
          </View>

          {/* Terms & Conditions */}
          <Text style={styles.termsText}>
            By signing up, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>

          {/* Signup Button with Animation */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={() => {
                animateButtonPress();
                handleSignup();
              }}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>SIGN UP</Text>}
            </TouchableOpacity>
          </Animated.View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: Colors.primary,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 56,
    marginBottom: 16,
    backgroundColor: '#F8F9FA',
  },
  inputFocused: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  eyeIcon: {
    padding: 10,
  },
  termsText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  termsLink: {
    fontFamily: 'Poppins-Medium',
    color: Colors.primary,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.primaryLight,
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontFamily: 'Poppins-Regular',
    color: Colors.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    fontFamily: 'Poppins-SemiBold',
    color: Colors.primary,
    marginLeft: 5,
    fontSize: 14,
  },
});
