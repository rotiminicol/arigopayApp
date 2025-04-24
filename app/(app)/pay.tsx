import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Phone, Zap, Gamepad2, Tv, ShoppingBag, Gift, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import Colors from '@/constants/Colors';

const PAYMENT_OPTIONS = [
  {
    id: '1',
    title: 'Airtime',
    description: 'Buy airtime for any network',
    icon: Phone,
    color: '#E91E63',
  },
  {
    id: '2',
    title: 'Electricity',
    description: 'Pay electricity bills',
    icon: Zap,
    color: '#FF9800',
  },
  {
    id: '3',
    title: 'Gaming',
    description: 'Buy gaming credits and tokens',
    icon: Gamepad2,
    color: '#9C27B0',
  },
  {
    id: '4',
    title: 'TV & Internet',
    description: 'Pay for TV subscriptions',
    icon: Tv,
    color: '#2196F3',
  },
  {
    id: '5',
    title: 'Shopping',
    description: 'Pay at online stores',
    icon: ShoppingBag,
    color: '#4CAF50',
  },
  {
    id: '6',
    title: 'Gift Cards',
    description: 'Buy gift cards',
    icon: Gift,
    color: '#FF5722',
  },
];

export default function PayScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pay Bills</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.grid}>
          {PAYMENT_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <TouchableOpacity key={option.id} style={styles.gridItem}>
                <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
                  <Icon size={24} color="white" />
                </View>
                <Text style={styles.gridItemTitle}>{option.title}</Text>
                <Text style={styles.gridItemDescription}>{option.description}</Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity style={styles.gridItem}>
            <View style={[styles.iconContainer, { backgroundColor: Colors.textSecondary }]}>
              <MoreHorizontal size={24} color="white" />
            </View>
            <Text style={styles.gridItemTitle}>More</Text>
            <Text style={styles.gridItemDescription}>See all payment options</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.promoSection}>
          <Text style={styles.promoTitle}>Special Offers</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.promoCard}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/7621138/pexels-photo-7621138.jpeg' }}
                style={styles.promoImage}
              />
              <View style={styles.promoContent}>
                <Text style={styles.promoCardTitle}>10% Cashback</Text>
                <Text style={styles.promoCardDescription}>On all electricity bills</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.promoCard}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/7621140/pexels-photo-7621140.jpeg' }}
                style={styles.promoImage}
              />
              <View style={styles.promoContent}>
                <Text style={styles.promoCardTitle}>Free Data</Text>
                <Text style={styles.promoCardDescription}>Buy airtime, get free data</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  gridItem: {
    width: '48%',
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
    marginBottom: 12,
  },
  gridItemTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  gridItemDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  promoSection: {
    marginTop: 20,
  },
  promoTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  promoCard: {
    width: 280,
    height: 160,
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  promoImage: {
    width: '100%',
    height: 100,
  },
  promoContent: {
    padding: 12,
  },
  promoCardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  promoCardDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
});