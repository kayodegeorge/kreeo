'use client'

import { useEffect } from 'react'
import { useAuthStore } from '../../store/auth-store'
import { AuthPanel } from './auth-panel'
import { VoiceRecorder } from './voice-recorder'
import { SessionIndicator } from './session-indicator'

export function PluginContainer() {
  const { isAuthenticated, isLoading, checkSession } = useAuthStore()

  useEffect(() => {
    checkSession()
  }, [checkSession])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading Kreeo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='h-screen flex flex-col bg-white'>
      {/* Plugin Header */}
      <div className='bg-purple-600 text-white px-4 py-3 flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <div className='w-8 h-8 bg-white rounded-md flex items-center justify-center'>
            <span className='text-purple-600 font-bold text-lg'>K</span>
          </div>
          <span className='font-semibold'>Kreeo Plugin</span>
        </div>
        <SessionIndicator />
      </div>

      {/* Main Content */}
      <div className='flex-1 overflow-y-auto'>
        {isAuthenticated ? <VoiceRecorder /> : <AuthPanel />}
      </div>
    </div>
  )
}
