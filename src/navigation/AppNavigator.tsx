import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import HomeScreen from '../screens/app/HomeScreen'
import ScannerScreen from '../screens/app/ScannerScreen'
import HistoryScreen from '../screens/app/HistoryScreen'
import ProfileScreen from '../screens/app/ProfileScreen'
import { useNavigation } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import type { RouteProp } from '@react-navigation/native'
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { DrawerButton } from '@/components/DrawerButton'
import AccountScreen from '@/screens/settings/AccountScreen'
import { AppTabParamList } from '@/types/AppTabParams'
import ProductMainScreen from '@/screens/app/product/MainScreen'
import LabelMainScreen from '@/screens/app/label/MainScreen'
import NotificationScreen from '@/screens/app/NotificationScreen'
import PromotionMainScreen from '@/screens/app/promotion/MainScreen'

const Tab = createBottomTabNavigator<AppTabParamList>()

type AppTabNavigationProp = BottomTabNavigationProp<AppTabParamList>

export default function AppNavigator() {
  const navigation = useNavigation<AppTabNavigationProp>()

  const goToScanner = () => {
    navigation.navigate('Scanner')
  }

  return (
    <View className="flex-1">
      <Tab.Navigator
        screenOptions={({
          route,
        }: {
          route: RouteProp<Record<string, object | undefined>, string>
        }): BottomTabNavigationOptions => ({
          tabBarIcon: ({
            focused,
            color,
            size,
          }: {
            focused: boolean
            color: string
            size: number
          }) => {
            let iconName: keyof typeof Ionicons.glyphMap

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline'
                break
              case 'Notification':
                iconName = focused ? 'notifications' : 'notifications-outline'
                break
              case 'History':
                iconName = focused ? 'list' : 'list-outline'
                break
              case 'Profile':
                iconName = focused ? 'person' : 'person-outline'
                break
              default:
                iconName = 'help-outline'
            }

            return (
              <Ionicons
                name={iconName}
                size={size ?? 24}
                color={color ?? '#000'}
              />
            )
          },
          tabBarActiveTintColor: '#22c55e',
          tabBarInactiveTintColor: '#6b7280',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopColor: '#e5e7eb',
            height: 100,
            position: 'relative',
            padding: 0,
            zIndex: 5,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Notification" component={NotificationScreen} />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarButton: () => null,
          }}
        />
        <Tab.Screen
          name="Menu"
          component={HomeScreen}
          options={{
            tabBarButton: (props) => <DrawerButton {...props} />,
          }}
        />
        <Tab.Screen
          name="Scanner"
          component={ScannerScreen}
          options={{
            tabBarButton: () => null,
          }}
        />
        <Tab.Screen
          name="Account"
          component={AccountScreen}
          options={{
            tabBarButton: () => null,
          }}
        />
        <Tab.Screen
          name="Product"
          component={ProductMainScreen}
          options={{
            tabBarButton: () => null,
          }}
        />
        <Tab.Screen
          name="Label"
          component={LabelMainScreen}
          options={{
            tabBarButton: () => null,
          }}
        />
        <Tab.Screen
          name="Promotion"
          component={PromotionMainScreen}
          options={{
            tabBarButton: () => null,
          }}
        />
      </Tab.Navigator>

      <TouchableOpacity
        onPress={goToScanner}
        activeOpacity={0.9}
        className="absolute bottom-[80px] self-center w-16 h-16 rounded-full bg-green-600 items-center justify-center z-[999] elevation-[10]"
      >
        <Ionicons name="barcode-outline" size={38} color="#ffffff" />
      </TouchableOpacity>
    </View>
  )
}
