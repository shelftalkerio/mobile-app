import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getScannedItems, clearAllScannedItems, deleteScannedItem } from '../../utils/storage';

interface ScannedItem {
  id: string;
  type: string;
  data: string;
  timestamp: string;
}

export default function HistoryScreen() {
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadScannedItems();
    }, [])
  );

  const loadScannedItems = async () => {
    try {
      const items = await getScannedItems();
      setScannedItems(items);
    } catch (error) {
      console.error('Error loading scanned items:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadScannedItems();
    setRefreshing(false);
  };

  const handleDeleteItem = async (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this scanned item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteScannedItem(id);
              await loadScannedItems();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (scannedItems.length === 0) return;

    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all scanned items? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllScannedItems();
              setScannedItems([]);
            } catch (error) {
              Alert.alert('Error', 'Failed to clear history');
            }
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderItem = ({ item }: { item: ScannedItem }) => (
    <View className="bg-brand-white mx-4 mb-3 p-4 rounded-lg shadow-sm border border-gray-200">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-brand-black font-semibold text-lg mb-1">{item.type}</Text>
          <Text className="text-gray-600 text-sm mb-2">{formatDate(item.timestamp)}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteItem(item.id)}
          className="p-2"
        >
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
      
      <View className="bg-gray-50 p-3 rounded-lg">
        <Text className="text-brand-black font-mono text-sm">{item.data}</Text>
      </View>
    </View>
  );

  if (scannedItems.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="bg-brand-white px-4 py-6 shadow-sm">
          <Text className="text-brand-black text-2xl font-bold text-center">
            Scan History
          </Text>
        </View>
        
        <View className="flex-1 justify-center items-center px-8">
          <Ionicons name="document-text-outline" size={80} color="#6b7280" />
          <Text className="text-brand-black text-xl font-bold text-center mt-4 mb-2">
            No Scans Yet
          </Text>
          <Text className="text-gray-600 text-center">
            Your scanned barcodes will appear here
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-brand-white px-4 py-6 shadow-sm">
        <View className="flex-row justify-between items-center">
          <Text className="text-brand-black text-2xl font-bold">
            Scan History
          </Text>
          <TouchableOpacity
            onPress={handleClearAll}
            className="bg-red-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-brand-white font-semibold">Clear All</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-gray-600 mt-1">
          {scannedItems.length} item{scannedItems.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={scannedItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}