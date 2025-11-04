import { SignJWT, jwtVerify } from 'jose'
import { AuthToken } from '../../types/auth-types'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'kreeo-figma-plugin-secret-key-change-in-production'
)

const TOKEN_EXPIRY = 15 * 60 * 1000 // 15 minutes
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7 days

export class TokenManager {
  static async generateTokens(
    userId: string,
    email: string
  ): Promise<AuthToken> {
    const now = Date.now()
    const expiresAt = now + TOKEN_EXPIRY

    const accessToken = await new SignJWT({ userId, email, type: 'access' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(now / 1000)
      .setExpirationTime(expiresAt / 1000)
      .sign(SECRET_KEY)

    const refreshToken = await new SignJWT({ userId, email, type: 'refresh' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(now / 1000)
      .setExpirationTime((now + REFRESH_TOKEN_EXPIRY) / 1000)
      .sign(SECRET_KEY)

    return {
      accessToken,
      refreshToken,
      expiresAt,
      issuedAt: now,
    }
  }

  static async verifyToken(token: string): Promise<any> {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY)
      return payload
    } catch (error) {
      throw new Error('Invalid or expired token')
    }
  }

  static isTokenExpired(expiresAt: number): boolean {
    return Date.now() >= expiresAt
  }

  static shouldRefresh(expiresAt: number): boolean {
    // Refresh if less than 5 minutes remaining
    const timeRemaining = expiresAt - Date.now()
    return timeRemaining < 5 * 60 * 1000
  }
}
