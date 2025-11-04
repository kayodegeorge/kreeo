'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/auth-store'
import { LogOut, RefreshCw, Clock } from 'lucide-react'

export function SessionIndicator() {
  const { user, token, logout, forceReauthenticate, isLoading } = useAuthStore()
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    if (!token) return

    const updateTimer = () => {
      const remaining = token.expiresAt - Date.now()
      if (remaining <= 0) {
        setTimeRemaining('Expired')
      } else {
        const minutes = Math.floor(remaining / 60000)
        const seconds = Math.floor((remaining % 60000) / 1000)
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [token])

  if (!user) return null

  return (
    <div className='relative'>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className='flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-purple-700 transition-colors'
      >
        <div className='w-6 h-6 rounded-full bg-purple-400 flex items-center justify-center text-xs font-medium'>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className='text-sm hidden sm:inline'>{user.name}</span>
      </button>

      {showMenu && (
        <>
          <div
            className='fixed inset-0 z-10'
            onClick={() => setShowMenu(false)}
          />
          <div className='absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20'>
            <div className='px-4 py-2 border-b border-gray-100'>
              <p className='text-sm font-medium text-gray-900'>{user.name}</p>
              <p className='text-xs text-gray-500'>{user.email}</p>
            </div>

            <div className='px-4 py-2 border-b border-gray-100'>
              <div className='flex items-center justify-between text-xs'>
                <span className='text-gray-600 flex items-center'>
                  <Clock className='w-3 h-3 mr-1' />
                  Session expires in
                </span>
                <span
                  className={`font-mono font-medium ${
                    token && token.expiresAt - Date.now() < 2 * 60000
                      ? 'text-red-600'
                      : 'text-green-600'
                  }`}
                >
                  {timeRemaining}
                </span>
              </div>
            </div>

            <div className='py-1'>
              <button
                onClick={() => {
                  forceReauthenticate()
                  setShowMenu(false)
                }}
                disabled={isLoading}
                className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 disabled:opacity-50'
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
                />
                <span>Refresh Session</span>
              </button>

              <button
                onClick={() => {
                  logout()
                  setShowMenu(false)
                }}
                className='w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2'
              >
                <LogOut className='w-4 h-4' />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
