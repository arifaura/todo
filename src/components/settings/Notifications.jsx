import React, { useState } from 'react'

const Notifications = () => {
  const [settings, setSettings] = useState({
    emailNotifications: {
      newTask: true,
      taskUpdates: true,
      taskComments: true,
      taskReminders: true,
      teamUpdates: false
    },
    pushNotifications: {
      newTask: true,
      taskUpdates: true,
      taskComments: false,
      taskReminders: true,
      teamUpdates: true
    },
    notificationSound: true,
    desktopNotifications: true
  })

  const handleEmailToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [key]: !prev.emailNotifications[key]
      }
    }))
  }

  const handlePushToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      pushNotifications: {
        ...prev.pushNotifications,
        [key]: !prev.pushNotifications[key]
      }
    }))
  }

  const handleGeneralToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-900">Notification Settings</h2>
        <p className="text-gray-600">Manage how you receive notifications</p>
      </div>

      <div className="space-y-6">
        {/* Email Notifications */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
          <div className="space-y-4">
            {Object.entries(settings.emailNotifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {key.split(/(?=[A-Z])/).join(' ')}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Receive email notifications for {key.split(/(?=[A-Z])/).join(' ').toLowerCase()}
                  </p>
                </div>
                <button
                  onClick={() => handleEmailToggle(key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-[#FF5C5C]' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Push Notifications</h3>
          <div className="space-y-4">
            {Object.entries(settings.pushNotifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {key.split(/(?=[A-Z])/).join(' ')}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Receive push notifications for {key.split(/(?=[A-Z])/).join(' ').toLowerCase()}
                  </p>
                </div>
                <button
                  onClick={() => handlePushToggle(key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-[#FF5C5C]' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* General Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Notification Sound</h4>
                <p className="text-sm text-gray-500">Play a sound for new notifications</p>
              </div>
              <button
                onClick={() => handleGeneralToggle('notificationSound')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notificationSound ? 'bg-[#FF5C5C]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notificationSound ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Desktop Notifications</h4>
                <p className="text-sm text-gray-500">Show notifications on your desktop</p>
              </div>
              <button
                onClick={() => handleGeneralToggle('desktopNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.desktopNotifications ? 'bg-[#FF5C5C]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.desktopNotifications ? 'translate-x-6' : 'translate-x-1'
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

export default Notifications 