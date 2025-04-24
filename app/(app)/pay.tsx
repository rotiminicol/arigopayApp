import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions, Easing } from 'react-native';
import { Phone, Zap, Gamepad2, Tv, ShoppingBag, Gift, ChevronRight, Shield, Clock, CheckCircle, AlertCircle, LucideProps } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Enhanced Arigo Pay company colors
const Colors = {
  primary: '#0055FF',          // Vibrant blue
  primaryDark: '#0039A6',      // Darker blue
  primaryLight: '#4D8AFF',     // Lighter blue
  secondary: '#FFFFFF',        // White
  background: '#F5F9FF',       // Very light blue background
  border: '#E5EFFF',           // Border color
  textPrimary: '#0A2463',      // Dark blue text
  textSecondary: '#6B7897',    // Gray text
  shadow: 'rgba(0, 85, 255, 0.15)', // Blue shadow
  success: '#00C853',          // Green
  warning: '#FFB300',          // Orange/Yellow
  error: '#FF3D00',            // Red
  accent: '#00D1FF',           // Cyan accent
};

const PAYMENT_OPTIONS = [
  {
    id: '1',
    title: 'Airtime',
    description: 'Top up any network',
    icon: Phone,
    color: Colors.primary,
  },
  {
    id: '2',
    title: 'Electricity',
    description: 'Pay electricity bills',
    icon: Zap,
    color: Colors.primary,
  },
  {
    id: '3',
    title: 'Gaming',
    description: 'Buy gaming credits',
    icon: Gamepad2,
    color: Colors.primary,
  },
  {
    id: '4',
    title: 'TV & Internet',
    description: 'Pay subscriptions',
    icon: Tv,
    color: Colors.primary,
  },
  {
    id: '5',
    title: 'Shopping',
    description: 'Pay at online stores',
    icon: ShoppingBag,
    color: Colors.primary,
  },
  {
    id: '6',
    title: 'Gift Cards',
    description: 'Purchase gift cards',
    icon: Gift,
    color: Colors.primary,
  },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function ArigoPayScreen() {
  // Header animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  // Scroll animations
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Grid item animations
  const gridItemAnims = PAYMENT_OPTIONS.map(() => ({
    opacity: useRef(new Animated.Value(0)).current,
    translateY: useRef(new Animated.Value(30)).current,
    scale: useRef(new Animated.Value(0.9)).current,
  }));

  // Promo card animations
  const promoScrollX = useRef(new Animated.Value(0)).current;
  const promoCardAnims = [0, 1, 2].map(() => ({
    opacity: useRef(new Animated.Value(0)).current,
    translateX: useRef(new Animated.Value(50)).current,
  }));

  // Transaction animations
  const transactionAnims = [0, 1, 2].map(() => ({
    opacity: useRef(new Animated.Value(0)).current,
    translateX: useRef(new Animated.Value(-20)).current,
  }));

  // Wave animation for header
  const waveAnim = useRef(new Animated.Value(0)).current;
  const waveInterpolate = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '5deg'],
  });

  useEffect(() => {
    // Wave animation (continuous subtle movement)
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Header animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered animation for grid items
    const gridAnimations = gridItemAnims.map((anim, index) => {
      return Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 500,
          delay: 300 + index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration: 600,
          delay: 300 + index * 100,
          easing: Easing.out(Easing.back(1.7)),
          useNativeDriver: true,
        }),
        Animated.timing(anim.scale, {
          toValue: 1,
          duration: 600,
          delay: 300 + index * 100,
          easing: Easing.out(Easing.elastic(1)),
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.stagger(50, gridAnimations).start();

    // Promo card animations
    const promoAnimations = promoCardAnims.map((anim, index) => {
      return Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 600,
          delay: 1000 + index * 200,
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateX, {
          toValue: 0,
          duration: 600,
          delay: 1000 + index * 200,
          easing: Easing.out(Easing.back(1)),
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.stagger(100, promoAnimations).start();

    // Transaction animations
    const transactionAnimations = transactionAnims.map((anim, index) => {
      return Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 500,
          delay: 1600 + index * 150,
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateX, {
          toValue: 0,
          duration: 500,
          delay: 1600 + index * 150,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.stagger(50, transactionAnimations).start();
  }, []);

  // Header transform based on scroll
  const headerTransform = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.8, 0],
    extrapolate: 'clamp',
  });

  // Parallax effect for header
  const parallaxHeader = scrollY.interpolate({
    inputRange: [0, SCREEN_HEIGHT * 0.3],
    outputRange: [0, -SCREEN_HEIGHT * 0.1],
    extrapolate: 'clamp',
  });

  // Promo card scale effect
  const promoCardScale = promoScrollX.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [0.9, 1, 0.9],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Animated Gradient Header */}
      <Animated.View 
        style={[
          styles.headerContainer, 
          { 
            transform: [
              { translateY: parallaxHeader },
              { rotate: waveInterpolate }
            ] 
          }
        ]}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <Animated.View 
            style={[
              styles.header, 
              { 
                opacity: fadeAnim, 
                transform: [
                  { translateY: headerTransform },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <View style={styles.headerTop}>
              <Text style={styles.headerTitle}>Arigo Pay</Text>
              <TouchableOpacity style={styles.headerIcon}>
                <Shield size={20} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.headerSubtitle}>Fast, Secure Payments</Text>
            
            <Animated.View style={[styles.quickAccess, { opacity: headerOpacity }]}>
              <TouchableOpacity style={styles.quickAccessItem}>
                <Text style={styles.quickAccessText}>History</Text>
              </TouchableOpacity>
              <View style={styles.quickAccessDivider} />
              <TouchableOpacity style={styles.quickAccessItem}>
                <Text style={styles.quickAccessText}>Favorites</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
          
          {/* Floating bubbles */}
          <Animated.View style={[styles.headerBubble1, { transform: [{ scale: scaleAnim }] }]} />
          <Animated.View style={[styles.headerBubble2, { transform: [{ scale: scaleAnim }] }]} />
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.contentContainer}>
          {/* Payment Options Grid */}
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>Payment Services</Text>
          </View>
          
          <View style={styles.grid}>
            {PAYMENT_OPTIONS.map((option, index) => {
              const Icon = option.icon;
              return (
                <Animated.View 
                  key={option.id}
                  style={[
                    styles.gridItemWrapper,
                    { 
                      opacity: gridItemAnims[index].opacity,
                      transform: [
                        { translateY: gridItemAnims[index].translateY },
                        { scale: gridItemAnims[index].scale }
                      ]
                    }
                  ]}
                >
                  <TouchableOpacity 
                    style={styles.gridItem}
                    activeOpacity={0.8}
                  >
                    <View style={styles.gridItemContent}>
                      <View style={styles.iconCircle}>
                        <LinearGradient
                          colors={[Colors.primary, Colors.accent]}
                          style={styles.iconBackground}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <Icon size={20} color="white" />
                        </LinearGradient>
                      </View>
                      <View style={styles.gridItemText}>
                        <Text style={styles.gridItemTitle}>{option.title}</Text>
                        <Text style={styles.gridItemDescription}>{option.description}</Text>
                      </View>
                      <ChevronRight size={18} color={Colors.textSecondary} />
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {/* Promo Section */}
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>Special Offers</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.promoContainer}>
            <Animated.ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.promoScrollContent}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: promoScrollX } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
              decelerationRate="fast"
              snapToInterval={SCREEN_WIDTH - 80}
            >
              <Animated.View 
                style={[
                  { 
                    opacity: promoCardAnims[0].opacity,
                    transform: [{ translateX: promoCardAnims[0].translateX }]
                  }
                ]}
              >
                <PromoCard 
                  title="20% Cashback"
                  description="On all electricity bills this weekend"
                  color={Colors.primary}
                  tag="Limited Time"
                />
              </Animated.View>
              
              <Animated.View 
                style={[
                  { 
                    opacity: promoCardAnims[1].opacity,
                    transform: [{ translateX: promoCardAnims[1].translateX }]
                  }
                ]}
              >
                <PromoCard 
                  title="Free Data Bonus"
                  description="Buy airtime, get free data instantly"
                  color="#4D8AFF"
                  tag="Exclusive"
                />
              </Animated.View>
              
              <Animated.View 
                style={[
                  { 
                    opacity: promoCardAnims[2].opacity,
                    transform: [{ translateX: promoCardAnims[2].translateX }]
                  }
                ]}
              >
                <PromoCard 
                  title="No Fees"
                  description="Zero transaction fees on all payments"
                  color="#0044CC"
                  tag="New"
                />
              </Animated.View>
            </Animated.ScrollView>
          </View>

          {/* Recent Transactions Section */}
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsContainer}>
            <Animated.View 
              style={[
                { 
                  opacity: transactionAnims[0].opacity,
                  transform: [{ translateX: transactionAnims[0].translateX }]
                }
              ]}
            >
              <TransactionItem 
                title="Electricity Bill" 
                description="Successful" 
                amount="-$45.00" 
                date="Today, 10:45 AM" 
                icon={Zap}
                status="success"
              />
            </Animated.View>
            
            <Animated.View 
              style={[
                { 
                  opacity: transactionAnims[1].opacity,
                  transform: [{ translateX: transactionAnims[1].translateX }]
                }
              ]}
            >
              <TransactionItem 
                title="TV Subscription" 
                description="Pending" 
                amount="-$28.50" 
                date="Yesterday, 8:32 PM" 
                icon={Tv}
                status="pending"
              />
            </Animated.View>
            
            <Animated.View 
              style={[
                { 
                  opacity: transactionAnims[2].opacity,
                  transform: [{ translateX: transactionAnims[2].translateX }]
                }
              ]}
            >
              <TransactionItem 
                title="Mobile Recharge" 
                description="Successful" 
                amount="-$10.00" 
                date="24 Apr, 3:15 PM" 
                icon={Phone}
                status="success"
              />
            </Animated.View>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

// Promo Card Component
interface PromoCardProps {
  title: string;
  description: string;
  color: string;
  tag: string;
}

const PromoCard: React.FC<PromoCardProps> = ({ title, description, color, tag }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity 
      style={[styles.promoCard, { shadowColor: color }]}
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <LinearGradient
          colors={[color, color + 'DD']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.promoCardGradient}
        >
          <View style={styles.promoTag}>
            <Text style={styles.promoTagText}>{tag}</Text>
          </View>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>{title}</Text>
            <Text style={styles.promoDescription}>{description}</Text>
            <TouchableOpacity 
              style={styles.promoButton}
              activeOpacity={0.8}
            >
              <Text style={styles.promoButtonText}>Claim Now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.promoBubble1} />
          <View style={styles.promoBubble2} />
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Transaction Item Component
interface TransactionItemProps {
  title: string;
  description: string;
  amount: string;
  date: string;
  icon: React.ComponentType<LucideProps>;
  status: 'success' | 'pending' | 'failed';
}

const TransactionItem: React.FC<TransactionItemProps> = ({ title, description, amount, date, icon: Icon, status }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  let statusColor;
  let StatusIcon;
  
  switch (status) {
    case 'success':
      statusColor = Colors.success;
      StatusIcon = CheckCircle;
      break;
    case 'pending':
      statusColor = Colors.warning;
      StatusIcon = Clock;
      break;
    case 'failed':
      statusColor = Colors.error;
      StatusIcon = AlertCircle;
      break;
    default:
      statusColor = Colors.textSecondary;
      StatusIcon = CheckCircle;
  }

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity 
      style={styles.transactionItem}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <View style={styles.transactionContent}>
          <View style={[styles.transactionIcon, { backgroundColor: `${Colors.primary}15` }]}>
            <Icon size={18} color={Colors.primary} />
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionTitle}>{title}</Text>
            <View style={styles.transactionStatusContainer}>
              <StatusIcon size={14} color={statusColor} style={styles.statusIcon} />
              <Text style={[styles.transactionStatus, { color: statusColor }]}>{description}</Text>
            </View>
          </View>
          <View style={styles.transactionAmount}>
            <Text style={styles.transactionAmountText}>{amount}</Text>
            <Text style={styles.transactionDate}>{date}</Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 0.5,
  },
  headerIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
  },
  quickAccess: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
  },
  quickAccessItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  quickAccessText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  quickAccessDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: 180,
  },
  scrollViewContent: {
    paddingBottom: 30,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  sectionTitleText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridItemWrapper: {
    width: '48%',
    marginBottom: 15,
  },
  gridItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  gridItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    marginRight: 12,
  },
  iconBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridItemText: {
    flex: 1,
  },
  gridItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  gridItemDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  promoContainer: {
    height: 180,
    marginBottom: 20,
  },
  promoScrollContent: {
    paddingRight: 20,
  },
  promoCard: {
    width: SCREEN_WIDTH - 80,
    height: 160,
    borderRadius: 20,
    marginRight: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  promoCardGradient: {
    flex: 1,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  promoTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  promoTagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  promoContent: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
  },
  promoTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  promoDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  promoButton: {
    backgroundColor: 'white',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  promoBubble1: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    bottom: -50,
    right: -30,
  },
  promoBubble2: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -30,
    right: 40,
  },
  transactionsContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  transactionItem: {
    padding: 10,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  transactionStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 4,
  },
  transactionStatus: {
    fontSize: 13,
    fontWeight: '500',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  headerBubble1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    top: -50,
    right: -50,
  },
  headerBubble2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: -30,
    left: -30,
  },
});