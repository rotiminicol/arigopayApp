import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Tabs } from 'expo-router';
import { Chrome as Home, SendHorizontal, Wallet, CreditCard, Menu, LucideIcon } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Colors from '@/constants/Colors';

// Define TypeScript interface for TabIcon props
interface TabIconProps {
  icon: LucideIcon;
  color: string;
  size: number;
  focused: boolean;
}

// Custom Tab Icon Component with Animation
const TabIcon: React.FC<TabIconProps> = ({ icon: Icon, color, size, focused }) => {
  const scale = useSharedValue(focused ? 1.2 : 1);
  const opacity = useSharedValue(focused ? 1 : 0.7);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.2 : 1);
    opacity.value = withSpring(focused ? 1 : 0.7);
  }, [focused, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.iconContainer}>
      <Animated.View style={animatedStyle}>
        <Icon size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
      </Animated.View>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
};

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: 'Poppins-SemiBold',
          fontSize: 11,
          marginTop: -2,
          marginBottom: 6,
          letterSpacing: 0.5,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          height: 72,
          borderRadius: 20,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          backgroundColor: 'white',
          paddingBottom: 10,
          paddingTop: 10,
          borderColor: Colors.border,
          borderWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon icon={Home} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="send"
        options={{
          title: 'Send',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon icon={SendHorizontal} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="pay"
        options={{
          title: 'Pay',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon icon={Wallet} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: 'Cards',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon icon={CreditCard} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon icon={Menu} color={color} size={size} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
});