import { AuthToken, User } from '../../types/auth-types'

const STORAGE_KEYS = {
  TOKEN: 'kreeo_auth_token',
  USER: 'kreeo_user',
  LAST_ACTIVITY: 'kreeo_last_activity',
}

export class SessionStore {
  // storing token securely
  static saveToken(token: AuthToken): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(STORAGE_KEYS.TOKEN, JSON.stringify(token))
      this.updateLastActivity()
    } catch (error) {
      console.error('Failed to save token:', error)
    }
  }

  static getToken(): AuthToken | null {
    if (typeof window === 'undefined') return null

    try {
      const tokenStr = localStorage.getItem(STORAGE_KEYS.TOKEN)
      if (!tokenStr) return null

      const token = JSON.parse(tokenStr) as AuthToken
      return token
    } catch (error) {
      console.error('Failed to retrieve token:', error)
      return null
    }
  }

  static saveUser(user: User): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    } catch (error) {
      console.error('Failed to save user:', error)
    }
  }

  static getUser(): User | null {
    if (typeof window === 'undefined') return null

    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER)
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      console.error('Failed to retrieve user:', error)
      return null
    }
  }

  static clearSession(): void {
    if (typeof window === 'undefined') return

    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY)
  }

  static updateLastActivity(): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString())
  }

  static getLastActivity(): number {
    if (typeof window === 'undefined') return 0

    const activity = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY)
    return activity ? parseInt(activity, 10) : 0
  }
}
