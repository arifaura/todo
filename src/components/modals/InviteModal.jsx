import React, { useState } from 'react'

const InviteModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('')

  const members = [
    {
      id: 1,
      name: 'Upashna Gurung',
      email: 'upashna1995@gmail.com',
      avatar: 'https://placehold.co/40x40',
      role: 'Can edit'
    },
    {
      id: 2,
      name: 'Jeremy Lee',
      email: 'jerrylei1996@gmail.com',
      avatar: 'https://placehold.co/40x40',
      role: 'Can edit'
    },
    {
      id: 3,
      name: 'Thomas Park',
      email: 'parkthm123@gmail.com',
      avatar: 'https://placehold.co/40x40',
      role: 'Owner'
    },
    {
      id: 4,
      name: 'Rachel Takahashi',
      email: 'takahashir23@gmail.com',
      avatar: 'https://placehold.co/40x40',
      role: 'Can edit'
    }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle invite submission
    setEmail('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Send an invite to a new member</h2>
          <span 
            onClick={onClose} 
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            Go Back
          </span>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="member.name99@gmail.com"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#FF5C5C] text-white rounded-lg hover:bg-[#ff4444] transition-colors whitespace-nowrap"
            >
              Send Invite
            </button>
          </div>
        </div>

        {/* Members List */}
        <div>
          <label className="block text-gray-700 mb-2">Members</label>
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
                <select
                  value={member.role}
                  onChange={() => {}}
                  className={`text-sm border rounded-md px-2 py-1 ${
                    member.role === 'Owner' 
                      ? 'text-gray-500 border-gray-300 bg-gray-50 cursor-not-allowed' 
                      : 'text-gray-700 border-gray-300'
                  }`}
                  disabled={member.role === 'Owner'}
                >
                  <option value="Can edit">Can edit</option>
                  <option value="Owner">Owner</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Project Link */}
        <div className="mt-4">
          <label className="block text-gray-700 mb-2">Project Link</label>
          <div className="flex gap-2">
            <input
              type="text"
              value="https://taskmanagerhome.com/54665y29"
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText('https://taskmanagerhome.com/54665y29')
              }}
              className="px-4 py-2 bg-[#FF5C5C] text-white rounded-lg hover:bg-[#ff4444] transition-colors whitespace-nowrap"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InviteModal 