export interface User {
  id: string
  email: string
  name: string
}

export interface AuthToken {
  accessToken: string
  refreshToken: string
  expiresAt: number // Unix timestamp
  issuedAt: number
}

export interface AuthState {
  user: User | null
  token: AuthToken | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}
