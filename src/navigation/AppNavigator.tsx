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
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

export type AppTabParamList = {
  Home: undefined;
  Product: undefined;
  History: undefined;
  Profile: undefined;
  Scanner: undefined;
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
        screenOptions={({ route }: { route: RouteProp<Record<string, object | undefined>, string> }): BottomTabNavigationOptions => ({
          tabBarIcon: ({ focused, color, size }: { focused: boolean, color: string, size: number}) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Product':
                iconName = focused ? 'layers' : 'layers-outline';
                break;
              case 'History':
                iconName = focused ? 'list' : 'list-outline';
                break;
              case 'Profile':
                iconName = focused ? 'person' : 'person-outline';
                break;
              default:
                iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size ?? 24} color={color ?? '#000'} />;
          },
          tabBarActiveTintColor: '#22c55e',
          tabBarInactiveTintColor: '#6b7280',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopColor: '#e5e7eb',
            height: 85,
            position: 'absolute',
            padding: 10,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Product" component={ProductScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen
          name="Scanner"
          component={ScannerScreen}
          options={{
            tabBarButton: () => null, // hide from tab bar
          }}
        />
      </Tab.Navigator>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={handleFABPress}
        activeOpacity={0.9}
        className="absolute bottom-14 self-center w-16 h-16 rounded-full bg-green-600 items-center justify-center shadow-lg z-50"
      >
        <Ionicons name="scan-outline" size={28} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}
