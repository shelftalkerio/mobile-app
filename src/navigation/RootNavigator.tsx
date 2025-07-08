import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CustomDrawerContent from '@/components/CustomDrawerContent'
import AppNavigator from './AppNavigator'
import LabelDetailsScreen from '@/screens/app/label/DetailsScreen'
import ProductDetailsScreen from '@/screens/app/product/DetailsScreen'

const Drawer = createDrawerNavigator()
const Stack = createNativeStackNavigator()

// Stack that holds all screens including tabs and details
function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={AppNavigator} />
      <Stack.Screen
        name="LabelDetailsScreen"
        component={LabelDetailsScreen}
        options={{ headerShown: true, title: 'Label Information' }}
      />
      <Stack.Screen
        name="ProductDetailsScreen"
        component={ProductDetailsScreen}
        options={{ headerShown: true, title: 'Product Information' }}
      />
    </Stack.Navigator>
  )
}

export default function RootNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="App" component={MainStack} />
    </Drawer.Navigator>
  )
}
