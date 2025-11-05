'use client'

import { useEffect } from 'react'
import { useSpeechStore } from '../../store/speech-store'
import { Mic, MicOff, Save, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { format } from 'date-fns'

export function VoiceRecorder() {
  const {
    state,
    transcript,
    interimTranscript,
    error,
    isSupported,
    savedTranscriptions,
    startRecording,
    stopRecording,
    saveTranscription,
    clearTranscript,
    loadSavedTranscriptions,
    deleteTranscription,
    clearAllTranscriptions,
  } = useSpeechStore()

  useEffect(() => {
    loadSavedTranscriptions()
  }, [loadSavedTranscriptions])

  const isRecording = state === 'listening'
  const hasTranscript = transcript.trim().length > 0

  const getStateMessage = () => {
    switch (state) {
      case 'idle':
        return 'Ready to record'
      case 'listening':
        return 'Listening...'
      case 'processing':
        return 'Processing...'
      case 'completed':
        return 'Recording completed'
      case 'error':
        return error || 'An error occurred'
      default:
        return ''
    }
  }

  if (!isSupported) {
    return (
      <div className='p-6'>
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
          <p className='text-yellow-800 font-medium'>
            Speech recognition not supported
          </p>
          <p className='text-yellow-700 text-sm mt-1'>
            Please use Chrome, Edge, or Safari to use voice recording.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='p-6 space-y-6'>

      <div className='bg-gray-50 rounded-lg p-6'>
        <div className='flex flex-col items-center'>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isRecording ? (
              <MicOff className='w-10 h-10 text-white' />
            ) : (
              <Mic className='w-10 h-10 text-white' />
            )}
          </button>

          <p
            className={`mt-4 text-sm font-medium ${
              state === 'error' ? 'text-red-600' : 'text-gray-700'
            }`}
          >
            {getStateMessage()}
          </p>
        </div>
      </div>

    
      {(transcript || interimTranscript) && (
        <div className='border border-gray-200 rounded-lg p-4'>
          <h3 className='text-sm font-medium text-gray-700 mb-2'>Transcript</h3>
          <div className='min-h-[100px] text-gray-900'>
            {transcript}
            {interimTranscript && (
              <span className='text-gray-400 italic'> {interimTranscript}</span>
            )}
          </div>

          <div className='flex space-x-2 mt-4'>
            <Button
              onClick={saveTranscription}
              disabled={!hasTranscript}
              size='sm'
              className='flex items-center space-x-2'
            >
              <Save className='w-4 h-4' />
              <span>Save</span>
            </Button>
            <Button
              onClick={clearTranscript}
              disabled={!hasTranscript}
              variant='secondary'
              size='sm'
              className='flex items-center space-x-2'
            >
              <Trash2 className='w-4 h-4' />
              <span>Clear</span>
            </Button>
          </div>
        </div>
      )}

      {/* Saved Transcriptions */}
      {savedTranscriptions.length > 0 && (
        <div>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-sm font-semibold text-gray-900'>
              Saved Recordings ({savedTranscriptions.length})
            </h3>
            <Button
              variant='secondary'
              size='sm'
              onClick={clearAllTranscriptions}
            >
              <Trash2 className='w-4 h-4 mr-1' />
              Clear All
            </Button>
          </div>
          <div
            className={`space-y-3 ${
              savedTranscriptions.length > 5
                ? 'max-h-64 overflow-y-auto pr-1'
                : ''
            }`}
          >
            {savedTranscriptions.map((transcription) => (
              <div
                key={transcription.id}
                className='border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors'
              >
                <div className='flex items-start justify-between gap-3'>
                  <div className='min-w-0'>
                    <p className='text-sm text-gray-900 mb-2 wrap-break-word'>
                      {transcription.text}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {format(transcription.timestamp, 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => deleteTranscription(transcription.id)}
                    aria-label='Delete recording'
                  >
                    <Trash2 className='w-4 h-4 text-gray-500' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
