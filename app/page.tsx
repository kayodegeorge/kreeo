import { PluginContainer } from '@/components/plugin/plugin-container'
import Image from 'next/image'

export default function Home() {
  return (
    <main className='min-h-screen from-gray-100 via-gray-50 to-purple-50'>
      <div className='container mx-auto px-4 py-8 max-w-md'>
        <div
          className='bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200'
          style={{ height: '90vh', maxHeight: '800px', minHeight: '600px' }}
        >
          <PluginContainer />
        </div>

        <div className='mt-4 text-center'>
          <p className='text-xs text-gray-500'>
            Simulated Figma Plugin Environment
          </p>
        </div>
      </div>
    </main>
  )
}
