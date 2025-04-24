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

export default function CreatePinScreen() {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState(1);
  const { createPin } = useAuth();
  
  const pinInputRef = useRef<TextInput>(null);
  const confirmPinInputRef = useRef<TextInput>(null);

  const handlePinComplete = () => {
    if (pin.length === 4) {
      setStep(2);
      setTimeout(() => {
        confirmPinInputRef.current?.focus();
      }, 100);
    }
  };

  const handleConfirmPin = async () => {
    if (confirmPin.length === 4) {
      if (pin === confirmPin) {
        try {
          await createPin(pin);
        } catch (error) {
          Alert.alert('Error', 'Failed to set PIN. Please try again.');
        }
      } else {
        Alert.alert('Error', 'PINs do not match. Please try again.');
        setPin('');
        setConfirmPin('');
        setStep(1);
        setTimeout(() => {
          pinInputRef.current?.focus();
        }, 100);
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
        onPress={() => {
          if (step === 2) {
            setStep(1);
            setConfirmPin('');
            setTimeout(() => {
              pinInputRef.current?.focus();
            }, 100);
          } else {
            router.replace('/(auth)/signup');
          }
        }}
      >
        <ChevronLeft size={24} color={Colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Lock size={48} color={Colors.primary} style={styles.icon} />
        
        <Text style={styles.title}>
          {step === 1 ? 'Create Transaction PIN' : 'Confirm Transaction PIN'}
        </Text>
        
        <Text style={styles.description}>
          {step === 1 
            ? 'Create a 4-digit PIN to secure your transactions' 
            : 'Please re-enter your PIN to confirm'
          }
        </Text>

        <View style={styles.pinContainer}>
          {step === 1 
            ? renderPinDigits(pin)
            : renderPinDigits(confirmPin)
          }
          
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
            autoFocus={step === 1}
          />
          
          {/* Hidden input for Confirm PIN */}
          <TextInput
            ref={confirmPinInputRef}
            style={styles.hiddenInput}
            value={confirmPin}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, '');
              if (numericText.length <= 4) {
                setConfirmPin(numericText);
                if (numericText.length === 4) {
                  handleConfirmPin();
                  Keyboard.dismiss();
                }
              }
            }}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
            autoFocus={step === 2}
          />
        </View>

        <TouchableOpacity 
          style={styles.keyboardButton}
          onPress={() => {
            if (step === 1) {
              pinInputRef.current?.focus();
            } else {
              confirmPinInputRef.current?.focus();
            }
          }}
        >
          <Text style={styles.keyboardButtonText}>Open Keypad</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This PIN will be used to authorize all transactions
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
  keyboardButton: {
    backgroundColor: Colors.primaryLight,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  keyboardButtonText: {
    fontFamily: 'Poppins-Medium',
    color: Colors.primary,
    fontSize: 16,
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
});