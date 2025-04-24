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
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
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
          router.replace('/(app)');
        } catch {
          Alert.alert('Error', 'Failed to set PIN. Please try again.');
        }
      } else {
        Alert.alert('Error', 'PINs do not match.');
        setPin('');
        setConfirmPin('');
        setStep(1);
        setTimeout(() => pinInputRef.current?.focus(), 100);
      }
    }
  };

  const renderPinDots = (value: string) =>
    [...Array(4)].map((_, i) => (
      <View
        key={i}
        style={[
          styles.dot,
          value.length > i && styles.dotFilled,
        ]}
      />
    ));

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (step === 2) {
            setStep(1);
            setConfirmPin('');
            setTimeout(() => pinInputRef.current?.focus(), 100);
          } else {
            router.replace('/(auth)/signup');
          }
        }}
      >
        <ChevronLeft size={24} color={Colors.primary} />
      </TouchableOpacity>

      <Animated.View entering={FadeInDown} style={styles.content}>
        <Lock size={50} color={Colors.primary} style={styles.icon} />
        <Text style={styles.title}>
          {step === 1 ? 'Create Transaction PIN' : 'Confirm PIN'}
        </Text>
        <Text style={styles.sub}>
          {step === 1
            ? 'Secure your wallet with a 4-digit PIN'
            : 'Re-enter your PIN to confirm'}
        </Text>

        <Animated.View entering={FadeInUp.delay(100)} style={styles.dotsRow}>
          {renderPinDots(step === 1 ? pin : confirmPin)}

          <TextInput
            ref={pinInputRef}
            style={styles.hiddenInput}
            value={pin}
            onChangeText={(text) => {
              const digits = text.replace(/[^0-9]/g, '');
              if (digits.length <= 4) {
                setPin(digits);
                if (digits.length === 4) {
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

          <TextInput
            ref={confirmPinInputRef}
            style={styles.hiddenInput}
            value={confirmPin}
            onChangeText={(text) => {
              const digits = text.replace(/[^0-9]/g, '');
              if (digits.length <= 4) {
                setConfirmPin(digits);
                if (digits.length === 4) {
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
        </Animated.View>

        <TouchableOpacity
          onPress={() =>
            step === 1
              ? pinInputRef.current?.focus()
              : confirmPinInputRef.current?.focus()
          }
          style={styles.keypadBtn}
        >
          <Text style={styles.keypadText}>Tap to Enter PIN</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  backButton: {
    marginTop: 50,
    marginBottom: 20,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 10,
  },
  sub: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 40,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    marginBottom: 40,
    gap: 20,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: '#CBD5E1',
    borderWidth: 1,
    backgroundColor: '#E2E8F0',
  },
  dotFilled: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  keypadBtn: {
    backgroundColor: '#E0F2FE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  keypadText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
});
