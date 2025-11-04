import { NextRequest, NextResponse } from 'next/server'
import { TokenManager } from '@/lib/auth/token-manager'

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json()

    const payload = await TokenManager.verifyToken(refreshToken)

    if (payload.type !== 'refresh') {
      throw new Error('Invalid token type')
    }

    const newToken = await TokenManager.generateTokens(
      payload.userId,
      payload.email
    )

    return NextResponse.json({ token: newToken })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid refresh token' },
      { status: 401 }
    )
  }
}
