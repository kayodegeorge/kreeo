export type RecordingState =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'completed'
  | 'error'

export interface Transcription {
  id: string
  text: string
  timestamp: number
  confidence?: number
}

export interface SpeechState {
  state: RecordingState
  transcript: string
  interimTranscript: string
  error: string | null
  isSupported: boolean
  savedTranscriptions: Transcription[]
}
