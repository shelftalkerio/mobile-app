import React, { useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  RefreshControl,
  ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import {
  getScannedItems,
  clearAllScannedItems,
  deleteScannedItem,
  ScannedItem,
} from '../../utils/storage'

const TABS = ['All', 'Scanned', 'Dissociate', 'Promotions']

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState('All')
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([])
  const [refreshing, setRefreshing] = useState(false)

  useFocusEffect(
    React.useCallback(() => {
      loadScannedItems()
    }, []),
  )

  const loadScannedItems = async () => {
    try {
      const items = await getScannedItems()
      setScannedItems(items)
    } catch (error) {
      console.error('Error loading scanned items:', error)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadScannedItems()
    setRefreshing(false)
  }

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
              await deleteScannedItem(id)
              await loadScannedItems()
            } catch (error) {
              Alert.alert('Error', 'Failed to delete item')
            }
          },
        },
      ],
    )
  }

  const handleClearAll = () => {
    if (scannedItems.length === 0) return

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
              await clearAllScannedItems()
              setScannedItems([])
            } catch (error) {
              Alert.alert('Error', 'Failed to clear history')
            }
          },
        },
      ],
    )
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return (
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    )
  }

  const renderItem = ({ item }: { item: ScannedItem }) => (
    <View
      key={item.id}
      className="bg-brand-white mx-4 mb-3 p-4 rounded-lg shadow-sm border border-gray-200"
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-brand-black font-semibold text-lg mb-1">
            {item.type}
          </Text>
          <Text className="text-gray-600 text-sm mb-2">
            {formatDate(item.timestamp)}
          </Text>
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
  )

  const getItemsByTab = () => {
    switch (activeTab) {
      case 'Scanned':
        return scannedItems.filter((item) => item.type === 'Scanned')
      case 'Dissociate':
        return scannedItems.filter((item) => item.type === 'Dissociate')
      case 'Promotions':
        return scannedItems.filter((item) => item.type === 'Promotion')
      case 'All':
      default:
        return scannedItems
    }
  }

  const renderEmptyState = () => {
    let icon = 'document-text-outline'
    let title = 'No History'
    let subtitle = 'Nothing has been scanned yet.'

    if (activeTab === 'Scanned') {
      icon = 'barcode-outline'
      title = 'No Scans'
      subtitle = 'Your scanned items will appear here.'
    } else if (activeTab === 'Dissociate') {
      icon = 'unlink-outline'
      title = 'No Dissociated Items'
      subtitle = 'Unlinked items will appear here.'
    } else if (activeTab === 'Promotions') {
      icon = 'pricetags-outline'
      title = 'No Promotions'
      subtitle = 'Promotions will appear here.'
    }

    return (
      <View className="flex-1 justify-center items-center px-8">
        <Ionicons name={icon as any} size={80} color="#6b7280" />
        <Text className="text-brand-black text-xl font-bold text-center mt-4 mb-2">
          {title}
        </Text>
        <Text className="text-gray-600 text-center">{subtitle}</Text>
      </View>
    )
  }

  const renderTabContent = () => {
    const filteredItems = getItemsByTab()

    if (filteredItems.length === 0) {
      return renderEmptyState()
    }

    return (
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    )
  }

  const activeTabItems = getItemsByTab()

  return (
    <SafeAreaView className="flex-1 bg-white p-2">
      <View className="bg-brand-white px-4 py-6 shadow-sm">
        <View className="flex-row justify-between items-center">
          <Text className="text-brand-black text-2xl font-bold">History</Text>
          {activeTab === 'All' && scannedItems.length > 0 && (
            <TouchableOpacity
              onPress={handleClearAll}
              className="bg-red-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-brand-white font-semibold">Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text className="text-gray-600 mt-1">
          {activeTabItems.length} item{activeTabItems.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <View className="h-12 bg-white">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          className="h-full"
        >
          <View className="flex-row gap-2 items-center">
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`h-10 px-4 rounded-full justify-center items-center ${
                  activeTab === tab ? 'bg-brand-black' : 'bg-gray-200'
                }`}
              >
                <Text
                  className={`${
                    activeTab === tab ? 'text-white' : 'text-gray-700'
                  } font-semibold`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className="flex-1">{renderTabContent()}</View>
    </SafeAreaView>
  )
}
