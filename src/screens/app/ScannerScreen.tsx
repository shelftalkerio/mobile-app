import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { Camera, CameraView } from 'expo-camera'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useMutation, useLazyQuery } from '@apollo/client'
import { SUBMIT_BARCODES } from '@/apollo/mutations/app/barcode.mutation'
import { QUERY_BARCODE } from '@/apollo/queries/app/barcode.query'
import Toast from 'react-native-toast-message'
import LoadingScreen from './LoadingScreen'
import type { StackNavigationProp } from '@react-navigation/stack'
import { saveScannedItem } from '@/utils/storage'
import uuid from 'react-native-uuid'

type RootStackParamList = {
  LabelDetailsScreen: { label: any }
  ProductDetailsScreen: { product: any }
  AnotherScreen: { id: string }
}
type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'LabelDetailsScreen',
  'ProductDetailsScreen'
>

const { width } = Dimensions.get('window')

export default function ScannerScreen() {
  const uid = uuid.v4() as string
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scanned, setScanned] = useState(false)
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [barcodes, setBarcodes] = useState<string[]>([])
  const [associatedLabel, setAssociatedLabel] = useState<any>(null)
  const [associatedProduct, setAssociatedProduct] = useState<any>(null)

  const navigation = useNavigation<NavigationProp>()

  const [submitBarcodes, { loading }] = useMutation(SUBMIT_BARCODES)
  const [validateBarcode] = useLazyQuery(QUERY_BARCODE)

  useEffect(() => {
    getCameraPermissions()
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      setCameraEnabled(true)
      return () => setCameraEnabled(false)
    }, []),
  )

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync()
    setHasPermission(status === 'granted')
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return

    setScanned(true)

    try {
      const { data: result } = await validateBarcode({
        variables: { barcode: data },
      })

      const validation = result?.validateBarcode

      if (!validation?.valid) {
        Toast.show({
          type: 'error',
          text1: 'Invalid barcode',
          text2: validation?.message,
          position: 'top',
        })
        return
      }

      const barcodeType = validation.type

      // If barcode is associated label, save it to trigger navigation later
      if (barcodeType === 'LABEL' && validation.associated) {
        setAssociatedLabel(validation.code)
        // Don't add it to barcodes or anything else
        return
      }

      if (barcodeType === 'PRODUCT' && validation.associated) {
        setAssociatedProduct(validation.code)
        // Don't add it to barcodes or anything else
        return
      }

      setBarcodes((prev) => {
        const updated = [...prev]
        if (barcodeType === 'LABEL') {
          if (updated[0]) {
            Toast.show({
              type: 'info',
              text1: 'Duplicate Label',
              text2: 'You have already scanned a label.',
              position: 'top',
            })
            return prev
          }
          updated[0] = data
        } else if (barcodeType === 'PRODUCT') {
          if (updated[1]) {
            Toast.show({
              type: 'info',
              text1: 'Duplicate Product',
              text2: 'You have already scanned a product.',
              position: 'top',
            })
            return prev
          }
          updated[1] = data
        }
        return updated
      })
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Failed to validate barcode',
        position: 'top',
      })
    } finally {
      setTimeout(() => setScanned(false), 1000)
    }
  }

  // Navigate when associatedLabel is set
  useEffect(() => {
    if (associatedLabel && !associatedProduct) {
      navigation.navigate('LabelDetailsScreen', {
        label: associatedLabel,
      })
      setAssociatedLabel(null)
    }
    if (associatedProduct && !associatedLabel) {
      navigation.navigate('ProductDetailsScreen', {
        product: associatedProduct,
      })
      setAssociatedProduct(null)
    }
  }, [associatedLabel, associatedProduct, navigation])

  // Submit barcodes when both label and product are scanned
  useEffect(() => {
    if (barcodes[0] && barcodes[1]) {
      sendBarcodes(barcodes)
    }
  }, [barcodes])

  const sendBarcodes = async ([barcode1, barcode2]: string[]) => {
    try {
      const response = await submitBarcodes({
        variables: {
          input: {
            barcode1,
            barcode2,
          },
        },
      })
      saveScannedItem({
        id: uid,
        type: 'Scanned',
        data: JSON.stringify({ Label: barcode1, Product: barcode2 }),
        timestamp: new Date().toISOString(),
      })
      Toast.show({
        type: 'success',
        text1: 'Scan Successful',
        text2: response.data.submitBarcodes.message,
        position: 'top',
      })
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to submit barcodes.',
        position: 'top',
      })
    }
    setBarcodes([])
  }

  if (hasPermission === null) {
    return (
      <SafeAreaView className="flex-1 bg-brand-white justify-center items-center">
        <Text className="text-brand-black text-lg">
          Requesting camera permission...
        </Text>
      </SafeAreaView>
    )
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView className="flex-1 bg-brand-white justify-center items-center px-8">
        <Ionicons name="camera" size={80} color="#6b7280" />
        <Text className="text-brand-black text-xl font-bold text-center mt-4 mb-2">
          Camera Permission Required
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          Please grant camera permission to scan barcodes
        </Text>
        <TouchableOpacity
          className="bg-brand-green px-6 py-3 rounded-lg"
          onPress={getCameraPermissions}
        >
          <Text className="text-brand-white font-semibold">
            Grant Permission
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-brand-black">
      <View className="flex flex-col justify-between flex-1">
        <View className="bg-brand-black px-4 py-6">
          <Text className="text-brand-white text-2xl font-bold text-center">
            Barcode Scanner
          </Text>
          <Text className="text-gray-300 text-center mt-2">
            Point your camera at a barcode to scan
          </Text>
        </View>

        <View className="flex-1 items-center">
          {cameraEnabled && (
            <CameraView
              style={[StyleSheet.absoluteFillObject, { zIndex: 0 }]}
              className="absolute inset-0"
              facing="back"
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: [
                  'qr',
                  'pdf417',
                  'aztec',
                  'ean13',
                  'ean8',
                  'upc_e',
                  'code128',
                  'code39',
                  'code93',
                  'codabar',
                  'itf14',
                  'datamatrix',
                ],
              }}
            />
          )}

          <View className="absolute justify-center items-center inset-0">
            <View
              style={{
                width: width * 0.7,
                height: width * 0.7,
              }}
              className="relative"
            >
              <View className="absolute top-0 left-0 w-[30px] h-[30px] border-l-[4px] border-t-[4px] border-brand-green" />
              <View className="absolute top-0 right-0 w-[30px] h-[30px] border-r-[4px] border-t-[4px] border-brand-green" />
              <View className="absolute bottom-0 left-0 w-[30px] h-[30px] border-l-[4px] border-b-[4px] border-brand-green" />
              <View className="absolute bottom-0 right-0 w-[30px] h-[30px] border-r-[4px] border-b-[4px] border-brand-green" />
            </View>
          </View>

          <View className="absolute bottom-32 left-0 right-0 items-center">
            <View className="bg-brand-black/70 px-6 py-3 rounded-full">
              {!loading ? (
                <Text className="text-brand-white font-semibold">
                  {scanned ? 'Processing...' : 'Align barcode within the frame'}
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        <View className="flex flex-col gap-3 px-2 pb-4 bottom-20">
          <TouchableOpacity
            className="bg-brand-green py-4 rounded-lg items-center"
            onPress={() => null}
            disabled={!scanned}
          >
            <Text className="text-brand-white font-bold text-lg">
              {barcodes[0] ? 'Label Barcode Scanned' : 'Scan Label barcode'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-brand-green py-4 rounded-lg items-center"
            onPress={() => null}
            disabled={!scanned}
          >
            <Text className="text-brand-white font-bold text-lg">
              {barcodes[1] ? 'Product Barcode Scanned' : 'Scan Product barcode'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {loading && <LoadingScreen />}
    </SafeAreaView>
  )
}
