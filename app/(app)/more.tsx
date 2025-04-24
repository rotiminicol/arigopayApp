import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { User, Settings, Shield, Gift, CircleHelp as HelpCircle, ChevronRight, Bell, Share2, FileText, MessageSquare } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

export default function MoreScreen() {
  const { user, signOut } = useAuth();

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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileInitial}>{user?.name?.charAt(0) || 'U'}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name || 'User'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileButtonText}>View Profile</Text>
        </TouchableOpacity>
      </View>

      {MENU_SECTIONS.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.menuContainer}>
            {section.items.map((item, itemIndex) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity key={itemIndex} style={styles.menuItem}>
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuItemIcon}>
                      <Icon size={20} color={Colors.primary} />
                    </View>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                  </View>
                  <ChevronRight size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.textPrimary,
  },
  profileCard: {
    backgroundColor: 'white',
    marginTop: 20,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.primary,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  profileEmail: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  profileButton: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  profileButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.primary,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: Colors.textPrimary,
  },
  signOutButton: {
    marginTop: 32,
    marginHorizontal: 20,
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  signOutText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.danger,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  version: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
});