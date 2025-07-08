import { Label } from '@/types/app/label'
import { ApolloError } from '@apollo/client'

export interface LabelContextType {
  label: Label | null
  labelLoading: boolean
  labelError?: ApolloError
  disassociateLoading: boolean
  disassociateError?: ApolloError
  getLabel: (id: number) => Promise<Label[] | null>
  getLabels: (id: number) => Promise<Label[] | null>
  setLabel: (label: Label) => void
  disassociateLabel: (type: 'LABEL' | 'PRODUCT', id: number) => Promise<void>
  clearLabel: () => void
}
