import { gql } from '@apollo/client'
import { LABEL_FRAGMENT } from '@/apollo/fragments/label.fragment'
export const GET_LABEL = gql`
  ${LABEL_FRAGMENT}
  query getLabel($id: ID, $label_code: String, $store_id: Int) {
    label(id: $id, label_code: $label_code, store_id: $store_id) {
      ...LabelFragment
    }
  }
`
export const GET_LABELS = gql`
  ${LABEL_FRAGMENT}
  query getLabels {
    labels {
      ...LabelFragment
    }
  }
`
