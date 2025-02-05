import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth'
import { auth } from '../config/firebase'
import toast from 'react-hot-toast'
import loginImg from '../assets/Images/loginImg.png'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isRegistering } = useAuth()

  // If user is registering, don't show login page
  useEffect(() => {
    if (isRegistering) {
      navigate('/dashboard', { replace: true })
    }
  }, [isRegistering, navigate])

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState({ google: false, facebook: false })
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const handleSuccessfulLogin = useCallback(async (user) => {
    try {
      const token = await user.getIdToken()
      localStorage.setItem('authToken', token)
      sessionStorage.setItem('authToken', token)
      toast.success('Successfully logged in!')
    } catch (error) {
      console.error('Token error:', error)
      toast.error('Authentication failed')
    }
  }, [])

  const handleSocialLogin = async (provider) => {
    if (loading) return
    setLoading(true)

    try {
      const authProvider = provider === 'google' ? new GoogleAuthProvider() : new FacebookAuthProvider()
      await signInWithPopup(auth, authProvider)
      toast.success('Successfully logged in!')
    } catch (error) {
      console.error('Social login error:', error)
      let errorMessage = 'Login failed'

      switch (error.code) {
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'An account already exists with this email'
          break
        case 'auth/popup-blocked':
          errorMessage = 'Login popup was blocked. Please allow popups and try again'
          break
        case 'auth/popup-closed-by-user':
          errorMessage = 'Login was cancelled'
          break
        default:
          errorMessage = error.message
      }

      toast.error(errorMessage)
      localStorage.removeItem('authToken')
      sessionStorage.removeItem('authToken')
    } finally {
      setLoading(false)
    }
  }

  // Handle redirect result
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result?.user) {
          // First navigate to dashboard
          const intendedPath = sessionStorage.getItem('authRedirectPath') || '/dashboard'
          navigate(intendedPath, { replace: true })

          // Then handle token storage and cleanup
          const token = await result.user.getIdToken()
          localStorage.setItem('authToken', token)
          sessionStorage.setItem('authToken', token)
          sessionStorage.removeItem('authRedirectPath')
          sessionStorage.removeItem('authProvider')

          toast.success('Successfully logged in!')
        }
      } catch (error) {
        console.error('Redirect result error:', error)
        toast.error('Login failed. Please try again.')
        localStorage.removeItem('authToken')
        sessionStorage.removeItem('authToken')
      }
    }

    handleRedirectResult()
  }, [navigate])

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { email, password } = formData
      await signInWithEmailAndPassword(auth, email, password)
      toast.success('Successfully logged in!')
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.message)
      localStorage.removeItem('authToken')
      sessionStorage.removeItem('authToken')
    } finally {
      setLoading(false)
    }
  }

  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center auth-pattern-bg px-4 py-12">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-6 md:p-12">
          <div className="max-w-md w-full mx-auto space-y-8">
            <div>
              <h2 className="mt-6 text-2xl md:text-3xl font-bold text-gray-900">Sign In</h2>
            </div>
            <form onSubmit={handleEmailLogin} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    disabled={loading || isAuthenticating}
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF5C5C] focus:border-[#FF5C5C] sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    disabled={loading || isAuthenticating}
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF5C5C] focus:border-[#FF5C5C] sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#FF5C5C] focus:ring-[#FF5C5C] border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                    Remember Me
                  </label>
                </div>
                <div className="text-sm">
                  <Link 
                    to="/forgot-password"
                    className="font-medium text-[#FF5C5C] hover:text-[#ff3c3c]"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || isAuthenticating}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF5C5C] hover:bg-[#ff3c3c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5C5C] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading || isAuthenticating ? 'Signing in...' : 'Sign in'}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or Login with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={loading || socialLoading.facebook || isAuthenticating}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-[#1877F2] text-white text-sm font-medium hover:bg-[#1666d4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1877F2] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {socialLoading.facebook || isAuthenticating ? (
                    <span>Signing in...</span>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                      Facebook
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading || socialLoading.google || isAuthenticating}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5C5C] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {socialLoading.google || isAuthenticating ? (
                    <span>Signing in...</span>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#4285f4" />
                      </svg>
                      Google
                    </>
                  )}
                </button>
              </div>

              <div className="text-center text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <Link to="/register" className="font-medium text-[#FF5C5C] hover:text-[#ff3c3c]">
                  Create One
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:flex w-full md:w-1/2 bg-pink-50 items-center justify-center p-12">
          <img
            src={loginImg}
            alt="Login illustration"
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  )
}

export default Login 