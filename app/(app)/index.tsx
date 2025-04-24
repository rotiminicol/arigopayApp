import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowUp,
  ArrowDown,
  CreditCard,
  PhoneCall,
  Zap,
  Gamepad2,
  ChevronRight,
  Wallet,
  Eye,
  EyeOff,
  Gift,
  UserPlus,
  Bell,
  QrCode,
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import * as Haptics from 'expo-haptics';

// Arigo Pay brand colors
const ARIGO_COLORS = {
  primary: '#2563EB', // Vibrant blue
  secondary: '#1E40AF', // Darker blue
  accent: '#3B82F6', // Light blue
  background: '#F8FAFC', // Very light gray/white
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
};

// Sample transaction data
const TRANSACTIONS = [
  {
    id: '1',
    type: 'debit',
    amount: 3500,
    description: 'Transfer to John Doe',
    date: '2023-06-15T10:30:00',
    category: 'transfer',
  },
  {
    id: '2',
    type: 'credit',
    amount: 25000,
    description: 'Salary payment',
    date: '2023-06-14T09:15:00',
    category: 'income',
  },
  {
    id: '3',
    type: 'debit',
    amount: 1200,
    description: 'Airtime purchase',
    date: '2023-06-13T16:45:00',
    category: 'airtime',
  },
  {
    id: '4',
    type: 'debit',
    amount: 7500,
    description: 'DSTV Subscription',
    date: '2023-06-12T14:20:00',
    category: 'bill',
  },
];

// Quick actions data
const QUICK_ACTIONS = [
  { id: '1', title: 'Send Money', icon: ArrowUp, color: ARIGO_COLORS.primary },
  { id: '2', title: 'Receive', icon: ArrowDown, color: ARIGO_COLORS.success },
  { id: '3', title: 'Pay Bills', icon: Zap, color: ARIGO_COLORS.warning },
  { id: '4', title: 'Buy Airtime', icon: PhoneCall, color: ARIGO_COLORS.danger },
  { id: '5', title: 'Cards', icon: CreditCard, color: ARIGO_COLORS.info },
  { id: '6', title: 'Rewards', icon: Gift, color: ARIGO_COLORS.accent },
];

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation values
  const balanceScale = useRef(new Animated.Value(1)).current;
  const quickActionScale = useRef(new Animated.Value(1)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(20)).current;
  
  // Initialize animations
  React.useEffect(() => {
    // Card entrance animation
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Balance press animation
  const animateBalancePress = () => {
    Animated.sequence([
      Animated.timing(balanceScale, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(balanceScale, {
        toValue: 1,
        duration: 200,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Quick action press animation
  const animateQuickActionPress = (callback: () => void) => {
    Haptics.selectionAsync();
    Animated.sequence([
      Animated.timing(quickActionScale, {
        toValue: 0.9,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(quickActionScale, {
        toValue: 1,
        duration: 200,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
    ]).start(() => callback());
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const renderTransactionItem = ({ item }: { item: any }) => {
    const isCredit = item.type === 'credit';

    let icon;
    let iconBackground;

    switch (item.category) {
      case 'transfer':
        icon = <ArrowUp size={18} color="white" />;
        iconBackground = ARIGO_COLORS.danger;
        break;
      case 'income':
        icon = <ArrowDown size={18} color="white" />;
        iconBackground = ARIGO_COLORS.success;
        break;
      case 'airtime':
        icon = <PhoneCall size={18} color="white" />;
        iconBackground = ARIGO_COLORS.warning;
        break;
      case 'bill':
        icon = <Zap size={18} color="white" />;
        iconBackground = ARIGO_COLORS.info;
        break;
      default:
        icon = <Wallet size={18} color="white" />;
        iconBackground = ARIGO_COLORS.primary;
    }

    return (
      <TouchableOpacity 
        style={styles.transactionItem}
        activeOpacity={0.7}
        onPress={() => Haptics.selectionAsync()}
      >
        <View style={[styles.transactionIcon, { backgroundColor: iconBackground }]}>
          {icon}
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.transactionAmount}>
          <Text
            style={[
              styles.transactionAmountText,
              { color: isCredit ? ARIGO_COLORS.success : ARIGO_COLORS.danger },
            ]}
          >
            {isCredit ? '+' : '-'} {formatCurrency(item.amount)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderQuickAction = ({ item }: { item: any }) => {
    const Icon = item.icon;
    
    return (
      <Animated.View style={{ transform: [{ scale: quickActionScale }] }}>
        <TouchableOpacity 
          style={styles.quickAction}
          activeOpacity={0.7}
          onPress={() => animateQuickActionPress(() => {
            // Handle quick action press
            console.log(`${item.title} pressed`);
          })}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: item.color }]}>
            <Icon size={24} color="white" />
          </View>
          <Text style={styles.quickActionTitle}>{item.title}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
          colors={[ARIGO_COLORS.primary]} 
          tintColor={ARIGO_COLORS.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.profileImageContainer}>
            <Text style={styles.profileInitial}>
              {user?.name?.charAt(0) || 'U'}
            </Text>
          </View>
          <View>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => Haptics.selectionAsync()}
          >
            <Bell size={24} color={ARIGO_COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => Haptics.selectionAsync()}
          >
            <QrCode size={24} color={ARIGO_COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Balance Card */}
      <Animated.View 
        style={[
          styles.balanceCard, 
          { 
            opacity: cardOpacity,
            transform: [{ translateY: cardTranslateY }],
          }
        ]}
      >
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Animated.View style={{ transform: [{ scale: balanceScale }] }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              animateBalancePress();
              setShowBalance(!showBalance);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <View style={styles.balanceRow}>
              <Text style={styles.balanceAmount}>
                {showBalance ? formatCurrency(user?.balance || 0) : '₦•••••••'}
              </Text>
              <View style={styles.eyeButton}>
                {showBalance ? (
                  <Eye size={20} color="white" />
                ) : (
                  <EyeOff size={20} color="white" />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.accountNumber}>
          Account: {user?.accountNumber || '•••••••••••'}
        </Text>
        
        {/* Quick Balance Actions */}
        <View style={styles.balanceActions}>
          <TouchableOpacity 
            style={styles.balanceActionButton}
            onPress={() => Haptics.selectionAsync()}
          >
            <ArrowUp size={20} color={ARIGO_COLORS.primary} />
            <Text style={styles.balanceActionText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.balanceActionButton}
            onPress={() => Haptics.selectionAsync()}
          >
            <ArrowDown size={20} color={ARIGO_COLORS.primary} />
            <Text style={styles.balanceActionText}>Receive</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.balanceActionButton}
            onPress={() => Haptics.selectionAsync()}
          >
            <Wallet size={20} color={ARIGO_COLORS.primary} />
            <Text style={styles.balanceActionText}>Top Up</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <FlatList
        data={QUICK_ACTIONS}
        renderItem={renderQuickAction}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickActionsContainer}
        contentContainerStyle={styles.quickActionsContent}
      />

      {/* Recent Transactions */}
      <View style={styles.transactionsHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => Haptics.selectionAsync()}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRight size={16} color={ARIGO_COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.transactionsContainer}>
        {TRANSACTIONS.map((transaction) => (
          <React.Fragment key={transaction.id}>
            {renderTransactionItem({ item: transaction })}
          </React.Fragment>
        ))}
      </View>

      {/* Promotion Card */}
      <Animated.View 
        style={[
          styles.promotionCard,
          { 
            opacity: cardOpacity,
            transform: [{ translateY: cardTranslateY }],
          }
        ]}
      >
        <View style={styles.promotionContent}>
          <View style={styles.promotionBadge}>
            <Text style={styles.promotionBadgeText}>NEW</Text>
          </View>
          <Text style={styles.promotionTitle}>Invite Friends & Earn</Text>
          <Text style={styles.promotionDescription}>
            Get ₦1,000 when your friend signs up and completes their first transaction
          </Text>
          <TouchableOpacity 
            style={styles.promotionButton}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          >
            <UserPlus size={16} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.promotionButtonText}>Invite Now</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80' }}
          style={styles.promotionImage}
        />
      </Animated.View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ARIGO_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: 'white',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ARIGO_COLORS.primary + '20', // 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileInitial: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: ARIGO_COLORS.primary,
  },
  greeting: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: ARIGO_COLORS.textSecondary,
  },
  userName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: ARIGO_COLORS.textPrimary,
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ARIGO_COLORS.primary + '10', // 10% opacity
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    backgroundColor: ARIGO_COLORS.primary,
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 24,
    marginTop: 10,
    marginBottom: 24,
    shadowColor: ARIGO_COLORS.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  balanceLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  balanceAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: 'white',
    letterSpacing: 0.5,
  },
  eyeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountNumber: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 24,
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
  },
  balanceActionButton: {
    alignItems: 'center',
    flex: 1,
  },
  balanceActionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: 'white',
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: ARIGO_COLORS.textPrimary,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  quickActionsContent: {
    paddingHorizontal: 16,
  },
  quickAction: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 80,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: ARIGO_COLORS.textPrimary,
    textAlign: 'center',
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 24,
    marginBottom: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: ARIGO_COLORS.primary,
    marginRight: 4,
  },
  transactionsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: ARIGO_COLORS.textPrimary,
    marginBottom: 4,
  },
  transactionDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: ARIGO_COLORS.textSecondary,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
  },
  promotionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 40,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  promotionContent: {
    flex: 1,
    padding: 20,
  },
  promotionBadge: {
    backgroundColor: ARIGO_COLORS.danger + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  promotionBadgeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    color: ARIGO_COLORS.danger,
  },
  promotionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: ARIGO_COLORS.textPrimary,
    marginBottom: 8,
  },
  promotionDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: ARIGO_COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  promotionButton: {
    backgroundColor: ARIGO_COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  promotionButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: 'white',
  },
  promotionImage: {
    width: 120,
    height: '100%',
  },
  footer: {
    height: 40,
  },
});