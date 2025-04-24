import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Lock } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

export default function ConfirmPinScreen() {
  const [pin, setPin] = useState('');
  const { verifyPin } = useAuth();
  
  const pinInputRef = useRef<TextInput>(null);

  const handlePinComplete = async () => {
    if (pin.length === 4) {
      try {
        const isValid = await verifyPin(pin);
        if (isValid) {
          router.replace('/(app)'); // Or your success route
        } else {
          Alert.alert('Error', 'Invalid PIN. Please try again.');
          setPin('');
          pinInputRef.current?.focus();
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to verify PIN. Please try again.');
        setPin('');
        pinInputRef.current?.focus();
      }
    }
  };

  const renderPinDigits = (value: string) => {
    const digits = [];
    for (let i = 0; i < 4; i++) {
      digits.push(
        <View
          key={i}
          style={[
            styles.pinDigit,
            value.length > i && styles.pinDigitFilled
          ]}
        />
      );
    }
    return digits;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ChevronLeft size={24} color={Colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Lock size={48} color={Colors.primary} style={styles.icon} />
        
        <Text style={styles.title}>
          Enter Your Transaction PIN
        </Text>
        
        <Text style={styles.description}>
          Enter your 4-digit PIN to authorize this action
        </Text>

        <View style={styles.pinContainer}>
          {renderPinDigits(pin)}
          
          {/* Hidden input for PIN */}
          <TextInput
            ref={pinInputRef}
            style={styles.hiddenInput}
            value={pin}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, '');
              if (numericText.length <= 4) {
                setPin(numericText);
                if (numericText.length === 4) {
                  handlePinComplete();
                  Keyboard.dismiss();
                }
              }
            }}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
            autoFocus={true}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Forgot your PIN? <Text style={styles.footerLink}>Reset it</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  backButton: {
    marginTop: 40,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 40,
    textAlign: 'center',
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  pinDigit: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 10,
  },
  pinDigitFilled: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  footerLink: {
    color: Colors.primary,
    fontFamily: 'Poppins-SemiBold',
  },
});