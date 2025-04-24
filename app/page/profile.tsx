import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  Easing
} from 'react-native';
import { 
  User, Settings, CreditCard, Bell, Shield, 
  HelpCircle, LogOut, ChevronRight, Fingerprint 
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

export default function ProfileScreen() {
  const { user, signOut, isBiometricSupported, isBiometricEnabled, setBiometricEnabled } = useAuth();
  const [loading, setLoading] = useState(false);
  const [biometricToggle, setBiometricToggle] = useState(isBiometricEnabled);
  
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideUpAnim = new Animated.Value(30);
  const scaleAnim = new Animated.Value(0.95);

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleBiometricToggle = async (value: boolean) => {
    try {
      setBiometricToggle(value);
      await setBiometricEnabled(value);
    } catch (error) {
      Alert.alert('Error', 'Failed to update biometric settings');
      setBiometricToggle(!value);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of Arigo Pay?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const Section = ({
    title,
    children,
    delay = 0,
  }: {
    title: string;
    children: React.ReactNode;
    delay?: number;
  }) => (
    <Animated.View 
      style={[
        styles.section,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideUpAnim },
            { scale: scaleAnim }
          ],
        }
      ]}
    >
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </Animated.View>
  );

  const MenuItem = ({
    icon,
    title,
    subtitle,
    showToggle,
    toggleValue,
    onToggleChange,
    showChevron = true,
    onPress,
    delay = 0,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    showToggle?: boolean;
    toggleValue?: boolean;
    onToggleChange?: (value: boolean) => void;
    showChevron?: boolean;
    onPress?: () => void;
    delay?: number;
  }) => {
    const itemSlideAnim = new Animated.Value(20);
    
    useEffect(() => {
      Animated.timing(itemSlideAnim, {
        toValue: 0,
        duration: 500,
        delay: delay * 100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View style={{ transform: [{ translateX: itemSlideAnim }] }}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={onPress}
          disabled={!onPress && !showToggle}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemIcon}>
            {React.cloneElement(icon as React.ReactElement, { color: Colors.primary })}
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>{title}</Text>
            {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
          </View>
          {showToggle && onToggleChange ? (
            <Switch
              value={toggleValue}
              onValueChange={onToggleChange}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={toggleValue ? Colors.primary : '#f4f3f4'}
              ios_backgroundColor={Colors.border}
            />
          ) : showChevron ? (
            <ChevronRight size={20} color={Colors.textSecondary} />
          ) : null}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Securing your account...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideUpAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <View style={styles.profileInfo}>
          <Animated.View 
            style={[
              styles.avatarContainer,
              {
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </Text>
          </Animated.View>
          <View>
            <Text style={styles.userName}>{user?.name || 'Arigo User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@arigopay.com'}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.editButton}
          activeOpacity={0.6}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </Animated.View>

      <Section title="Account" delay={0.1}>
        <MenuItem
          icon={<User size={22} />}
          title="Personal Information"
          onPress={() => {}}
          delay={1}
        />
        <MenuItem
          icon={<CreditCard size={22} />}
          title="Payment Methods"
          subtitle="Card ****6789"
          onPress={() => {}}
          delay={2}
        />
        <MenuItem
          icon={<Bell size={22} />}
          title="Notifications"
          subtitle="Customize alerts"
          onPress={() => {}}
          delay={3}
        />
      </Section>

      <Section title="Security" delay={0.2}>
        <MenuItem
          icon={<Shield size={22} />}
          title="Change Password"
          onPress={() => {}}
          delay={4}
        />
        <MenuItem
          icon={<Shield size={22} />}
          title="Transaction PIN"
          onPress={() => {}}
          delay={5}
        />
        {isBiometricSupported && (
          <MenuItem
            icon={<Fingerprint size={22} />}
            title="Biometric Login"
            showToggle
            toggleValue={biometricToggle}
            onToggleChange={handleBiometricToggle}
            delay={6}
          />
        )}
      </Section>

      <Section title="Preferences" delay={0.3}>
        <MenuItem
          icon={<Settings size={22} />}
          title="App Theme"
          subtitle="System Default"
          onPress={() => {}}
          delay={7}
        />
        <MenuItem
          icon={<Settings size={22} />}
          title="Currency"
          subtitle="USD"
          onPress={() => {}}
          delay={8}
        />
      </Section>

      <Section title="Support" delay={0.4}>
        <MenuItem
          icon={<HelpCircle size={22} />}
          title="Help Center"
          onPress={() => {}}
          delay={9}
        />
        <MenuItem
          icon={<HelpCircle size={22} />}
          title="Contact Support"
          onPress={() => {}}
          delay={10}
        />
        <MenuItem
          icon={<HelpCircle size={22} />}
          title="Privacy Policy"
          onPress={() => {}}
          delay={11}
        />
      </Section>

      <Animated.View
        style={[
          styles.signOutContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideUpAnim }
            ]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.signOutButton} 
          onPress={handleSignOut}
          activeOpacity={0.7}
        >
          <LogOut size={20} color={Colors.danger} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[
          styles.versionContainer,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        <Text style={styles.versionText}>Arigo Pay v2.0.0</Text>
      </Animated.View>
    </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontFamily: 'Poppins-Medium',
    marginTop: 16,
    color: Colors.primary,
    fontSize: 16,
  },
  header: {
    backgroundColor: Colors.primaryLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: Colors.primary,
  },
  userName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.primary,
  },
  editButtonText: {
    fontFamily: 'Poppins-Medium',
    color: 'white',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  menuItemSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  signOutContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  signOutText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.danger,
    marginLeft: 12,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  versionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: Colors.textSecondary,
  },
});