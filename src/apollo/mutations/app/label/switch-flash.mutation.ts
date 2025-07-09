import { gql } from '@apollo/client'
import { MESSAGE_FRAGMENT } from '@/apollo/fragments/message.fragment'
export const SWITCH_FLASH = gql`
  ${MESSAGE_FRAGMENT}
  mutation SwitchOnFlash($id: Int) {
    switchFlash(id: $id) {
      ...MessageFragment
    }
  }
`
