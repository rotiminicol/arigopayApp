import React, { useState, useEffect } from 'react';
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
import { Link } from 'expo-router';
import { Fingerprint, Eye, EyeOff, User, Lock } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, biometricAuth, isBiometricSupported, isBiometricEnabled } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
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
      // In a real app, we would need to retrieve the stored credentials
      // and then call signIn with those credentials
      setEmail('demo@example.com');
      setPassword('password');
      await signIn('demo@example.com', 'password');
    }
  };

  useEffect(() => {
    // Try biometric auth on component mount if enabled
    if (isBiometricEnabled) {
      handleBiometricAuth();
    }
  }, [isBiometricEnabled]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>Kuda Bank</Text>
          <Text style={styles.subtitle}>Banking for the free</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Login</Text>
          
          <View style={styles.inputContainer}>
            <User size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email or Phone"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
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

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>LOGIN</Text>
            )}
          </TouchableOpacity>

          {isBiometricSupported && isBiometricEnabled && (
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={handleBiometricAuth}
            >
              <Fingerprint size={24} color={Colors.primary} />
              <Text style={styles.biometricText}>Login with Biometrics</Text>
            </TouchableOpacity>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Sign Up</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 40,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontFamily: 'Poppins-Medium',
    color: Colors.primary,
    fontSize: 14,
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
  biometricButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
  },
  biometricText: {
    fontFamily: 'Poppins-Medium',
    color: Colors.primary,
    marginLeft: 10,
    fontSize: 14,
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
  signupLink: {
    fontFamily: 'Poppins-SemiBold',
    color: Colors.primary,
    marginLeft: 5,
    fontSize: 14,
  },
});