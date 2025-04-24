import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
  Switch,
  SafeAreaView,
} from 'react-native';
import { Eye, EyeOff, Plus, CreditCard, ChevronRight } from 'lucide-react-native';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';

// Arigo Pay color scheme
const Colors = {
  primary: '#4A3AFF', // Arigo Pay purple
  secondary: '#FF6B6B', // Coral accent
  success: '#00C4B4', // Teal
  danger: '#FF3B30', // Red
  warning: '#FF9500', // Orange
  info: '#5856D6', // Blue
  background: '#F7F7FC', // Light gray background
  textPrimary: '#1C2526', // Dark text
  textSecondary: '#6B7280', // Gray text
  cardBackground: '#FFFFFF',
  border: '#E5E7EB',
  primaryLight: '#E5E7FF',
};

// Sample cards data
const CARDS = [
  {
    id: '1',
    type: 'Virtual',
    cardNumber: '5399 8324 **** 4818',
    expiryDate: '05/25',
    cardName: 'John Doe',
    balance: 250000,
    currency: 'NGN',
    color: Colors.primary,
  },
  {
    id: '2',
    type: 'Physical',
    cardNumber: '4245 7611 **** 9021',
    expiryDate: '12/26',
    cardName: 'John Doe',
    balance: 150000,
    currency: 'NGN',
    color: Colors.info,
  },
];

// Card settings
const CARD_SETTINGS = [
  {
    id: '1',
    title: 'Online Payments',
    description: 'Allow online transactions',
    toggleEnabled: true,
  },
  {
    id: '2',
    title: 'ATM Withdrawals',
    description: 'Allow ATM withdrawals',
    toggleEnabled: true,
  },
  {
    id: '3',
    title: 'International Transactions',
    description: 'Allow transactions outside Nigeria',
    toggleEnabled: false,
  },
  {
    id: '4',
    title: 'Contactless Payments',
    description: 'Allow tap to pay',
    toggleEnabled: true,
  },
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

export default function ArigoPayCardsScreen() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [settings, setSettings] = useState(CARD_SETTINGS);
  const activeCard = CARDS[activeCardIndex];

  const toggleSetting = (id: string) => {
    setSettings(
      settings.map((setting) =>
        setting.id === id
          ? { ...setting, toggleEnabled: !setting.toggleEnabled }
          : setting
      )
    );
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const renderCard = ({ item, index }: { item: any; index: number }) => {
    return (
      <Animated.View
        entering={ZoomIn.duration(500)}
        exiting={ZoomOut.duration(300)}
        style={[styles.card, { backgroundColor: item.color }]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardType}>Arigo Pay {item.type} Card</Text>
          <CreditCard size={28} color="white" />
        </View>
        <View style={styles.cardNumber}>
          <Text style={styles.cardNumberText}>
            {showCardDetails ? item.cardNumber : '•••• •••• •••• ••••'}
          </Text>
        </View>
        <View style={styles.cardDetails}>
          <View>
            <Text style={styles.cardDetailLabel}>VALID THRU</Text>
            <Text style={styles.cardDetailValue}>
              {showCardDetails ? item.expiryDate : '••/••'}
            </Text>
          </View>
          <View>
            <Text style={styles.cardDetailLabel}>CARD HOLDER</Text>
            <Text style={styles.cardDetailValue}>{item.cardName}</Text>
          </View>
        </View>
        <View style={styles.cardBalance}>
          <Text style={styles.cardBalanceLabel}>Card Balance</Text>
          <Text style={styles.cardBalanceValue}>
            {formatCurrency(item.balance)}
          </Text>
        </View>
      </Animated.View>
    );
  };

  const renderCardIndicator = () => {
    return (
      <View style={styles.pagination}>
        {CARDS.map((_, index) => (
          <Animated.View
            key={index}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(200)}
            style={[
              styles.paginationDot,
              activeCardIndex === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Arigo Pay Cards</Text>
          <Animated.View entering={FadeIn.duration(300)}>
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowCardDetails(!showCardDetails)}
            >
              {showCardDetails ? (
                <EyeOff size={20} color={Colors.textPrimary} />
              ) : (
                <Eye size={20} color={Colors.textPrimary} />
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>

        <FlatList
          data={CARDS}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20}
          decelerationRate="fast"
          contentContainerStyle={styles.cardsList}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / (CARD_WIDTH + 20)
            );
            setActiveCardIndex(index);
          }}
        />

        {renderCardIndicator()}

        <View style={styles.actionsContainer}>
          <Animated.View entering={FadeIn.duration(400).delay(100)}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Block Card</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View entering={FadeIn.duration(400).delay(200)}>
            <TouchableOpacity style={styles.actionButtonOutline}>
              <Text style={styles.actionButtonOutlineText}>Change PIN</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Animated.View
          entering={FadeIn.duration(400).delay(300)}
          style={styles.createCardContainer}
        >
          <TouchableOpacity style={styles.createCardButton}>
            <Plus size={20} color={Colors.primary} />
            <Text style={styles.createCardText}>Add New Card</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}>Card Settings</Text>
          {settings.map((setting) => (
            <Animated.View
              key={setting.id}
              entering={FadeIn.duration(400).delay(400)}
              style={styles.settingItem}
            >
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{setting.title}</Text>
                <Text style={styles.settingDescription}>{setting.description}</Text>
              </View>
              <Switch
                value={setting.toggleEnabled}
                onValueChange={() => toggleSetting(setting.id)}
                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                thumbColor={setting.toggleEnabled ? Colors.primary : '#f4f3f4'}
                ios_backgroundColor={Colors.border}
              />
            </Animated.View>
          ))}
          <Animated.View entering={FadeIn.duration(400).delay(500)}>
            <TouchableOpacity style={styles.moreSettingsButton}>
              <Text style={styles.moreSettingsText}>More Card Settings</Text>
              <ChevronRight size={16} color={Colors.primary} />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.textPrimary,
  },
  eyeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardsList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: 220,
    borderRadius: 20,
    padding: 24,
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardType: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: 'white',
  },
  cardNumber: {
    marginBottom: 24,
  },
  cardNumberText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    color: 'white',
    letterSpacing: 3,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  cardDetailLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 6,
  },
  cardDetailValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: 'white',
  },
  cardBalance: {
    alignItems: 'flex-end',
  },
  cardBalanceLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 6,
  },
  cardBalanceValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: 'white',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.border,
    marginHorizontal: 6,
  },
  paginationDotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.danger,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  actionButtonOutline: {
    flex: 1,
    borderColor: Colors.primary,
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginLeft: 12,
  },
  actionButtonOutlineText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.primary,
  },
  createCardContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  createCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  createCardText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 8,
  },
  settingsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  settingsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  settingDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  moreSettingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  moreSettingsText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.primary,
    marginRight: 8,
  },
  footer: {
    height: 80,
  },
});