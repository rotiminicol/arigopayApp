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
import { ChevronLeft, ShieldCheck } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

export default function ConfirmPinScreen() {
  const [confirmPin, setConfirmPin] = useState('');
  const inputRef = useRef<TextInput>(null);
  const { confirmPin: submitConfirmPin } = useAuth();

  const handlePinSubmit = async () => {
    if (confirmPin.length === 4) {
      try {
        await submitConfirmPin(confirmPin);
        router.replace('/(app)');
      } catch {
        Alert.alert('Error', 'Failed to confirm PIN. Try again.');
        setConfirmPin('');
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  };

  const renderDots = () =>
    [...Array(4)].map((_, i) => (
      <View
        key={i}
        style={[
          styles.dot,
          confirmPin.length > i && styles.dotFilled,
        ]}
      />
    ));

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ChevronLeft size={24} color={Colors.primary} />
      </TouchableOpacity>

      <Animated.View entering={FadeInDown} style={styles.content}>
      <ShieldCheck size={50} color={Colors.primary} style={styles.icon} />
        <Text style={styles.title}>Confirm PIN</Text>
        <Text style={styles.sub}>Re-enter your 4-digit PIN to continue</Text>

        <Animated.View entering={FadeInUp.delay(100)} style={styles.dotsRow}>
          {renderDots()}

          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            value={confirmPin}
            onChangeText={(text) => {
              const digits = text.replace(/[^0-9]/g, '');
              if (digits.length <= 4) {
                setConfirmPin(digits);
                if (digits.length === 4) {
                  handlePinSubmit();
                  Keyboard.dismiss();
                }
              }
            }}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
            autoFocus
          />
        </Animated.View>

        <TouchableOpacity
          onPress={() => inputRef.current?.focus()}
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
