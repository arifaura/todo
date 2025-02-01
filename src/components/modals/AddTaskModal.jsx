import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTask } from '../../context/TaskContext'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { collection, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore'
import { db } from '../../config/firebase'

const VitalTaskAlert = ({ isOpen, onViewVital, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl transform transition-all">
        <div className="mb-6">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mx-auto mb-4">
            <svg className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">Vital Task Created!</h3>
          <p className="text-sm text-gray-600 text-center leading-relaxed">
            This task has been marked as vital due to its extreme priority and deadline. 
            Would you like to view your vital tasks dashboard?
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={onViewVital}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            View Vital Tasks
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            Continue with Current Task
          </button>
        </div>
      </div>
    </div>
  );
};

const AddTaskModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const { addTask } = useTask()
  const { currentUser } = useAuth()
  const [categories, setCategories] = useState([])
  const [showVitalAlert, setShowVitalAlert] = useState(false);
  const [newTaskId, setNewTaskId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    priority: '',
    description: '',
    image: null,
    optional: [''],
    category: '',
    deadline: {
      type: 'none',
      duration: 0,
      unit: 'hours'
    }
  })

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

  const handleOptionalChange = (index, value) => {
    const newOptional = [...formData.optional]
    newOptional[index] = value
    setFormData({ ...formData, optional: newOptional })
  }

  const addOptional = () => {
    setFormData({ ...formData, optional: [...formData.optional, ''] })
  }

  const removeOptional = (index) => {
    const newOptional = formData.optional.filter((_, i) => i !== index)
    setFormData({ ...formData, optional: newOptional })
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
      let imageUrl = null
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

      const cleanedData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: 'Not Started',
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime || null,
        endTime: formData.endTime || null,
        createdAt: new Date().toISOString(),
        createdOn: new Date().toISOString(),
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
        image: imageUrl || 'https://placehold.co/100x100',
        optional: formData.optional.filter(opt => opt.trim()),
        userEmail: currentUser.email,
        userName: currentUser.displayName || currentUser.email.split('@')[0],
        userId: currentUser.uid,
        isVital: isVitalTask(formData.startDate, formData.endDate, formData.priority)
      }
      
      const newTask = await addTask(cleanedData)
      setNewTaskId(newTask.id);

      // Update category task count
      if (formData.category) {
        const categoryRef = doc(db, 'categories', formData.category);
        await updateDoc(categoryRef, {
          taskCount: increment(1)
        });
      }

      toast.success('Task created successfully!')
      
      if (cleanedData.isVital) {
        setShowVitalAlert(true);
      } else {
        onClose()
        navigate(`/task/${newTask.id}`)
      }
    } catch (error) {
      console.error('Error creating task:', error)
      toast.error('Failed to create task. Please try again.')
    }
  }

  const handleVitalAlertClose = () => {
    setShowVitalAlert(false);
    onClose();
    navigate(`/task/${newTaskId}`);
  };

  const handleViewVital = () => {
    setShowVitalAlert(false);
    onClose();
    navigate('/vital-task');
  };

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <VitalTaskAlert 
        isOpen={showVitalAlert}
        onViewVital={handleViewVital}
        onClose={handleVitalAlertClose}
      />
      
      <div className="bg-white rounded-lg w-full max-w-3xl p-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-medium">Add New Task</h2>
            <div className="h-0.5 w-24 bg-[#FF5C5C] mt-1"></div>
          </div>
          <span 
            onClick={onClose} 
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            Go Back
          </span>
        </div>

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
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time Range */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date/Time */}
            <div className="space-y-3">
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
            </div>

            {/* End Date/Time */}
            <div className="space-y-3">
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
          </div>

          {/* Deadline Type */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Deadline Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="deadlineType"
                  checked={formData.deadline.type === 'none'}
                  onChange={() => setFormData({
                    ...formData,
                    deadline: { type: 'none', duration: 0, unit: 'hours' }
                  })}
                  className="text-[#FF5C5C]"
                />
                <span className="text-sm text-gray-600">No specific deadline</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="deadlineType"
                  checked={formData.deadline.type === 'specific'}
                  onChange={() => setFormData({
                    ...formData,
                    deadline: { type: 'specific', duration: 0, unit: 'hours' }
                  })}
                  className="text-[#FF5C5C]"
                />
                <span className="text-sm text-gray-600">Specific time</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="deadlineType"
                  checked={formData.deadline.type === 'flexible'}
                  onChange={() => setFormData({
                    ...formData,
                    deadline: { type: 'flexible', duration: 1, unit: 'hours' }
                  })}
                  className="text-[#FF5C5C]"
                />
                <span className="text-sm text-gray-600">Flexible duration</span>
              </label>
            </div>
          </div>

          {/* Flexible Duration (show only if flexible type is selected) */}
          {formData.deadline.type === 'flexible' && (
            <div className="flex gap-3 items-end">
              <div>
                <label className="block text-gray-700 text-sm mb-1">Duration</label>
                <input
                  type="number"
                  min="1"
                  className="w-24 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none"
                  value={formData.deadline.duration}
                  onChange={(e) => setFormData({
                    ...formData,
                    deadline: { ...formData.deadline, duration: parseInt(e.target.value) }
                  })}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-1">Unit</label>
                <select
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none"
                  value={formData.deadline.unit}
                  onChange={(e) => setFormData({
                    ...formData,
                    deadline: { ...formData.deadline, unit: e.target.value }
                  })}
                >
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          )}

          {/* Priority */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Priority</label>
            <div className="flex gap-12">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="priority"
                  value="Extreme"
                  checked={formData.priority === 'Extreme'}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-4 h-4 border-gray-300 rounded"
                />
                <span className="text-gray-600 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Extreme
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="priority"
                  value="Moderate"
                  checked={formData.priority === 'Moderate'}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-4 h-4 border-gray-300 rounded"
                />
                <span className="text-gray-600 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Moderate
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="priority"
                  value="Low"
                  checked={formData.priority === 'Low'}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-4 h-4 border-gray-300 rounded"
                />
                <span className="text-gray-600 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Low
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Task Description and Steps */}
            <div className="col-span-2 space-y-2">
              {/* Description */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">Task Description</label>
                <textarea
                  placeholder="Start writing here...."
                  rows={3}
                  className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              {/* Optional Items */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">Optional</label>
                <div className="space-y-1">
                  {formData.optional.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="text-gray-400">•</span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleOptionalChange(index, e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none text-sm"
                        placeholder="Add optional item..."
                      />
                      <button
                        type="button"
                        onClick={() => removeOptional(index)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
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
            </div>

            {/* Upload Image */}
            <div>
              <label className="block text-gray-700 text-sm mb-1">Upload Image</label>
              <div className="border border-gray-300 rounded-lg p-2 text-center h-[140px] flex flex-col items-center justify-center">
                {formData.image ? (
                  <div className="relative w-full h-full">
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: null })}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-1">
                      <svg className="w-6 h-6 text-gray-400 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-xs mb-1">Drag&Drop files here</p>
                    <p className="text-gray-400 text-xs mb-1">or</p>
                    <label className="inline-block">
                      <span className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 text-xs cursor-pointer hover:bg-gray-50">
                        Browse
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-2">
            <button
              type="submit"
              className="px-6 py-1.5 bg-[#FF5C5C] text-white rounded-lg hover:bg-[#ff4444] transition-colors"
            >
              Done
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTaskModal 