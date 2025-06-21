import { User } from '../User'
export interface AuthContextProps {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<boolean>
  logout: () => Promise<void>
  resetPassword?: (email: string) => Promise<string>
}
