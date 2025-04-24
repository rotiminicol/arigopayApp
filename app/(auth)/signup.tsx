import React, { useState } from 'react';
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
} from 'react-native';
import { Link, router } from 'expo-router';
import { Eye, EyeOff, User, Lock, Phone, ChevronLeft } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signUp } = useAuth();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !phone) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Basic phone validation (at least 10 digits)
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.logo}>Kuda Bank</Text>
          <Text style={styles.subtitle}>Banking for the free</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Create Account</Text>
          
          <View style={styles.inputContainer}>
            <User size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Phone size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={20} color={Colors.textSecondary} />
              ) : (
                <Eye size={20} color={Colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color={Colors.textSecondary} />
              ) : (
                <Eye size={20} color={Colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.termsText}>
            By signing up, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>SIGN UP</Text>
            )}
          </TouchableOpacity>

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
    backgroundColor: 'white',
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
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 56,
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
    marginBottom: 20,
  },
  termsLink: {
    fontFamily: 'Poppins-Medium',
    color: Colors.primary,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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