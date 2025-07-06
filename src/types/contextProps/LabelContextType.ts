import { Label } from '@/types/app/label'
import { ApolloError } from '@apollo/client'

export interface LabelContextType {
  getLabel: (id: number) => void
  label: Label | null
  setLabel: (label: Label) => void
  clearLabel: () => void
  loading: boolean
  error?: ApolloError
}
