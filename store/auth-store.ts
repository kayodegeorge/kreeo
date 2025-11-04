import { create } from 'zustand'
import {
  AuthState,
  User,
  AuthToken,
  LoginCredentials,
} from '@/types/auth-types'
import { SessionStore } from '@/lib/auth/session-store'
import { TokenManager } from '@/lib/auth/token-manager'

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  checkSession: () => Promise<void>
  forceReauthenticate: () => Promise<void>
  startRefreshTimer: () => void
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null })

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Login failed')
      }

      const data = await response.json()

      SessionStore.saveToken(data.token)
      SessionStore.saveUser(data.user)

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })

      // Start token refresh timer
      get().startRefreshTimer()
    } catch (error: any) {
      set({
        error: error.message || 'Authentication failed',
        isLoading: false,
        isAuthenticated: false,
      })
      throw error
    }
  },

  logout: () => {
    SessionStore.clearSession()
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
    })
  },

  refreshToken: async () => {
    const currentToken = get().token
    if (!currentToken?.refreshToken) {
      get().logout()
      return
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: currentToken.refreshToken }),
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const data = await response.json()

      SessionStore.saveToken(data.token)

      set({
        token: data.token,
      })

      // Restart refresh timer with new token
      get().startRefreshTimer()
    } catch (error) {
      console.error('Token refresh failed:', error)
      get().logout()
    }
  },

  checkSession: async () => {
    set({ isLoading: true })

    const token = SessionStore.getToken()
    const user = SessionStore.getUser()

    if (!token || !user) {
      set({ isLoading: false, isAuthenticated: false })
      return
    }

    // Check if token is expired
    if (TokenManager.isTokenExpired(token.expiresAt)) {
      console.log('Token expired, attempting refresh...')
      try {
        await get().refreshToken()
        set({ isLoading: false })
      } catch (error) {
        set({ isLoading: false, isAuthenticated: false })
      }
      return
    }

    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    })

    // Check if token should be refreshed proactively
    if (TokenManager.shouldRefresh(token.expiresAt)) {
      console.log('Token near expiry, refreshing proactively...')
      get().refreshToken()
    } else {
      // Start refresh timer
      get().startRefreshTimer()
    }
  },

  forceReauthenticate: async () => {
    const currentUser = get().user
    if (!currentUser) return

    set({ isLoading: true, error: null })

    try {
      await get().refreshToken()
      set({ isLoading: false })
    } catch (error) {
      get().logout()
    }
  },

  // Helper method to start automatic refresh
  startRefreshTimer: () => {
    const token = get().token
    if (!token) return

    // Calculate time until we should refresh (5 minutes before expiry)
    const timeUntilRefresh = Math.max(
      0,
      token.expiresAt - Date.now() - 5 * 60 * 1000
    )

    console.log(
      `Refresh timer set for ${Math.round(timeUntilRefresh / 1000)}s from now`
    )

    setTimeout(() => {
      const currentState = get()
      if (currentState.isAuthenticated && currentState.token) {
        console.log('Auto-refreshing token...')
        get().refreshToken()
      }
    }, timeUntilRefresh)
  },
}))
