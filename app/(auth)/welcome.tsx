import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Animated.View style={styles.header} entering={FadeInDown.duration(1000)}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1588776814546-ec7d5c9e2f3a' }}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />
        <View style={styles.headerContent}>
          <Text style={styles.title}>Welcome to Arigo Pay</Text>
          <Text style={styles.subtitle}>
            Banking redefined – secure, smart, and seamless
          </Text>
        </View>
      </Animated.View>

      <Animated.View style={styles.content} entering={FadeInUp.delay(300).duration(1000)}>
        <View style={styles.features}>
          <Feature emoji="💼" title="Smart Banking" text="Secure, modern banking at your fingertips" />
          <Feature emoji="📱" title="Instant Access" text="Sign up and access your account in seconds" />
          <Feature emoji="🧠" title="Smart Tools" text="Track your money and grow smarter" />
        </View>

        <View style={styles.buttons}>
          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/(auth)/login" asChild>
            <TouchableOpacity style={styles.buttonOutline}>
              <Text style={styles.buttonOutlineText}>I have an account</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </Animated.View>
    </View>
  );
}

function Feature({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <Text style={styles.featureEmoji}>{emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 300,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 72, 255, 0.3)',
  },
  headerContent: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  features: {
    marginBottom: 40,
  },
  featureItem: {
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#E3F2FD',
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#003087',
    marginBottom: 4,
  },
  featureText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#5C6BC0',
  },
  buttons: {
    marginTop: 'auto',
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#004BFF',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    fontSize: 16,
  },
  buttonOutline: {
    borderWidth: 1.5,
    borderColor: '#004BFF',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonOutlineText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#004BFF',
    fontSize: 16,
  },
});
