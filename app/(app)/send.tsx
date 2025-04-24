import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ban as Bank, Users, ArrowUpRight, Repeat, Globe } from 'lucide-react-native';
import Colors from '@/constants/Colors';

const TRANSFER_OPTIONS = [
  {
    id: '1',
    title: 'Bank Transfer',
    description: 'Send money to any bank account',
    icon: Bank,
    color: Colors.primary,
  },
  {
    id: '2',
    title: 'Send to Kuda',
    description: 'Send money to Kuda users instantly',
    icon: Users,
    color: '#4CAF50',
  },
  {
    id: '3',
    title: 'Send to Beneficiary',
    description: 'Quick transfer to saved accounts',
    icon: ArrowUpRight,
    color: '#FF9800',
  },
  {
    id: '4',
    title: 'Scheduled Transfer',
    description: 'Set up recurring transfers',
    icon: Repeat,
    color: '#2196F3',
  },
  {
    id: '5',
    title: 'International Transfer',
    description: 'Send money abroad',
    icon: Globe,
    color: '#9C27B0',
  },
];

export default function SendScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Send Money</Text>
      </View>

      <View style={styles.content}>
        {TRANSFER_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <TouchableOpacity key={option.id} style={styles.optionCard}>
              <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
                <Icon size={24} color="white" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.textPrimary,
  },
  content: {
    padding: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  optionDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
});