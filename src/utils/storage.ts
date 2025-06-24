import AsyncStorage from '@react-native-async-storage/async-storage'

export interface ScannedItem {
  id: string
  type: string
  data: string
  timestamp: string
}

const SCANNED_ITEMS_KEY = 'scanned_items'

export const saveScannedItem = async (item: ScannedItem): Promise<void> => {
  try {
    const existingItems = await getScannedItems()
    const updatedItems = [item, ...existingItems]
    await AsyncStorage.setItem(SCANNED_ITEMS_KEY, JSON.stringify(updatedItems))
  } catch (error) {
    console.error('Error saving scanned item:', error)
    throw error
  }
}

export const getScannedItems = async (): Promise<ScannedItem[]> => {
  try {
    const items = await AsyncStorage.getItem(SCANNED_ITEMS_KEY)
    if (items) {
      return JSON.parse(items)
    }
    return []
  } catch (error) {
    console.error('Error getting scanned items:', error)
    return []
  }
}

export const deleteScannedItem = async (id: string): Promise<void> => {
  try {
    const existingItems = await getScannedItems()
    const updatedItems = existingItems.filter((item) => item.id !== id)
    await AsyncStorage.setItem(SCANNED_ITEMS_KEY, JSON.stringify(updatedItems))
  } catch (error) {
    console.error('Error deleting scanned item:', error)
    throw error
  }
}

export const clearAllScannedItems = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SCANNED_ITEMS_KEY)
  } catch (error) {
    console.error('Error clearing scanned items:', error)
    throw error
  }
}
