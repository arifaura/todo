import React, { useState } from 'react'

const Privacy = () => {
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    taskVisibility: 'team',
    dataSharing: false,
    activityStatus: true,
    showEmail: true,
    showPhone: false
  })

  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false)

  const recoveryCodes = [
    'XXXX-XXXX-XXXX-1234',
    'XXXX-XXXX-XXXX-5678',
    'XXXX-XXXX-XXXX-9012',
    'XXXX-XXXX-XXXX-3456'
  ]

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-900">Privacy & Security</h2>
        <p className="text-gray-600">Manage your account security and privacy preferences</p>
      </div>

      <div className="space-y-6">
        {/* Two-Factor Authentication */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Enable 2FA</h4>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <button
                onClick={() => handleToggle('twoFactorAuth')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.twoFactorAuth ? 'bg-[#FF5C5C]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {settings.twoFactorAuth && (
              <div className="mt-4">
                <button
                  onClick={() => setShowRecoveryCodes(!showRecoveryCodes)}
                  className="text-[#FF5C5C] text-sm hover:underline"
                >
                  {showRecoveryCodes ? 'Hide Recovery Codes' : 'View Recovery Codes'}
                </button>
                {showRecoveryCodes && (
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">Save these codes in a secure place:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {recoveryCodes.map((code, index) => (
                        <div key={index} className="font-mono text-sm bg-white p-2 rounded border">
                          {code}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Security Alerts */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Security Alerts</h3>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Login Alerts</h4>
              <p className="text-sm text-gray-500">Get notified of new sign-ins to your account</p>
            </div>
            <button
              onClick={() => handleToggle('loginAlerts')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.loginAlerts ? 'bg-[#FF5C5C]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Task Visibility */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Task Visibility</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                checked={settings.taskVisibility === 'private'}
                onChange={() => handleChange('taskVisibility', 'private')}
                className="w-4 h-4 text-[#FF5C5C] border-gray-300 focus:ring-[#FF5C5C]"
              />
              <span className="ml-2 text-sm text-gray-900">Private (Only you)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={settings.taskVisibility === 'team'}
                onChange={() => handleChange('taskVisibility', 'team')}
                className="w-4 h-4 text-[#FF5C5C] border-gray-300 focus:ring-[#FF5C5C]"
              />
              <span className="ml-2 text-sm text-gray-900">Team (Your team members)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={settings.taskVisibility === 'public'}
                onChange={() => handleChange('taskVisibility', 'public')}
                className="w-4 h-4 text-[#FF5C5C] border-gray-300 focus:ring-[#FF5C5C]"
              />
              <span className="ml-2 text-sm text-gray-900">Public (Anyone with the link)</span>
            </label>
          </div>
        </div>

        {/* Data & Privacy */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Data & Privacy</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Data Sharing</h4>
                <p className="text-sm text-gray-500">Share usage data to help improve our services</p>
              </div>
              <button
                onClick={() => handleToggle('dataSharing')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.dataSharing ? 'bg-[#FF5C5C]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.dataSharing ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Activity Status</h4>
                <p className="text-sm text-gray-500">Show when you're active on Task Manager</p>
              </div>
              <button
                onClick={() => handleToggle('activityStatus')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.activityStatus ? 'bg-[#FF5C5C]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.activityStatus ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Privacy */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Privacy</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Show Email Address</h4>
                <p className="text-sm text-gray-500">Display your email to team members</p>
              </div>
              <button
                onClick={() => handleToggle('showEmail')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.showEmail ? 'bg-[#FF5C5C]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.showEmail ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Show Phone Number</h4>
                <p className="text-sm text-gray-500">Display your phone number to team members</p>
              </div>
              <button
                onClick={() => handleToggle('showPhone')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.showPhone ? 'bg-[#FF5C5C]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.showPhone ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="button"
            className="px-6 py-2 bg-[#FF5C5C] text-white rounded-lg hover:bg-[#ff4444] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default Privacy 