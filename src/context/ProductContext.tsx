import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Product } from '@/types/app/product'
import { useLazyQuery } from '@apollo/client'
import { GET_PRODUCT } from '@/apollo/queries/app/product.query'
import { ProductContextType } from '@/types/contextProps/ProductContextType'

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [Product, setProductState] = useState<Product | null>(null)

  const [fetchProduct, { loading, error, data }] = useLazyQuery(GET_PRODUCT, {
    onCompleted: (data) => {
      setProductState(data.Product)
    },
  })

  // getProduct now returns a Promise so you can await it
  const getProduct = async (
    id?: number,
    sku?: string,
    company_id?: number,
  ): Promise<Product | null> => {
    try {
      const result = await fetchProduct({ variables: { id } })
      const fetchedProduct = result?.data?.product ?? null
      setProductState(fetchedProduct[0])
      return fetchedProduct[0]
    } catch (error) {
      console.error('Failed to fetch Product', error)
      return null
    }
  }

  const clearProduct = () => setProductState(null)

  return (
    <ProductContext.Provider
      value={{
        getProduct,
        Product,
        setProduct: setProductState,
        clearProduct,
        loading,
        error,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProductContext = (): ProductContextType => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider')
  }
  return context
}
