import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Account Settings',
      onPress: () => Alert.alert('Coming Soon', 'Account settings will be available soon'),
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      onPress: () => Alert.alert('Coming Soon', 'Notification settings will be available soon'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      onPress: () => Alert.alert('Coming Soon', 'Help & support will be available soon'),
    },
    {
      icon: 'information-circle-outline',
      title: 'About',
      onPress: () => Alert.alert('About', 'Barcode Scanner App v1.0.0\nBuilt with React Native & Expo'),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView>
        <View className="bg-brand-white px-4 py-6 shadow-sm">
          <Text className="text-brand-black text-2xl font-bold text-center">
            Profile
          </Text>
        </View>

        {/* User Info */}
        <View className="bg-brand-white mx-4 mt-4 p-6 rounded-lg shadow-sm">
          <View className="items-center">
            <View className="bg-brand-green w-20 h-20 rounded-full items-center justify-center mb-4">
              <Text className="text-brand-white text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <Text className="text-brand-black text-xl font-bold">{user?.name}</Text>
            <Text className="text-gray-600 mt-1">{user?.email}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="bg-brand-white mx-4 mt-4 rounded-lg shadow-sm overflow-hidden">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              className={`flex-row items-center p-4 ${
                index < menuItems.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <Ionicons name={item.icon as any} size={24} color="#6b7280" />
              <Text className="text-brand-black text-lg ml-4 flex-1">{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View className="mx-4 mt-6 mb-8">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 p-4 rounded-lg flex-row items-center justify-center"
          >
            <Ionicons name="log-out-outline" size={24} color="#ffffff" />
            <Text className="text-brand-white font-bold text-lg ml-2">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}