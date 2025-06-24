import { useState } from 'react'
import { View, Text } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { Ionicons } from '@expo/vector-icons'

export default function Dropdown() {
  const [selectedValue, setSelectedValue] = useState('')
  return (
    <View className="p-4">
      <Text className="text-lg font-semibold mb-2 text-green-800">
        Select an option
      </Text>
      <RNPickerSelect
        onValueChange={(value) => setSelectedValue(value)}
        items={[
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
        ]}
        style={{
          inputIOS: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderWidth: 2,
            borderColor: '#10B981', // Tailwind emerald-500
            borderRadius: 10,
            color: '#065F46', // Tailwind emerald-900
            backgroundColor: 'white',
          },
          inputAndroid: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderWidth: 2,
            borderColor: '#10B981',
            borderRadius: 10,
            color: '#065F46',
            backgroundColor: 'white',
          },
          iconContainer: {
            top: 15,
            right: 10,
          },
        }}
        value={selectedValue}
        useNativeAndroidPickerStyle={false}
        Icon={() => <Ionicons name="chevron-down" size={20} color="#555" />}
        placeholder={{
          label: 'Select an option...',
          value: null,
          color: '#9CA3AF', // Tailwind gray-400
        }}
      />
    </View>
  )
}
