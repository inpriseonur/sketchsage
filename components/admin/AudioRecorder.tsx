'use client'

import { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void
  currentAudioUrl?: string | null
}

export default function AudioRecorder({ onRecordingComplete, currentAudioUrl }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [recordingMode, setRecordingMode] = useState<'upload' | 'record'>('upload')
  const [audioLevel, setAudioLevel] = useState(0)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (audioContextRef.current) audioContextRef.current.close()
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  // Audio level monitoring
  const monitorAudioLevel = (stream: MediaStream) => {
    audioContextRef.current = new AudioContext()
    analyserRef.current = audioContextRef.current.createAnalyser()
    const source = audioContextRef.current.createMediaStreamSource(stream)
    source.connect(analyserRef.current)
    analyserRef.current.fftSize = 256
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    
    const updateLevel = () => {
      if (analyserRef.current && isRecording && !isPaused) {
        analyserRef.current.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length
        setAudioLevel(Math.min(100, (average / 255) * 200))
        animationFrameRef.current = requestAnimationFrame(updateLevel)
      }
    }
    
    updateLevel()
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        
        // Create preview URL
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        
        // Cleanup
        stream.getTracks().forEach(track => track.stop())
        if (audioContextRef.current) {
          audioContextRef.current.close()
          audioContextRef.current = null
        }
      }
      
      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      // Start timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
      // Monitor audio level
      monitorAudioLevel(stream)
      
      toast.success('Kayıt başladı!')
    } catch (error) {
      console.error('Recording error:', error)
      toast.error('Mikrofon erişimi reddedildi')
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
      toast('Kayıt duraklatıldı')
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
      toast('Kayıt devam ediyor')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      setAudioLevel(0)
      
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      
      toast.success('Kayıt tamamlandı!')
    }
  }

  const discardRecording = () => {
    setAudioBlob(null)
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
    setRecordingTime(0)
  }

  const useRecording = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob)
      toast.success('Ses kaydı hazır!')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onRecordingComplete(file)
      toast.success('Ses dosyası yüklendi!')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      {/* Mode Selection */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setRecordingMode('upload')}
          className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
            recordingMode === 'upload'
              ? 'border-[#A94438] bg-[#A94438]/20 text-white'
              : 'border-slate-700 bg-[#0f1119] text-slate-400 hover:border-slate-600'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">upload_file</span>
          <p className="mt-1 text-sm font-medium">Dosya Yükle</p>
        </button>
        
        <button
          type="button"
          onClick={() => setRecordingMode('record')}
          className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
            recordingMode === 'record'
              ? 'border-[#A94438] bg-[#A94438]/20 text-white'
              : 'border-slate-700 bg-[#0f1119] text-slate-400 hover:border-slate-600'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">mic</span>
          <p className="mt-1 text-sm font-medium">Kaydet</p>
        </button>
      </div>

      {/* Current Audio Preview */}
      {currentAudioUrl && !audioBlob && (
        <div className="rounded-lg border border-slate-700 bg-[#0f1119] p-4">
          <p className="text-sm text-slate-400 mb-2">Mevcut ses dosyası:</p>
          <audio src={currentAudioUrl} controls className="w-full" />
        </div>
      )}

      {/* Upload Mode */}
      {recordingMode === 'upload' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-lg border-2 border-dashed border-slate-700 bg-[#0f1119] px-4 py-8 text-center hover:border-slate-600 hover:bg-[#161a25] transition-colors"
          >
            <span className="material-symbols-outlined text-4xl text-slate-500 mb-2">
              upload_file
            </span>
            <p className="text-sm text-slate-400">
              Ses dosyası yükleyin veya sürükleyin
            </p>
            <p className="mt-1 text-xs text-slate-600">MP3, WAV, M4A (max 50MB)</p>
          </button>
        </div>
      )}

      {/* Record Mode */}
      {recordingMode === 'record' && (
        <div className="rounded-lg border border-slate-700 bg-[#0f1119] p-6">
          {!isRecording && !audioBlob && (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#A94438]/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-[#A94438]">mic</span>
              </div>
              <p className="text-slate-300">Ses kaydı yapmaya hazır</p>
              <button
                type="button"
                onClick={startRecording}
                className="px-6 py-3 bg-[#A94438] hover:bg-[#b94848] text-white rounded-lg font-semibold transition-colors"
              >
                Kaydı Başlat
              </button>
            </div>
          )}

          {isRecording && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                  <span className="material-symbols-outlined text-4xl text-red-500">mic</span>
                </div>
                <p className="mt-4 text-2xl font-mono text-white">{formatTime(recordingTime)}</p>
                <p className="text-sm text-slate-400">
                  {isPaused ? 'Duraklatıldı' : 'Kayıt yapılıyor...'}
                </p>
              </div>

              {/* Audio Level Indicator */}
              <div className="space-y-2">
                <p className="text-xs text-slate-500 text-center">Ses seviyesi</p>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
                    style={{ width: `${audioLevel}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                {!isPaused ? (
                  <button
                    type="button"
                    onClick={pauseRecording}
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined">pause</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resumeRecording}
                    className="flex-1 px-4 py-2 bg-[#A94438] hover:bg-[#b94848] text-white rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined">play_arrow</span>
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Kaydı Durdur
                </button>
              </div>
            </div>
          )}

          {audioBlob && audioUrl && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-green-500">check_circle</span>
                </div>
                <p className="mt-4 text-slate-300 font-semibold">Kayıt tamamlandı!</p>
                <p className="text-sm text-slate-500">Süre: {formatTime(recordingTime)}</p>
              </div>

              <audio src={audioUrl} controls className="w-full" />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={discardRecording}
                  className="flex-1 px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
                >
                  Sil
                </button>
                <button
                  type="button"
                  onClick={useRecording}
                  className="flex-1 px-4 py-2 bg-[#A94438] hover:bg-[#b94848] text-white rounded-lg font-semibold transition-colors"
                >
                  Kullan
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

