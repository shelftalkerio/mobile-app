import { Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, DrawerActions } from '@react-navigation/native'
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs'

export function DrawerButton(props: BottomTabBarButtonProps) {
  const navigation = useNavigation()

  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons
        name="menu"
        size={24}
        color={props.accessibilityState?.selected ? '#22c55e' : '#6b7280'}
      />
      <Text
        className={`text-xs mt-1 ${props.accessibilityState?.selected ? 'text-green-500' : 'text-gray-400'}`}
      >
        More
      </Text>
    </TouchableOpacity>
  )
}
