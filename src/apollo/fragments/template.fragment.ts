import { gql } from '@apollo/client'
import { COMPANY_FRAGMENT } from './company.fragment'

export const TEMPLATE_FRAGMENT = gql`
  ${COMPANY_FRAGMENT}
  fragment TemplateFragment on Template {
    id
    name
    key
    description
    render_engine
    render_path
    preview_image
    reference_width
    reference_height
    responsive
    scaling_mode
    company {
      ...CompanyFragment
    }
    is_global
    is_active
    is_locked
    rules {
      min_height
      min_width
    }
    field_map {
      product_name
      price
    }
    version
    updated_by
    created_at
    updated_at
  }
`
