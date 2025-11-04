import { NextRequest, NextResponse } from 'next/server'
import { TokenManager } from '@/lib/auth/token-manager'

// Mock user database for demonstration
const MOCK_USERS = [
  {
    id: '1',
    email: 'designer@kreeo.me',
    password: 'kreeo123',
    name: 'AJ Mensah',
  },
  {
    id: '2',
    email: 'dev@kreeo.me',
    password: 'test123',
    name: 'Kayode George',
  },
  {
    id: '3',
    email: 'demo@kreeo.me',
    password: 'demo123',
    name: 'Joshua Acheampong',
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Simulate network delay (realistic auth)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock authentication
    const user = MOCK_USERS.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate tokens
    const token = await TokenManager.generateTokens(user.id, user.email)

    // Return user data and tokens (excluding password)
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
