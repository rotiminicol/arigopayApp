import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/6634678/pexels-photo-6634678.jpeg' }}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />
        <View style={styles.headerContent}>
          <Text style={styles.title}>Welcome to Kuda</Text>
          <Text style={styles.subtitle}>
            Experience banking made simple, fast, and secure
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: Colors.primaryLight }]}>
              <Text style={styles.featureEmoji}>💸</Text>
            </View>
            <Text style={styles.featureTitle}>Free Transfers</Text>
            <Text style={styles.featureText}>Send money to anyone, anywhere, anytime</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: '#E8F5E9' }]}>
              <Text style={styles.featureEmoji}>💳</Text>
            </View>
            <Text style={styles.featureTitle}>Virtual Cards</Text>
            <Text style={styles.featureText}>Shop online with secure virtual cards</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: '#FFF3E0' }]}>
              <Text style={styles.featureEmoji}>📊</Text>
            </View>
            <Text style={styles.featureTitle}>Budget Tools</Text>
            <Text style={styles.featureText}>Track and manage your spending easily</Text>
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  featureText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  buttons: {
    marginTop: 'auto',
    paddingBottom: 40,
  },
  button: {
    backgroundColor: Colors.primary,
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
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonOutlineText: {
    fontFamily: 'Poppins-SemiBold',
    color: Colors.primary,
    fontSize: 16,
  },
});