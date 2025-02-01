import React, { useState } from 'react'

const Appearance = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    sidebarCollapsed: false,
    denseMode: false,
    fontSize: 'medium',
    colorScheme: 'default'
  })

  const themes = [
    { id: 'light', name: 'Light Theme', icon: '☀️' },
    { id: 'dark', name: 'Dark Theme', icon: '🌙' },
    { id: 'system', name: 'System Theme', icon: '💻' }
  ]

  const fontSizes = [
    { id: 'small', name: 'Small' },
    { id: 'medium', name: 'Medium' },
    { id: 'large', name: 'Large' }
  ]

  const colorSchemes = [
    { id: 'default', name: 'Default Red', color: '#FF5C5C' },
    { id: 'blue', name: 'Ocean Blue', color: '#3B82F6' },
    { id: 'green', name: 'Forest Green', color: '#10B981' },
    { id: 'purple', name: 'Royal Purple', color: '#8B5CF6' }
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
        <h2 className="text-xl font-medium text-gray-900">Appearance Settings</h2>
        <p className="text-gray-600">Customize how Task Manager looks on your device</p>
      </div>

      <div className="space-y-6">
        {/* Theme Selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
          <div className="grid grid-cols-3 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleChange('theme', theme.id)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  settings.theme === theme.id
                    ? 'border-[#FF5C5C] bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl mb-2">{theme.icon}</span>
                <p className="text-sm font-medium text-gray-900">{theme.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Layout Options */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Layout</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Collapsed Sidebar</h4>
                <p className="text-sm text-gray-500">Show only icons in the sidebar</p>
              </div>
              <button
                onClick={() => handleToggle('sidebarCollapsed')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.sidebarCollapsed ? 'bg-[#FF5C5C]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.sidebarCollapsed ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Dense Mode</h4>
                <p className="text-sm text-gray-500">Reduce spacing between items</p>
              </div>
              <button
                onClick={() => handleToggle('denseMode')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.denseMode ? 'bg-[#FF5C5C]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.denseMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Font Size */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Font Size</h3>
          <div className="flex gap-4">
            {fontSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => handleChange('fontSize', size.id)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  settings.fontSize === size.id
                    ? 'border-[#FF5C5C] bg-red-50 text-[#FF5C5C]'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>

        {/* Color Scheme */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Color Scheme</h3>
          <div className="grid grid-cols-4 gap-4">
            {colorSchemes.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => handleChange('colorScheme', scheme.id)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  settings.colorScheme === scheme.id
                    ? 'border-[#FF5C5C]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className="w-full h-8 rounded mb-2"
                  style={{ backgroundColor: scheme.color }}
                />
                <p className="text-sm font-medium text-gray-900">{scheme.name}</p>
              </button>
            ))}
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

export default Appearance 