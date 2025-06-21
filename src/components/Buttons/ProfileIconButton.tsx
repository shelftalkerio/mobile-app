import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AppStackParamList = {
  Profile: undefined;
};

export default function ProfileIconButton() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  return (
    <Pressable onPress={() => navigation.navigate('Profile')}>
      <Ionicons name="person-circle-outline" size={32} color="#6b7280" />
    </Pressable>
  );
}
