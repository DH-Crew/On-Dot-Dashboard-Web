import { createContext } from 'react'

export interface AuthContextValue {
  isAuthed: boolean
  loggingIn: boolean
  login: () => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
