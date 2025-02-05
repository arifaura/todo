import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../config/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('Password reset email sent! Please check your inbox.')
      setEmail('')
    } catch (error) {
      console.error('Password reset error:', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center auth-pattern-bg px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF5C5C] focus:border-[#FF5C5C] sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF5C5C] hover:bg-[#ff3c3c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5C5C] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="text-sm text-center">
            <Link 
              to="/login"
              className="font-medium text-[#FF5C5C] hover:text-[#ff3c3c]"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword  
