import { View, Text } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { Ionicons } from '@expo/vector-icons'

interface DropdownOptions {
  label: string
  value: number
}

type DropdownProps = {
  title?: string
  options: DropdownOptions[]
  value: number | null
  onSelect: (value: number | null) => void
}

export default function Dropdown({
  title,
  options,
  value,
  onSelect,
}: DropdownProps) {
  return (
    <View className="p-4">
      {title && (
        <Text className="text-lg font-semibold mb-2 text-green-800">
          {title}
        </Text>
      )}
      <RNPickerSelect
        onValueChange={(val) => onSelect(val)}
        items={options}
        disabled={options.length === 1}
        value={value}
        useNativeAndroidPickerStyle={false}
        Icon={() =>
          options.length === 1 ? null : (
            <Ionicons name="chevron-down" size={20} color="#555" />
          )
        }
        placeholder={{
          label: 'Select an option...',
          value: null,
          color: '#9CA3AF',
        }}
        style={{
          inputIOS: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderWidth: 2,
            borderColor: '#10B981',
            borderRadius: 10,
            color: '#065F46',
            backgroundColor: options.length === 1 ? '#E5E7EB' : 'white',
          },
          inputAndroid: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderWidth: 2,
            borderColor: '#10B981',
            borderRadius: 10,
            color: '#065F46',
            backgroundColor: options.length === 1 ? '#E5E7EB' : 'white',
          },
          iconContainer: {
            top: 15,
            right: 10,
          },
        }}
      />
    </View>
  )
}
