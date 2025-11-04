export class SpeechRecognitionService {
  private recognition: any = null
  private isSupported: boolean = false

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition()
        this.isSupported = true
        this.setupRecognition()
      }
    }
  }

  private setupRecognition() {
    if (!this.recognition) return

    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = 'en-US'
  }

  isAvailable(): boolean {
    return this.isSupported
  }

  start(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError('Speech recognition not supported')
      return
    }

    this.recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript) {
        onResult(finalTranscript.trim(), true)
      } else {
        onResult(interimTranscript, false)
      }
    }

    this.recognition.onerror = (event: any) => {
      onError(event.error)
    }

    this.recognition.onend = () => {
      onEnd()
    }

    try {
      this.recognition.start()
    } catch (error: any) {
      onError(error.message)
    }
  }

  stop() {
    if (this.recognition) {
      this.recognition.stop()
    }
  }

  abort() {
    if (this.recognition) {
      this.recognition.abort()
    }
  }
}
