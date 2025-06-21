// navigation/RootNavigator.tsx
import { createDrawerNavigator } from '@react-navigation/drawer'
import AppNavigator from './AppNavigator'
import CustomDrawerContent from '@/components/CustomDrawerContent'

const Drawer = createDrawerNavigator()

export default function RootNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="App" component={AppNavigator} />
    </Drawer.Navigator>
  )
}
