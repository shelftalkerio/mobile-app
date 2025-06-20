import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeScreenCard from '@/components/HomeScreen/Card'
import ProfileIconButton from '@/components/Buttons/ProfileIconButton';


export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-brand-white justify-center items-center">
    <ScrollView className="flex-1 bg-white px-4 pt-10 space-y-5">
      <View className="flex flex-row justify-between items-center w-full">
      {/* Replace 123 with PNG */}
      <Image
        source={require('@/assets/images/logo/logo.png')} // Replace with your PNG path
        className="w-8 h-8"
        resizeMode="contain"
      />

      <ProfileIconButton />
    </View>
    
    <View>
        <Text className="text-3xl font-bold text-black mb-2">
            Welcome
          </Text>
          <Text className="text-gray-300 text-base">
            What would you like to manage today?
          </Text>
    </View>
      

      <View className="flex-row justify-between mb-4">

        <HomeScreenCard icon='cube-outline' title='Products' description='Manage inventory'/>

        <HomeScreenCard icon='pricetag-outline' title='Labels' description='Assign label tags'/>

      </View>

      <View className="flex-row justify-between mb-4">

        <HomeScreenCard icon='megaphone-outline' title='Promotions' description='Track deals'/>

        <HomeScreenCard icon='print-outline' title='Printer' description='Connect to printer'/>
        
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
