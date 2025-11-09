'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import Image from 'next/image'

type UploadStep = 'upload' | 'preview' | 'submitting' | 'success'

interface UploadedFile {
  file: File
  preview: string
  storagePath: string | null
}

export default function NewReviewModal({
  isOpen,
  onClose,
  userCredits,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  userCredits: number
  onSuccess?: () => void
}) {
  const [step, setStep] = useState<UploadStep>('upload')
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  
  // Form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  
  // File size limits from settings
  const [maxImageSizeMB, setMaxImageSizeMB] = useState(3)
  const [maxVideoSizeMB, setMaxVideoSizeMB] = useState(30)
  
  // Fresh credits from server (to prevent stale data)
  const [currentCredits, setCurrentCredits] = useState(userCredits)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isSubmittingRef = useRef(false)
  const supabase = createClient()

  // Fetch file size limits and fresh credits on mount
  useEffect(() => {
    const fetchSettings = async () => {
      // Fetch system settings
      const { data: settings } = await supabase
        .from('system_settings')
        .select('key, value')
        .in('key', ['max_image_size_mb', 'max_video_size_mb'])
      
      if (settings) {
        settings.forEach((setting) => {
          if (setting.key === 'max_image_size_mb') {
            setMaxImageSizeMB(Number(setting.value))
          } else if (setting.key === 'max_video_size_mb') {
            setMaxVideoSizeMB(Number(setting.value))
          }
        })
      }

      // Fetch fresh credits from server
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('users_profile')
          .select('credits')
          .eq('id', user.id)
          .single()
        
        if (profile) {
          setCurrentCredits(profile.credits)
          console.log('Fresh credits from DB:', profile.credits)
          if (profile.credits !== userCredits) {
            console.warn(`Credits mismatch! Props: ${userCredits}, DB: ${profile.credits}`)
            toast.info(`Your actual credit balance is ${profile.credits}`)
          }
        }
      }
    }
    
    if (isOpen) {
      fetchSettings()
    }
  }, [isOpen, supabase, userCredits])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('upload')
      setUploadedFile(null)
      setTitle('')
      setDescription('')
      setIsDragging(false)
      setIsUploading(false)
      isSubmittingRef.current = false
    }
  }, [isOpen])

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isUploading && step !== 'submitting') {
        handleCancel()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, isUploading, step])

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    
    if (!isImage && !isVideo) {
      return { valid: false, error: 'Please upload an image or video file.' }
    }
    
    const sizeMB = file.size / (1024 * 1024)
    const maxSize = isImage ? maxImageSizeMB : maxVideoSizeMB
    
    if (sizeMB > maxSize) {
      return {
        valid: false,
        error: `${isImage ? 'Image' : 'Video'} size exceeds ${maxSize}MB limit. Your file is ${sizeMB.toFixed(1)}MB.`
      }
    }
    
    return { valid: true }
  }

  const uploadToStorage = async (file: File): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('You must be logged in to upload files')
        return null
      }

      const isImage = file.type.startsWith('image/')
      const folder = isImage ? 'images' : 'videos'
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${user.id}/${folder}/${fileName}`

      const { error } = await supabase.storage
        .from('user')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Storage upload error:', error)
        toast.error('Failed to upload file: ' + error.message)
        return null
      }

      return filePath
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('An error occurred during upload')
      return null
    }
  }

  const handleFileSelect = async (file: File) => {
    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      toast.error(validation.error!)
      return
    }

    // Create preview URL
    const preview = URL.createObjectURL(file)
    
    setIsUploading(true)
    
    // Upload to storage
    const storagePath = await uploadToStorage(file)
    
    setIsUploading(false)
    
    if (storagePath) {
      setUploadedFile({
        file,
        preview,
        storagePath
      })
      setStep('preview')
      toast.success('File uploaded successfully!')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleSubmit = async () => {
    // Prevent double submission
    if (isSubmittingRef.current) {
      console.log('Already submitting, ignoring duplicate call')
      return
    }

    if (!uploadedFile || !title.trim()) {
      toast.error('Please provide a title for your submission')
      return
    }

    if (currentCredits < 1) {
      toast.error('Insufficient credits')
      return
    }

    // Set flag immediately to prevent double submission
    isSubmittingRef.current = true
    setStep('submitting')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('user')
        .getPublicUrl(uploadedFile.storagePath!)

      const mediaType = uploadedFile.file.type.startsWith('image/') ? 'image' : 'video'

      // Insert evaluation
      // Format: "TITLE: {title}\n\nDESCRIPTION: {description}"
      const formattedMessage = `TITLE: ${title}\n\nDESCRIPTION: ${description}`
      
      const { data: evaluation, error: evalError } = await supabase
        .from('evaluations')
        .insert({
          user_id: user.id,
          media_url: urlData.publicUrl,
          media_type: mediaType,
          user_message: formattedMessage,
          status: 'pending',
          feedback_type: null
        })
        .select()
        .single()

      if (evalError) {
        throw evalError
      }

      // Decrease user credits
      console.log('Calling decrease_credit RPC at:', new Date().toISOString())
      const { data: creditResult, error: creditError } = await supabase
        .rpc('decrease_credit', { user_uuid: user.id })

      console.log('RPC result:', creditResult, 'at:', new Date().toISOString())
      
      if (creditError) {
        console.error('RPC error:', creditError)
        throw new Error('Database error: ' + creditError.message)
      }
      
      if (!creditResult?.success) {
        console.error('RPC failed:', creditResult)
        throw new Error(creditResult?.error || 'Failed to decrease credits')
      }
      
      console.log('Credits after decrease:', creditResult.credits)

      setStep('success')
      toast.success('Review submitted successfully!')

      // Call success callback after a short delay
      setTimeout(() => {
        onSuccess?.()
        handleClose()
      }, 2000)
    } catch (error: any) {
      console.error('Submission error:', error)
      toast.error(error.message || 'Failed to submit review')
      setStep('preview')
      isSubmittingRef.current = false // Reset flag on error
    }
  }

  const handleCancel = async () => {
    // If file was uploaded, delete it from storage
    if (uploadedFile?.storagePath && step !== 'success') {
      try {
        await supabase.storage
          .from('user')
          .remove([uploadedFile.storagePath])
      } catch (error) {
        console.error('Error deleting file:', error)
      }
    }

    // Clean up preview URL
    if (uploadedFile?.preview) {
      URL.revokeObjectURL(uploadedFile.preview)
    }

    onClose()
  }

  const handleClose = () => {
    if (uploadedFile?.preview) {
      URL.revokeObjectURL(uploadedFile.preview)
    }
    onClose()
  }

  if (!isOpen) return null

  // Check credits (use fresh credits from DB)
  if (currentCredits < 1) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="relative bg-[#1a1d2e] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 mx-auto">
              <span className="material-symbols-outlined text-4xl text-red-400">error</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Insufficient Credits</h2>
              <p className="text-white/60">
                You need at least 1 credit to submit a review. Please purchase more credits to continue.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-[#A94438] to-[#9F2241] text-white font-semibold rounded-lg hover:brightness-110 transition-all"
            >
              Buy Credits
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={step !== 'submitting' ? handleCancel : undefined}
    >
      <div
        className="relative bg-[#1a1d2e] border border-white/10 rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {step !== 'submitting' && (
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Upload Step */}
        {step === 'upload' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Upload Your Artwork</h2>
              <p className="text-white/60">
                Credits remaining: <span className="font-bold text-[#E29D83]">{currentCredits}</span>
              </p>
            </div>

            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                isDragging
                  ? 'border-[#A94438] bg-[#A94438]/10'
                  : 'border-white/20 hover:border-white/40'
              }`}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={isUploading}
              />
              
              {isUploading ? (
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#A94438] mx-auto"></div>
                  <p className="text-white/60">Uploading...</p>
                </div>
              ) : (
                <>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#A94438]/20 mb-4">
                    <span className="material-symbols-outlined text-3xl text-[#E29D83]">upload_file</span>
                  </div>
                  <p className="text-white mb-2 font-medium">
                    Drag & drop your file here, or click to browse
                  </p>
                  <p className="text-white/40 text-sm mb-4">
                    Images up to {maxImageSizeMB}MB • Videos up to {maxVideoSizeMB}MB
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2 bg-[#A94438] text-white rounded-lg hover:bg-[#9F2241] transition-colors"
                  >
                    Choose File
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Preview Step */}
        {step === 'preview' && uploadedFile && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Review Details</h2>
              <p className="text-white/60">Add information about your submission</p>
            </div>

            {/* File Preview */}
            <div className="relative rounded-xl overflow-hidden bg-black/40">
              {uploadedFile.file.type.startsWith('image/') ? (
                <Image
                  src={uploadedFile.preview}
                  alt="Preview"
                  width={800}
                  height={600}
                  className="w-full h-auto max-h-96 object-contain"
                />
              ) : (
                <video
                  src={uploadedFile.preview}
                  controls
                  className="w-full h-auto max-h-96"
                />
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                  placeholder="e.g., Portrait Study in Charcoal"
                  maxLength={100}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-[#A94438] focus:outline-none"
                />
                <p className="text-white/40 text-xs mt-1">
                  {title.length}/100 characters
                </p>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 300))}
                  placeholder="What would you like feedback on? What are you trying to achieve with this piece?"
                  maxLength={300}
                  rows={4}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-[#A94438] focus:outline-none resize-none"
                />
                <p className="text-white/40 text-xs mt-1">
                  {description.length}/300 characters
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={step === 'submitting'}
                className="flex-1 py-3 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!title.trim() || !description.trim() || step === 'submitting'}
                className="flex-1 py-3 bg-gradient-to-r from-[#A94438] to-[#9F2241] text-white font-semibold rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Review (1 Credit)
              </button>
            </div>
          </div>
        )}

        {/* Submitting Step */}
        {step === 'submitting' && (
          <div className="text-center space-y-6 py-12">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-[#A94438] mx-auto"></div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Submitting...</h2>
              <p className="text-white/60">Please wait while we process your submission</p>
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="text-center space-y-6 py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mx-auto">
              <span className="material-symbols-outlined text-4xl text-green-400">check_circle</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
              <p className="text-white/60">
                Your artwork has been submitted for review. You'll be notified when feedback is ready.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
