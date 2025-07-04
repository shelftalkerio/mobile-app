import React from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native'
import icon from '@/assets/icon.png'

export default function LoadingScreen() {
  return (
    <View style={styles.overlay}>
      <Image source={icon} className="w-full p-5" resizeMode="contain" />
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 20,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(0, 128, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
})
