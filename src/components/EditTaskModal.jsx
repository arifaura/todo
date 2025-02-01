import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTask } from '../context/TaskContext'
import { useAuth } from '../context/AuthContext'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import toast from 'react-hot-toast'

const RestartTaskAlert = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Restart Task?</h3>
          <p className="text-gray-600">
            This will set the task status back to "Not Started" and you can begin working on it again.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Restart Task
          </button>
        </div>
      </div>
    </div>
  );
};

const EditTaskModal = () => {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { tasks, updateTask } = useTask()
  const { currentUser } = useAuth()
  const [categories, setCategories] = useState([])
  const [showRestartAlert, setShowRestartAlert] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    priority: '',
    description: '',
    image: null,
    currentImage: '',
    optional: [''],
    category: '',
    deadline: {
      type: 'none',
      duration: 0,
      unit: 'hours'
    },
    status: ''
  })

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const q = query(
          collection(db, 'categories'),
          where('userId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const categoriesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, [currentUser]);

  // Load task data
  useEffect(() => {
    const task = tasks?.find(t => t.id === taskId)
    if (task) {
      setFormData({
        title: task.title || '',
        startDate: task.startDate || '',
        endDate: task.endDate || '',
        startTime: task.startTime || '',
        endTime: task.endTime || '',
        priority: task.priority || '',
        description: task.description || '',
        image: null,
        currentImage: task.image || '',
        optional: Array.isArray(task.optional) && task.optional.length > 0 ? task.optional : [''],
        category: task.category?.id || '',
        deadline: task.deadline || {
          type: 'none',
          duration: 0,
          unit: 'hours'
        },
        status: task.status || 'Not Started'
      })
    }
  }, [taskId, tasks])

  const handleOptionalChange = (index, value) => {
    const newOptional = [...formData.optional]
    newOptional[index] = value
    setFormData({ ...formData, optional: newOptional })
  }

  const addOptional = () => {
    setFormData({ ...formData, optional: [...formData.optional, ''] })
  }

  const removeOptional = (index) => {
    if (formData.optional.length > 1) {
      const newOptional = formData.optional.filter((_, i) => i !== index)
      setFormData({ ...formData, optional: newOptional })
    }
  }

  const isVitalTask = (startDate, endDate, priority) => {
    if (priority !== 'Extreme') return false;
    
    const taskEndDateTime = new Date(`${endDate}T${formData.endTime || '23:59'}`);
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);
    
    return taskEndDateTime <= threeDaysFromNow;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let imageUrl = formData.currentImage
      if (formData.image) {
        imageUrl = URL.createObjectURL(formData.image)
      }

      const startDateTime = formData.startTime 
        ? new Date(`${formData.startDate}T${formData.startTime}`)
        : new Date(`${formData.startDate}T00:00`);

      const endDateTime = formData.endTime 
        ? new Date(`${formData.endDate}T${formData.endTime}`)
        : new Date(`${formData.endDate}T23:59`);

      const selectedCategory = categories.find(cat => cat.id === formData.category);

      const updatedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime || null,
        endTime: formData.endTime || null,
        deadline: {
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
          type: formData.deadline.type,
          duration: formData.deadline.type === 'flexible' ? formData.deadline.duration : null,
          unit: formData.deadline.type === 'flexible' ? formData.deadline.unit : null
        },
        category: formData.category ? {
          id: selectedCategory.id,
          name: selectedCategory.name,
          color: selectedCategory.color
        } : null,
        image: imageUrl,
        optional: formData.optional.filter(opt => opt.trim()),
        isVital: isVitalTask(formData.startDate, formData.endDate, formData.priority),
        status: formData.status
      }
      
      await updateTask(taskId, updatedData)
      toast.success('Task updated successfully!')
      navigate(`/task/${taskId}`)
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task. Please try again.')
    }
  }

  const handleRestartTask = async () => {
    try {
      const updatedData = {
        ...formData,
        status: 'Not Started',
        startDate: new Date().toISOString().split('T')[0], // Set start date to today
        completedAt: null // Remove completion timestamp
      }
      
      await updateTask(taskId, updatedData)
      setFormData(prev => ({ ...prev, status: 'Not Started' }))
      toast.success('Task restarted successfully!')
      setShowRestartAlert(false)
    } catch (error) {
      console.error('Error restarting task:', error)
      toast.error('Failed to restart task. Please try again.')
    }
  }

  // Loading state
  if (!tasks) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#FF5C5C] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  // Task not found
  const task = tasks.find(t => t.id === taskId)
  if (!task) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-2">Task Not Found</h2>
            <p className="text-gray-600 mb-4">The task you're trying to edit doesn't exist or has been deleted.</p>
            <button
              onClick={() => navigate('/my-task')}
              className="px-4 py-2 bg-[#FF5C5C] text-white rounded-lg hover:bg-[#ff4444]"
            >
              Go to My Tasks
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <RestartTaskAlert 
        isOpen={showRestartAlert}
        onConfirm={handleRestartTask}
        onCancel={() => setShowRestartAlert(false)}
      />
      
      <div className="bg-white rounded-lg w-full max-w-3xl p-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-medium">Edit Task</h2>
            <div className="h-0.5 w-24 bg-[#FF5C5C] mt-1"></div>
          </div>
          <button 
            onClick={() => navigate(`/task/${taskId}`)}
            className="text-gray-600 hover:text-gray-800"
          >
            Go Back
          </button>
        </div>

        {/* Status Banner for Completed Tasks */}
        {formData.status === 'Completed' && (
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-green-800">Task Completed</h3>
                <p className="text-sm text-green-600">This task has been marked as complete.</p>
              </div>
            </div>
            <button
              onClick={() => setShowRestartAlert(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Restart Task
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Title</label>
            <input
              type="text"
              className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Category</label>
            <select
              className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">No Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dates and Times */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Start Date</label>
              <input
                type="date"
                className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Start Time</label>
              <input
                type="time"
                className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">End Date</label>
              <input
                type="date"
                className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">End Time</label>
              <input
                type="time"
                className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Priority</label>
            <div className="flex gap-12">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="priority"
                  value="Extreme"
                  checked={formData.priority === 'Extreme'}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-4 h-4 border-gray-300"
                  required
                />
                <span className="text-gray-600 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Extreme
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="priority"
                  value="Moderate"
                  checked={formData.priority === 'Moderate'}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-4 h-4 border-gray-300"
                />
                <span className="text-gray-600 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Moderate
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="priority"
                  value="Low"
                  checked={formData.priority === 'Low'}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-4 h-4 border-gray-300"
                />
                <span className="text-gray-600 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Low
                </span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Description</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Optional Items */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Optional Items</label>
            <div className="space-y-2">
              {formData.optional.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleOptionalChange(index, e.target.value)}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none"
                    placeholder="Add optional item..."
                  />
                  {formData.optional.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOptional(index)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addOptional}
                className="text-[#FF5C5C] text-sm hover:underline"
              >
                + Add optional item
              </button>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Task Image</label>
            <div className="border border-gray-300 rounded-lg p-4">
              {formData.image || formData.currentImage ? (
                <div className="relative">
                  <img
                    src={formData.image ? URL.createObjectURL(formData.image) : formData.currentImage}
                    alt="Task"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: null, currentImage: '' })}
                    className="absolute top-2 right-2 bg-white rounded-full p-1"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <label className="cursor-pointer mt-2 inline-block">
                    <span className="text-[#FF5C5C] hover:underline">Upload Image</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-[#FF5C5C] text-white rounded-lg hover:bg-[#ff4444] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTaskModal 