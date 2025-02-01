import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { auth } from '../config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import toast from 'react-hot-toast'

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
      } catch (error) {
        console.error('Error storing user data:', error)
      }
    } else {
      // Update last login
      await setDoc(userRef, { lastLogin: new Date().toISOString() }, { merge: true })
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get the JWT token
        const token = await user.getIdToken()
        setToken(token)
        sessionStorage.setItem('authToken', token)
        
        // Store user data in Firestore
        await storeUserData(user)
        setCurrentUser(user)
      } else {
        setToken(null)
        setCurrentUser(null)
        sessionStorage.removeItem('authToken')
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const logout = async () => {
    try {
      await signOut(auth)
      sessionStorage.removeItem('authToken')
      setCurrentUser(null)
      setToken(null)
      toast.success('Logged out successfully')
      // Navigation will be handled by the component that calls logout
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
    logout
  }), [currentUser, token, loading, logout])

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