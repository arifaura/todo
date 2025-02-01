import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTask } from '../context/TaskContext'
import toast from 'react-hot-toast'

const TaskStatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Not Started':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'In Progress':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}>
      {status}
    </span>
  )
}

const PriorityBadge = ({ priority }) => {
  const getPriorityColor = () => {
    switch (priority) {
      case 'Extreme':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'Moderate':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'Low':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor()}`}>
      {priority}
    </span>
  )
}

const TaskDetail = () => {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { tasks, updateTask } = useTask()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (tasks) {
      const foundTask = tasks.find(t => t.id === taskId)
      setTask(foundTask)
      setLoading(false)
    }
  }, [taskId, tasks])

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedTask = {
        ...task,
        status: newStatus,
        completedAt: newStatus === 'Completed' ? new Date().toISOString() : null
      }
      await updateTask(task.id, updatedTask)
      setTask(updatedTask)
      toast.success(`Task marked as ${newStatus}`)
    } catch (error) {
      console.error('Error updating task status:', error)
      toast.error('Failed to update task status')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#FF5C5C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Task Not Found</h2>
          <p className="text-gray-600 mb-4">This task might have been deleted or doesn't exist.</p>
          <button
            onClick={() => navigate('/my-task')}
            className="px-4 py-2 bg-[#FF5C5C] text-white rounded-lg hover:bg-[#ff4444]"
          >
            Go to My Tasks
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">{task.title}</h1>
              <div className="flex flex-wrap gap-2">
                <TaskStatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
                {task.category && (
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-medium border"
                    style={{ 
                      backgroundColor: `${task.category.color}15`,
                      color: task.category.color,
                      borderColor: `${task.category.color}30`
                    }}
                  >
                    {task.category.name}
                  </span>
                )}
                {task.isVital && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 border border-red-200">
                    Vital Task
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/task/${taskId}/edit`)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Task
              </button>
              {task.status !== 'Completed' ? (
                <button
                  onClick={() => handleStatusChange('Completed')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Complete
                </button>
              ) : (
                <button
                  onClick={() => handleStatusChange('Not Started')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Restart
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="prose max-w-none">
            <p className="text-gray-600 whitespace-pre-line">{task.description}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Category Information - NEW SECTION */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Category</h2>
              {task.category ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: task.category.color }}
                    ></div>
                    <span className="text-lg font-medium" style={{ color: task.category.color }}>
                      {task.category.name}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg" style={{ 
                    backgroundColor: `${task.category.color}10`,
                    border: `1px solid ${task.category.color}30`
                  }}>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: task.category.color }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-gray-600">Category Tasks: {task.category.taskCount || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>No category assigned</span>
                </div>
              )}
            </div>

            {/* Dates and Times */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium">{new Date(task.startDate).toLocaleDateString()}</p>
                    {task.startTime && (
                      <p className="text-sm text-gray-500">{task.startTime}</p>
                    )}
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-medium">{new Date(task.endDate).toLocaleDateString()}</p>
                    {task.endTime && (
                      <p className="text-sm text-gray-500">{task.endTime}</p>
                    )}
                  </div>
                </div>
                {task.completedAt && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500">Completed On</p>
                    <p className="font-medium">{new Date(task.completedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Optional Items */}
            {task.optional && task.optional.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h2>
                <ul className="space-y-2">
                  {task.optional.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Task Image */}
            {task.image && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Image</h2>
                <img
                  src={task.image}
                  alt={task.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Deadline Information */}
            {task.deadline && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Deadline Details</h2>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Type:</span> {task.deadline.type}
                  </p>
                  {task.deadline.type === 'flexible' && (
                    <p className="text-gray-600">
                      <span className="font-medium">Duration:</span> {task.deadline.duration} {task.deadline.unit}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Task Progress */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Progress</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          task.status === 'Completed' ? 'bg-green-500' :
                          task.status === 'In Progress' ? 'bg-blue-500' : 'bg-red-500'
                        }`}
                        style={{ 
                          width: task.status === 'Completed' ? '100%' : 
                                task.status === 'In Progress' ? '50%' : '0%' 
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {task.status === 'Completed' ? '100%' :
                     task.status === 'In Progress' ? '50%' : '0%'}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Not Started</span>
                  <span>In Progress</span>
                  <span>Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetail 