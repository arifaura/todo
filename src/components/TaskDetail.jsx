import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTask } from '../context/TaskContext'
import toast from 'react-hot-toast'

const TaskDetail = () => {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { tasks, loading, deleteTask, updateTask } = useTask()
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Find task by Firebase document ID
  const task = tasks?.find(t => t.id === taskId)

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId)
        toast.success('Task deleted successfully')
        navigate('/my-task')
      } catch (error) {
        console.error('Error deleting task:', error)
        toast.error('Failed to delete task')
      }
    }
  }

  const handleEdit = () => {
    navigate(`/task/${taskId}/edit`)
  }

  const handleBookmark = async () => {
    try {
      await updateTask(taskId, { isBookmarked: !isBookmarked })
      setIsBookmarked(!isBookmarked)
      toast.success(isBookmarked ? 'Bookmark removed' : 'Task bookmarked')
    } catch (error) {
      console.error('Error updating bookmark:', error)
      toast.error('Failed to update bookmark')
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl text-gray-600">Loading task...</h2>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl text-gray-600">Task not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-[#FF5C5C] hover:underline"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-xl font-medium">{task.title}</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800"
          >
            Go Back
          </button>
        </div>

        {/* Task Info */}
        <div className="flex gap-6 mb-6">
          <div className="w-1/3">
            {task.image && (
              <img
                src={task.image}
                alt={task.title}
                className="w-full h-40 object-cover rounded-lg"
              />
            )}
          </div>
          <div className="flex-1">
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Priority:</span>
                <span className={`${
                  task.priority === 'Extreme' ? 'text-red-500' :
                  task.priority === 'Moderate' ? 'text-blue-500' :
                  'text-green-500'
                }`}>{task.priority}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Status:</span>
                <span className="text-red-500">{task.status}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Due Date:</span>
                <span className="text-gray-600">{task.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Created on:</span>
                <span className="text-gray-600">{task.createdOn}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Task Description */}
        <div className="mb-6">
          <h3 className="text-gray-700 font-medium mb-2">Description</h3>
          <p className="text-gray-600 mb-4">{task.description}</p>
          
          {/* Steps List */}
          {task.steps?.length > 0 && (
            <div>
              <h3 className="text-gray-700 font-medium mb-2">Steps</h3>
              <div className="space-y-2">
                {task.steps.map((step, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-gray-500">{index + 1}.</span>
                    <p className="text-gray-600">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Optional Section */}
        {task.optional?.length > 0 && (
          <div>
            <h3 className="text-gray-700 font-medium mb-2">Optional:</h3>
            <ul className="list-disc list-inside space-y-1">
              {task.optional.map((item, index) => (
                <li key={index} className="text-gray-600">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button 
            onClick={handleDelete}
            className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
            title="Delete task"
          >
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button 
            onClick={handleEdit}
            className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
            title="Edit task"
          >
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            onClick={handleBookmark}
            className={`p-2 rounded-full ${isBookmarked ? 'bg-yellow-100' : 'bg-yellow-50'} hover:bg-yellow-100 transition-colors`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark task'}
          >
            <svg className="w-5 h-5 text-yellow-500" fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskDetail 