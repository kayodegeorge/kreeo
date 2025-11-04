'use client'

import { useState } from 'react'
import { useAuthStore } from '../../store/auth-store'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export function AuthPanel() {
  const [email, setEmail] = useState('designer@kreeo.me')
  const [password, setPassword] = useState('kreeo123')
  const { login, isLoading, error } = useAuthStore()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await login({ email, password })
  }

  return (
    <div className='flex items-center justify-center min-h-full p-6'>
      <div className='w-full max-w-sm'>
        <div className='text-center mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Welcome to Kreeo
          </h2>
          <p className='text-gray-600 text-sm'>
            Connect your account to start recording design insights
          </p>
        </div>

        <form onSubmit={handleLogin} className='space-y-4'>
          <Input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='designer@kreeo.me'
            required
          />

          <Input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your password'
            required
          />

          {error && (
            <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm'>
              {error}
            </div>
          )}

          <Button type='submit' disabled={isLoading} className='w-full'>
            {isLoading ? 'Connecting...' : 'Connect Account'}
          </Button>
        </form>

        <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
          <p className='text-xs text-blue-900 font-medium mb-2'>
            Demo Credentials:
          </p>
          <p className='text-xs text-blue-700'>Email: designer@kreeo.me</p>
          <p className='text-xs text-blue-700'>Password: kreeo123</p>
        </div>
      </div>
    </div>
  )
}
