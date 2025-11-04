import { create } from 'zustand'
import {
  SpeechState,
  RecordingState,
  Transcription,
} from '../types/speech-types'
import { SpeechRecognitionService } from '@/lib/speech/speech-recognition'

interface SpeechActions {
  startRecording: () => void
  stopRecording: () => void
  saveTranscription: () => void
  clearTranscript: () => void
  loadSavedTranscriptions: () => void
  deleteTranscription: (id: string) => void
  clearAllTranscriptions: () => void
}

const STORAGE_KEY = 'kreeo_transcriptions'

export const useSpeechStore = create<SpeechState & SpeechActions>(
  (set, get) => {
    const speechService = new SpeechRecognitionService()

    return {
      state: 'idle',
      transcript: '',
      interimTranscript: '',
      error: null,
      isSupported: speechService.isAvailable(),
      savedTranscriptions: [],

      startRecording: () => {
        if (!speechService.isAvailable()) {
          set({
            error: 'Speech recognition not supported in this browser',
            state: 'error',
          })
          return
        }

        set({
          state: 'listening',
          error: null,
          transcript: '',
          interimTranscript: '',
        })

        speechService.start(
          (transcript, isFinal) => {
            if (isFinal) {
              const currentTranscript = get().transcript
              set({
                transcript: currentTranscript + ' ' + transcript,
                interimTranscript: '',
              })
            } else {
              set({ interimTranscript: transcript })
            }
          },
          (error) => {
            set({ error, state: 'error' })
          },
          () => {
            const currentState = get().state
            if (currentState === 'listening') {
              set({ state: 'completed' })
            }
          }
        )
      },

      stopRecording: () => {
        speechService.stop()
        set({ state: 'completed', interimTranscript: '' })
      },

      saveTranscription: () => {
        const { transcript, savedTranscriptions } = get()
        if (!transcript.trim()) return

        const newTranscription: Transcription = {
          id: Date.now().toString(),
          text: transcript.trim(),
          timestamp: Date.now(),
        }

        const updated = [newTranscription, ...savedTranscriptions]

        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        }

        set({
          savedTranscriptions: updated,
          transcript: '',
          interimTranscript: '',
          state: 'idle',
        })
      },

      deleteTranscription: (id: string) => {
        const { savedTranscriptions } = get()
        const updated = savedTranscriptions.filter((t) => t.id !== id)
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        }
        set({ savedTranscriptions: updated })
      },

      clearAllTranscriptions: () => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
        }
        set({ savedTranscriptions: [] })
      },

      clearTranscript: () => {
        set({
          transcript: '',
          interimTranscript: '',
          state: 'idle',
          error: null,
        })
      },

      loadSavedTranscriptions: () => {
        if (typeof window === 'undefined') return

        try {
          const saved = localStorage.getItem(STORAGE_KEY)
          if (saved) {
            set({ savedTranscriptions: JSON.parse(saved) })
          }
        } catch (error) {
          console.error('Failed to load transcriptions:', error)
        }
      },
    }
  }
)
