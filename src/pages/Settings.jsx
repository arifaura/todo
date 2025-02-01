import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import toast from 'react-hot-toast'

const Settings = () => {
  const { currentUser } = useAuth()
  
  // Profile States
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '')
  const [saving, setSaving] = useState(false)
  
  // Password States
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  
  // Preferences States
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    taskReminders: true,
    weeklyDigest: false,
    darkMode: false,
    compactView: false
  })

  // Generate avatar URL
  const getAvatarUrl = (name) => {
    const encodedName = encodeURIComponent(name || 'User')
    return `https://ui-avatars.com/api/?name=${encodedName}&background=FF5C5C&color=fff&size=200`
  }

  // Handle profile update
  const handleProfileUpdate = async () => {
    if (!displayName.trim()) {
      toast.error('Display name cannot be empty')
      return
    }

    setSaving(true)
    try {
      // Generate avatar URL based on display name
      const photoURL = getAvatarUrl(displayName.trim())

      // Update auth profile
      await updateProfile(currentUser, {
        displayName: displayName.trim(),
        photoURL
      })

      // Update in Firestore
      const userRef = doc(db, 'users', currentUser.uid)
      await updateDoc(userRef, {
        displayName: displayName.trim(),
        photoURL,
        updatedAt: new Date().toISOString()
      })

      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Profile update error:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      })
      
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Please sign out and sign in again.')
      } else if (error.code === 'auth/requires-recent-login') {
        toast.error('For security, please sign out and sign in again to update your profile.')
      } else {
        toast.error('Failed to update profile. Please try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long')
      return
    }

    setSaving(true)
    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordData.currentPassword
      )
      await reauthenticateWithCredential(currentUser, credential)

      // Update password
      await updatePassword(currentUser, passwordData.newPassword)

      toast.success('Password updated successfully')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setShowPasswordSection(false)
    } catch (error) {
      console.error('Error updating password:', error)
      if (error.code === 'auth/wrong-password') {
        toast.error('Current password is incorrect')
      } else {
        toast.error('Failed to update password')
      }
    } finally {
      setSaving(false)
    }
  }

  // Handle preferences change
  const handlePreferenceChange = (key) => {
    setPreferences(prev => {
      const newPreferences = { ...prev, [key]: !prev[key] }
      localStorage.setItem('userPreferences', JSON.stringify(newPreferences))
      return newPreferences
    })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h1>
      
      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Settings</h2>
            <div className="space-y-6">
              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={currentUser?.photoURL || getAvatarUrl(displayName)}
                      alt="Profile"
                      className="h-20 w-20 rounded-full object-cover ring-2 ring-white"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">
                      Your avatar is automatically generated based on your display name
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Update your display name to change your avatar
                    </p>
                  </div>
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5C5C] focus:border-transparent transition-colors"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={currentUser?.email || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Email address cannot be changed
                </p>
              </div>

              {/* Save Profile Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleProfileUpdate}
                  disabled={saving}
                  className="px-4 py-2 bg-[#FF5C5C] text-white rounded-lg hover:bg-[#ff4444] focus:outline-none focus:ring-2 focus:ring-[#FF5C5C] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Password Settings</h2>
              <button
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className="text-sm text-[#FF5C5C] hover:text-[#ff4444]"
              >
                {showPasswordSection ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {showPasswordSection && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      currentPassword: e.target.value
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5C5C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      newPassword: e.target.value
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5C5C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      confirmPassword: e.target.value
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5C5C] focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handlePasswordChange}
                    disabled={saving}
                    className="px-4 py-2 bg-[#FF5C5C] text-white rounded-lg hover:bg-[#ff4444] focus:outline-none focus:ring-2 focus:ring-[#FF5C5C] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Preferences</h2>
            <div className="space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive email updates for your tasks</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={() => handlePreferenceChange('emailNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF5C5C]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5C5C]"></div>
                </label>
              </div>

              {/* Task Reminders */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Task Reminders</h3>
                  <p className="text-sm text-gray-500">Get notified before task deadlines</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.taskReminders}
                    onChange={() => handlePreferenceChange('taskReminders')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF5C5C]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5C5C]"></div>
                </label>
              </div>

              {/* Weekly Digest */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Weekly Digest</h3>
                  <p className="text-sm text-gray-500">Receive weekly summary of your tasks</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.weeklyDigest}
                    onChange={() => handlePreferenceChange('weeklyDigest')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF5C5C]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5C5C]"></div>
                </label>
              </div>

              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Dark Mode</h3>
                  <p className="text-sm text-gray-500">Switch between light and dark themes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.darkMode}
                    onChange={() => handlePreferenceChange('darkMode')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF5C5C]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5C5C]"></div>
                </label>
              </div>

              {/* Compact View */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Compact View</h3>
                  <p className="text-sm text-gray-500">Display more tasks in less space</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.compactView}
                    onChange={() => handlePreferenceChange('compactView')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF5C5C]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5C5C]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings 