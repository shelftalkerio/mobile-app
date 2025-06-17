import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Camera, CameraView, BarcodeScanningResult } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { saveScannedItem } from '../../utils/storage';

const { width, height } = Dimensions.get('window');

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);

  useEffect(() => {
    getCameraPermissions();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setCameraEnabled(true);
      return () => setCameraEnabled(false);
    }, [])
  );

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleBarCodeScanned = async ({ type, data }: BarcodeScanningResult) => {
    if (scanned) return;
    
    setScanned(true);
    
    const scannedItem = {
      id: Date.now().toString(),
      type,
      data,
      timestamp: new Date().toISOString(),
    };

    try {
      await saveScannedItem(scannedItem);
      
      Alert.alert(
        'Barcode Scanned!',
        `Type: ${type}\nData: ${data}`,
        [
          {
            text: 'Scan Another',
            onPress: () => setScanned(false),
          },
          {
            text: 'OK',
            style: 'default',
            onPress: () => setScanned(false),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save scanned item');
      setScanned(false);
    }
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView className="flex-1 bg-brand-white justify-center items-center">
        <Text className="text-brand-black text-lg">Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView className="flex-1 bg-brand-white justify-center items-center px-8">
        <Ionicons name="camera-off" size={80} color="#6b7280" />
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
          <Text className="text-brand-white font-semibold">Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-brand-black">
      <View className="flex-1">
        <View className="bg-brand-black px-4 py-6">
          <Text className="text-brand-white text-2xl font-bold text-center">
            Barcode Scanner
          </Text>
          <Text className="text-gray-300 text-center mt-2">
            Point your camera at a barcode to scan
          </Text>
        </View>

        <View className="flex-1 relative">
          {cameraEnabled && (
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing="back"
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ['qr', 'pdf417', 'aztec', 'ean13', 'ean8', 'upc_e', 'code128', 'code39', 'code93', 'codabar', 'itf14', 'datamatrix'],
              }}
            />
          )}
          
          {/* Scanning overlay */}
          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>

          {/* Scan status */}
          <View className="absolute bottom-20 left-0 right-0 items-center">
            <View className="bg-brand-black bg-opacity-70 px-6 py-3 rounded-full">
              <Text className="text-brand-white font-semibold">
                {scanned ? 'Processing...' : 'Align barcode within the frame'}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-brand-black px-4 py-6">
          <TouchableOpacity
            className="bg-brand-green py-4 rounded-lg items-center"
            onPress={() => setScanned(false)}
            disabled={!scanned}
          >
            <Text className="text-brand-white font-bold text-lg">
              {scanned ? 'Tap to Scan Again' : 'Ready to Scan'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: width * 0.7,
    height: width * 0.7,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#22c55e',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
});