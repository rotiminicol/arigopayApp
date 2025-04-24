import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
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
} from 'lucide-react-native';
import Colors from '@/constants/Colors';

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
  { id: '1', title: 'Send Money', icon: ArrowUp, color: Colors.primary },
  { id: '2', title: 'Receive', icon: ArrowDown, color: '#4CAF50' },
  { id: '3', title: 'Pay Bills', icon: Zap, color: '#FF9800' },
  { id: '4', title: 'Buy Airtime', icon: PhoneCall, color: '#E91E63' },
  { id: '5', title: 'Card', icon: CreditCard, color: '#2196F3' },
  { id: '6', title: 'Gaming', icon: Gamepad2, color: '#9C27B0' },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

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
        iconBackground = Colors.danger;
        break;
      case 'income':
        icon = <ArrowDown size={18} color="white" />;
        iconBackground = Colors.success;
        break;
      case 'airtime':
        icon = <PhoneCall size={18} color="white" />;
        iconBackground = Colors.warning;
        break;
      case 'bill':
        icon = <Zap size={18} color="white" />;
        iconBackground = Colors.info;
        break;
      default:
        icon = <Wallet size={18} color="white" />;
        iconBackground = Colors.primary;
    }

    return (
      <TouchableOpacity style={styles.transactionItem}>
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
              { color: isCredit ? Colors.success : Colors.danger },
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
      <TouchableOpacity style={styles.quickAction}>
        <View style={[styles.quickActionIcon, { backgroundColor: item.color }]}>
          <Icon size={24} color="white" />
        </View>
        <Text style={styles.quickActionTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
      }
    >
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.profileImageContainer}>
            <Text style={styles.profileInitial}>
              {user?.name?.charAt(0) || 'U'}
            </Text>
          </View>
          <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Wallet size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Account Balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceAmount}>
            {showBalance ? formatCurrency(user?.balance || 0) : '₦•••••••'}
          </Text>
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowBalance(!showBalance)}
          >
            {showBalance ? (
              <Eye size={20} color={Colors.primary} />
            ) : (
              <EyeOff size={20} color={Colors.primary} />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.accountNumber}>
          Account Number: {user?.accountNumber || '•••••••••••'}
        </Text>
      </View>

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

      <View style={styles.transactionsHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRight size={16} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.transactionsContainer}>
        {TRANSACTIONS.map((transaction) => (
          <React.Fragment key={transaction.id}>
            {renderTransactionItem({ item: transaction })}
          </React.Fragment>
        ))}
      </View>

      <View style={styles.promotionCard}>
        <View style={styles.promotionContent}>
          <Text style={styles.promotionTitle}>Invite Friends & Earn</Text>
          <Text style={styles.promotionDescription}>
            Get ₦1,000 when your friend signs up and transacts
          </Text>
          <TouchableOpacity style={styles.promotionButton}>
            <Text style={styles.promotionButtonText}>Invite Now</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/7821517/pexels-photo-7821517.jpeg' }}
          style={styles.promotionImage}
        />
      </View>

      <View style={styles.footer} />
    </ScrollView>
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
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileInitial: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.primary,
  },
  greeting: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    fontSize: 28,
    color: 'white',
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
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    paddingHorizontal: 20,
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
    marginHorizontal: 12,
    width: 80,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
    marginBottom: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.primary,
    marginRight: 4,
  },
  transactionsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 10,
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
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  transactionDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
  promotionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 20,
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
    flex: 3,
    padding: 20,
  },
  promotionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  promotionDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  promotionButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  promotionButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: 'white',
  },
  promotionImage: {
    flex: 2,
    height: '100%',
  },
  footer: {
    height: 80,
  },
});