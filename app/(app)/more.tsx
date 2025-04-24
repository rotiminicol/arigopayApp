import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import {
  User,
  Settings,
  Shield,
  Gift,
  CircleHelp as HelpCircle,
  ChevronRight,
  Bell,
  Share2,
  FileText,
  MessageSquare,
  LogOut,
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import * as Haptics from 'expo-haptics';

export default function MoreScreen() {
  const { user, signOut } = useAuth();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const titleAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(titleAnim, {
        toValue: 0,
        duration: 600,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSignOut = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    signOut();
  };

  const MENU_SECTIONS = [
    {
      title: 'Account',
      items: [
        { icon: User, title: 'Profile Settings', link: '/profile' },
        { icon: Shield, title: 'Security', link: '/security' },
        { icon: Bell, title: 'Notifications', link: '/notifications' },
      ],
    },
    {
      title: 'Rewards & Referrals',
      items: [
        { icon: Gift, title: 'Rewards', link: '/rewards' },
        { icon: Share2, title: 'Invite Friends', link: '/invite' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: MessageSquare, title: 'Chat with Us', link: '/chat' },
        { icon: HelpCircle, title: 'Help Center', link: '/help' },
        { icon: FileText, title: 'Terms & Privacy', link: '/terms' },
      ],
    },
  ];

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      contentContainerStyle={styles.scrollContent}
    >
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: titleAnim }] },
        ]}
      >
        <Text style={styles.headerTitle}>More</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.profileCard,
          {
            transform: [{ translateY: translateYAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.profileAvatar}>
          <Text style={styles.profileInitial}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name || 'User'}</Text>
          <Text style={styles.profileEmail}>
            {user?.email || 'user@example.com'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.8}
          style={styles.profileButton}
        >
          <Text style={styles.profileButtonText}>View Profile</Text>
        </TouchableOpacity>
      </Animated.View>

      {MENU_SECTIONS.map((section, index) => (
        <Animated.View
          key={index}
          style={[
            styles.section,
            {
              transform: [{ translateY: translateYAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.menuContainer}>
            {section.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <Animated.View key={i} style={{ transform: [{ scale: scaleAnim }] }}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handlePress}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuItemLeft}>
                      <View style={styles.menuItemIcon}>
                        <Icon size={20} color={Colors.primary} />
                      </View>
                      <Text style={styles.menuItemTitle}>{item.title}</Text>
                    </View>
                    <ChevronRight size={20} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>
      ))}

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
        activeOpacity={0.8}
      >
        <LogOut size={20} color={Colors.danger} style={styles.signOutIcon} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.version}>Arigo Pay v1.0.0</Text>
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: 'white',
    letterSpacing: 0.5,
  },
  profileCard: {
    backgroundColor: 'white',
    marginTop: -40,
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  profileInitial: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.primary,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  profileButton: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  profileButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.primary,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  signOutButton: {
    marginTop: 32,
    marginHorizontal: 24,
    backgroundColor: '#FEE2E2',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 2,
  },
  signOutIcon: {
    marginRight: 10,
  },
  signOutText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.danger,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
  version: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
