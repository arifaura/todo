import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTask } from '../context/TaskContext'
import toast from 'react-hot-toast'

const EditTaskModal = () => {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { tasks, updateTask } = useTask()
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    priority: '',
    description: '',
    image: null,
    currentImage: '',
    steps: [''],
    optional: ['']
  })

  useEffect(() => {
    const task = tasks?.find(t => t.id === taskId)
    if (task) {
      setFormData({
        title: task.title,
        date: task.date,
        priority: task.priority,
        description: task.description,
        image: null,
        currentImage: task.image,
        steps: task.steps.length > 0 ? task.steps : [''],
        optional: task.optional.length > 0 ? task.optional : ['']
      })
    }
  }, [taskId, tasks])

  const handleStepChange = (index, value) => {
    const newSteps = [...formData.steps]
    newSteps[index] = value
    setFormData({ ...formData, steps: newSteps })
  }

  const addStep = () => {
    setFormData({ ...formData, steps: [...formData.steps, ''] })
  }

  const removeStep = (index) => {
    const newSteps = formData.steps.filter((_, i) => i !== index)
    setFormData({ ...formData, steps: newSteps })
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Create image URL if a new image is selected
      let imageUrl = formData.currentImage
      if (formData.image) {
        imageUrl = URL.createObjectURL(formData.image)
      }

      const updatedData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        date: formData.date,
        image: imageUrl,
        steps: formData.steps.filter(step => step.trim()),
        optional: formData.optional.filter(opt => opt.trim()),
        status: tasks.find(t => t.id === taskId)?.status || 'Not Started'
      }
      
      await updateTask(taskId, updatedData)
      toast.success('Task updated successfully!')
      navigate(`/task/${taskId}`)
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task. Please try again.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium">Edit Task</h2>
            <div className="h-0.5 w-24 bg-[#FF5C5C] mt-1"></div>
          </div>
          <button 
            onClick={() => navigate(`/task/${taskId}`)}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF5C5C]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Due Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF5C5C]"
                required
              />
            </div>
          </div>

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
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF5C5C] resize-none"
                  required
                />
              </div>

              {/* Steps */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">Steps</label>
                <div className="space-y-2">
                  {formData.steps.map((step, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="text-gray-500">{index + 1}.</span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => handleStepChange(index, e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF5C5C]"
                        placeholder="Add step..."
                      />
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addStep}
                    className="text-[#FF5C5C] text-sm hover:underline"
                  >
                    + Add step
                  </button>
                </div>
              </div>

              {/* Optional Items */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">Optional</label>
                <div className="space-y-2">
                  {formData.optional.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="text-gray-400">•</span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleOptionalChange(index, e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF5C5C]"
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
                {formData.image || formData.currentImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={formData.image ? URL.createObjectURL(formData.image) : formData.currentImage}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: null, currentImage: '' })}
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
          <div className="flex justify-end">
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