// components/CustomDrawerContent.tsx
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApplication } from '@/context/ApplicationContext';

export default function CustomDrawerContent(props: any) {
    const { name, version, loading } = useApplication();
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-white">
      <DrawerContentScrollView {...props}>
        <View className='px-5'>
          <Image
            source={require('../assets/icon.png')}
            className="w-full px-5"
            resizeMode="contain"
          />
        </View>

        <View className="space-y-2">
          <DrawerItem
            label="Home"
            onPress={() => null}
            icon={({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />}
            labelStyle={{ color: '#111827' }}
          />
          <DrawerItem
            label="Profile"
            onPress={() => null}
            icon={({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />}
            labelStyle={{ color: '#111827' }}
          />
          <DrawerItem
            label="Settings"
            onPress={() => null}
            icon={({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />}
            labelStyle={{ color: '#111827' }}
          />
        </View>
      </DrawerContentScrollView>

      <View className="flex flex-row justify-between px-4 py-10 border-t border-gray-200">
        <Text className="text-xs text-gray-400">{name}</Text>
        <Text className="text-xs text-gray-400">{version}</Text>
      </View>
    </View>
  );
}
