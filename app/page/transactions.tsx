import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {
  ArrowUp,
  ArrowDown,
  Filter,
  Search,
  PhoneCall,
  Zap,
  Wallet,
  ShoppingCart,
} from 'lucide-react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';

// Arigo Pay color scheme
const Colors = {
  primary: '#4A3AFF', // Arigo Pay purple
  secondary: '#FF6B6B', // Coral accent
  success: '#00C4B4', // Teal for credits
  danger: '#FF3B30', // Red for debits
  warning: '#FF9500', // Orange for airtime
  info: '#5856D6', // Blue for bills
  background: '#F7F7FC', // Light gray background
  textPrimary: '#1C2526', // Dark text
  textSecondary: '#6B7280', // Gray text
  cardBackground: '#FFFFFF',
};

// Sample transaction data
const ALL_TRANSACTIONS = [
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
  {
    id: '5',
    type: 'debit',
    amount: 2000,
    description: 'Uber Ride',
    date: '2023-06-11T18:30:00',
    category: 'shopping',
  },
  {
    id: '6',
    type: 'credit',
    amount: 5000,
    description: 'Refund from Amazon',
    date: '2023-06-10T12:15:00',
    category: 'income',
  },
  {
    id: '7',
    type: 'debit',
    amount: 12500,
    description: 'Shoprite Purchase',
    date: '2023-06-09T15:45:00',
    category: 'shopping',
  },
  {
    id: '8',
    type: 'debit',
    amount: 3000,
    description: 'Internet Subscription',
    date: '2023-06-08T09:20:00',
    category: 'bill',
  },
];

// Tab options for filtering transactions
const TABS = [
  { id: 'all', label: 'All' },
  { id: 'credit', label: 'Credit' },
  { id: 'debit', label: 'Debit' },
];

export default function ArigoPayTransactionsScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState(ALL_TRANSACTIONS);
  const [refreshing, setRefreshing] = useState(false);

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter((transaction) => {
    if (activeTab === 'all') return true;
    return transaction.type === activeTab;
  });

  // Group transactions by date
  const groupedTransactions: Record<string, typeof ALL_TRANSACTIONS> = {};
  filteredTransactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const dateString = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!groupedTransactions[dateString]) {
      groupedTransactions[dateString] = [];
    }
    groupedTransactions[dateString].push(transaction);
  });

  // Convert grouped transactions to array format for FlatList
  const groupedTransactionsArray = Object.entries(groupedTransactions).map(
    ([date, transactions]) => ({
      date,
      data: transactions,
    })
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
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
      case 'shopping':
        icon = <ShoppingCart size={18} color="white" />;
        iconBackground = Colors.secondary;
        break;
      default:
        icon = <Wallet size={18} color="white" />;
        iconBackground = Colors.primary;
    }

    return (
      <Animated.View
        entering={FadeIn.duration(500)}
        exiting={FadeOut.duration(300)}
        style={styles.transactionItem}
      >
        <View style={[styles.transactionIcon, { backgroundColor: iconBackground }]}>
          {icon}
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <Text style={styles.transactionTime}>
            {new Date(item.date).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
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
      </Animated.View>
    );
  };

  const renderDateGroup = ({ item }: { item: { date: string; data: any[] } }) => (
    <Animated.View
      entering={SlideInDown.duration(600)}
      exiting={SlideOutDown.duration(400)}
      style={styles.dateGroup}
    >
      <Text style={styles.dateHeader}>{item.date}</Text>
      {item.data.map((transaction) => (
        <React.Fragment key={transaction.id}>
          {renderTransactionItem({ item: transaction })}
        </React.Fragment>
      ))}
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Arigo Pay Transactions</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Filter size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Animated.Text
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(200)}
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Animated.Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={groupedTransactionsArray}
          renderItem={renderDateGroup}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.transactionsList}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No transactions found</Text>
            </View>
          }
        />
      )}
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
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: Colors.background,
  },
  activeTab: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionsList: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 12,
    paddingLeft: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  transactionTime: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.textSecondary,
  },
});