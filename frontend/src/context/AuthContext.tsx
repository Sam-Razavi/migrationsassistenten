import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface AuthUser {
  id: number
  email: string
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  login: (token: string, user: AuthUser) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
})

const TOKEN_KEY = 'migration_jwt'
const USER_KEY = 'migration_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = useCallback((newToken: string, newUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
