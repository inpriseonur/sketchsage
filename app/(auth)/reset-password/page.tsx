'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Şifreler eşleşmiyor')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalıdır')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      })

      if (error) throw error

      toast.success('Şifreniz başarıyla değiştirildi!')
      router.push('/auth/login')
    } catch (error: any) {
      toast.error(error.message || 'Şifre değiştirilirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Başlık */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">
          Reset Your Password
        </h1>
        <p className="text-gray-400 text-lg">
          Enter your new password below.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            New Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Enter new password"
            className="w-full px-4 py-3 bg-[#252837] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="Confirm new password"
            className="w-full px-4 py-3 bg-[#252837] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500"
          />
        </div>

        {/* Password Requirements */}
        <div className="text-sm text-gray-400 space-y-1">
          <p className="font-medium">Password must:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li className={formData.password.length >= 6 ? 'text-green-500' : ''}>
              Be at least 6 characters long
            </li>
            <li className={formData.password === formData.confirmPassword && formData.password !== '' ? 'text-green-500' : ''}>
              Match in both fields
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
        >
          {loading ? 'Resetting Password...' : 'Reset Password'}
        </button>
      </form>
    </div>
  )
}

