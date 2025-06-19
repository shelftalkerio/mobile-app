import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/app/HomeScreen';
import ScannerScreen from '../screens/app/ScannerScreen';
import ProductScreen from '../screens/app/ProductScreen';
import HistoryScreen from '../screens/app/HistoryScreen';
import ProfileScreen from '../screens/app/ProfileScreen';
import { useNavigation } from '@react-navigation/native';
import { styled } from 'nativewind';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

const StyledTouchable = styled(TouchableOpacity);

export type AppTabParamList = {
  Home: undefined;
  Product: undefined;
  History: undefined;
  Profile: undefined;
  Scanner: undefined; // Optional if Scanner is a full screen route
};

const Tab = createBottomTabNavigator<AppTabParamList>();

type AppTabNavigationProp = BottomTabNavigationProp<AppTabParamList>;

export default function AppNavigator() {
  const navigation = useNavigation<AppTabNavigationProp>();

  const handleFABPress = () => {
    navigation.navigate('Scanner');
  };

  return (
    <View className="flex-1">
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Product') {
              iconName = focused ? 'layers' : 'layers-outline';
            } else if (route.name === 'History') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else {
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#22c55e',
          tabBarInactiveTintColor: '#6b7280',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopColor: '#e5e7eb',
            height: 85,
            position: 'absolute',
            padding: 10
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Product" component={ProductScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Scanner" component={ScannerScreen} options={{
            tabBarButton: () => null, 
          }}
        />
      </Tab.Navigator>

      {/* Floating Action Button */}
      <StyledTouchable
        onPress={handleFABPress}
        activeOpacity={0.9}
        className="absolute bottom-14 self-center w-16 h-16 rounded-full bg-green-600 items-center justify-center shadow-lg z-50"
      >
        <Ionicons name="scan-outline" size={28} color="#ffffff" />
      </StyledTouchable>
    </View>
  );
}
