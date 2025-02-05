import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { auth } from '../config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(sessionStorage.getItem('authToken'))
  const [isRegistering, setIsRegistering] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // First set the user and navigate immediately
          setCurrentUser(user)
          if (window.location.pathname === '/login' || window.location.pathname === '/register') {
            navigate('/dashboard', { replace: true })
          }

          // Then handle token and data storage
          const token = await user.getIdToken()
          setToken(token)
          sessionStorage.setItem('authToken', token)
          await storeUserData(user)
        } else {
          setToken(null)
          setCurrentUser(null)
          sessionStorage.removeItem('authToken')
          
          // Only redirect to login if not on a public route
          const publicRoutes = ['/login', '/register', '/forgot-password']
          if (!publicRoutes.includes(window.location.pathname)) {
            navigate('/login', { replace: true })
          }
        }
      } catch (error) {
        console.error('Auth state change error:', error)
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [navigate])

  // Store user data in Firestore
  const storeUserData = async (user) => {
    if (!user) return
    
    const userRef = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userRef)
    
    if (!userSnap.exists()) {
      try {
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        })
        setIsRegistering(true) // Set registering flag for new users
        navigate('/dashboard', { replace: true })
      } catch (error) {
        console.error('Error storing user data:', error)
      }
    } else {
      // Update last login
      await setDoc(userRef, { lastLogin: new Date().toISOString() }, { merge: true })
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      sessionStorage.removeItem('authToken')
      setCurrentUser(null)
      setToken(null)
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    currentUser,
    token,
    loading,
    logout,
    isRegistering,
    setIsRegistering
  }), [currentUser, token, loading, logout, isRegistering])

  // Show loading screen while initializing auth
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#FF5C5C] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Initializing...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext 