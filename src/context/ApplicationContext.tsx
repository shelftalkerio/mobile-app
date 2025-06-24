import { createContext, useContext, ReactNode } from 'react'
import { useQuery } from '@apollo/client'
import { APPLICATION_QUERY } from '../apollo/queries/application.query'

type ApplicationContextType = {
  name: string
  version: string
  loading: boolean
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(
  undefined,
)

export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
  const { data, loading } = useQuery(APPLICATION_QUERY)

  const name = data?.application?.name || 'Shelftalker'

  const version = data?.application?.version || '1.0.0'

  return (
    <ApplicationContext.Provider
      value={{
        name,
        version,
        loading,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  )
}

export const useApplication = (): ApplicationContextType => {
  const context = useContext(ApplicationContext)
  if (!context) {
    throw new Error('useApplication must be used within an ApplicationProvider')
  }
  return context
}
