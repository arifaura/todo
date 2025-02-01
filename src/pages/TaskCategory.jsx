import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const TaskCategory = () => {
  const [activeCategory, setActiveCategory] = useState('daily')

  const categories = [
    {
      id: 'daily',
      name: 'Daily Tasks',
      description: 'Regular day-to-day activities',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'project',
      name: 'Project Tasks',
      description: 'Project-related activities and milestones',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'personal',
      name: 'Personal Tasks',
      description: 'Personal goals and reminders',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'urgent',
      name: 'Urgent Tasks',
      description: 'Time-sensitive and critical tasks',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'bg-red-100 text-red-600'
    }
  ]

  const tasks = {
    daily: [
      { id: 1, title: 'Team Stand-up Meeting', status: 'pending', time: '10:00 AM' },
      { id: 2, title: 'Daily Report Submission', status: 'completed', time: '5:00 PM' },
      { id: 3, title: 'Email Follow-ups', status: 'pending', time: '2:00 PM' }
    ],
    project: [
      { id: 4, title: 'Project Planning Session', status: 'pending', time: 'Tomorrow' },
      { id: 5, title: 'Client Presentation', status: 'completed', time: 'Next Week' },
      { id: 6, title: 'Sprint Review', status: 'pending', time: 'Friday' }
    ],
    personal: [
      { id: 7, title: 'Gym Session', status: 'pending', time: '7:00 AM' },
      { id: 8, title: 'Reading Goal', status: 'pending', time: '8:00 PM' },
      { id: 9, title: 'Learning React', status: 'completed', time: '9:00 PM' }
    ],
    urgent: [
      { id: 10, title: 'Critical Bug Fix', status: 'pending', time: 'ASAP' },
      { id: 11, title: 'Emergency Meeting', status: 'completed', time: '1:00 PM' },
      { id: 12, title: 'Deadline Task', status: 'pending', time: 'Today' }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Task Categories</h1>
          <p className="mt-1 text-sm text-gray-500">Organize and manage your tasks by category</p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`p-4 rounded-lg border transition-all ${
                activeCategory === category.id
                  ? 'border-[#FF5C5C] shadow-sm'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg ${category.color} flex items-center justify-center mb-3`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category.icon} />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{category.description}</p>
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">
              {categories.find(c => c.id === activeCategory)?.name}
            </h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {tasks[activeCategory].map((task) => (
              <li key={task.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => {}}
                      className="h-4 w-4 text-[#FF5C5C] focus:ring-[#FF5C5C] border-gray-300 rounded"
                    />
                    <p className={`ml-3 text-sm ${
                      task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500">{task.time}</span>
                    <button className="ml-4 text-gray-400 hover:text-gray-500">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="px-4 py-4 sm:px-6 border-t border-gray-200">
            <button className="inline-flex items-center text-sm text-[#FF5C5C] hover:text-[#ff3c3c]">
              <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Task
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskCategory 