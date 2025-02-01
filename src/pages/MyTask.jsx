import React, { useEffect, useState } from 'react';
import { useTask } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { OnboardingService } from '../services/OnboardingService';

const TaskListSkeleton = () => (
  <div className="space-y-4">
    {/* Search and Filter Bar Skeleton */}
    <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-pulse">
      <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
      <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
    </div>

    {/* Task Cards Skeleton */}
    {[1, 2, 3, 4].map((index) => (
      <div key={index} className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
        <div className="flex justify-between">
          <div className="space-y-3 flex-1">
            {/* Title */}
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            {/* Tags/Status */}
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
            </div>
          </div>
          {/* Task Image Skeleton */}
          <div className="w-20 h-20 bg-gray-200 rounded-lg ml-4"></div>
        </div>
      </div>
    ))}
  </div>
);

const MyTask = () => {
  const { tasks, updateTask, deleteTask, loading } = useTask();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [categoryFilter, setCategoryFilter] = useState('all'); // NEW: category filter
  const [sort, setSort] = useState('date'); // date, priority, status
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]); // NEW: categories state

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

  // Filter user's tasks
  const userTasks = tasks.filter(task => task.userId === currentUser.uid);

  // Apply filters
  const filteredTasks = userTasks.filter(task => {
    // Status filter
    if (filter === 'active' && task.status === 'Completed') return false;
    if (filter === 'completed' && task.status !== 'Completed') return false;

    // Category filter
    if (categoryFilter !== 'all' && task.category?.id !== categoryFilter) return false;

    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'date') {
      return new Date(a.endDate) - new Date(b.endDate);
    }
    if (sort === 'priority') {
      const priorityOrder = { 'Extreme': 0, 'Moderate': 1, 'Low': 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sort === 'status') {
      const statusOrder = { 'Not Started': 0, 'In Progress': 1, 'Completed': 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return 0;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (sortedTasks.length > 0 && !selectedTask) {
      setSelectedTask(sortedTasks[0]);
    }
  }, [sortedTasks]);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Replace the existing tour initialization with the shared service
  useEffect(() => {
    if (currentUser && !loading && !isLoading) {
      OnboardingService.checkAndStartTour(currentUser.uid, 'myTask');
    }
  }, [currentUser, loading, isLoading]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      toast.success('Task status updated successfully!');
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        toast.success('Task deleted successfully!');
        if (selectedTask?.id === taskId) {
          setSelectedTask(sortedTasks.find(task => task.id !== taskId) || null);
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task');
      }
    }
  };

  const formatDateTime = (date, time) => {
    const taskDate = new Date(date);
    return `${taskDate.toLocaleDateString()} ${time || ''}`.trim();
  };

  if (loading || isLoading) {
    return (
      <div className="p-6">
        <TaskListSkeleton />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-xl font-semibold">My Tasks</h1>
          <div className="flex flex-wrap gap-4 task-filters">
            {/* Category Filter - NEW */}
            <select
              className="task-category px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#FF5C5C]"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#FF5C5C]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#FF5C5C]"
            >
              <option value="date">Sort by Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="status">Sort by Status</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Task List */}
        <div className="space-y-4 task-list">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className={`bg-white rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${
                selectedTask?.id === task.id ? 'ring-2 ring-[#FF5C5C]' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${
                      task.status === 'Not Started' ? 'bg-red-500' :
                      task.status === 'In Progress' ? 'bg-blue-500' :
                      'bg-green-500'
                    }`} />
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    {task.isVital && (
                      <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">Vital</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className={`px-2 py-1 rounded-full ${
                      task.priority === 'Extreme' ? 'bg-red-100 text-red-700' :
                      task.priority === 'Moderate' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full ${
                      task.status === 'Not Started' ? 'bg-red-100 text-red-700' :
                      task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {task.status}
                    </span>
                    {task.category && (
                      <span 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ 
                          backgroundColor: `${task.category.color}15`,
                          color: task.category.color
                        }}
                      >
                        {task.category.name}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <span>Due: {formatDateTime(task.endDate, task.endTime)}</span>
                  </div>
                </div>
                {task.image && (
                  <img
                    src={task.image}
                    alt={task.title}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                )}
              </div>
            </div>
          ))}

          {sortedTasks.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No tasks found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try changing the filter or add new tasks
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Task Details */}
        {selectedTask && (
          <div className="bg-white rounded-xl p-6 task-details">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-lg font-medium text-gray-900">
                    {selectedTask.title}
                  </h2>
                  {selectedTask.isVital && (
                    <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                      Vital Task
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedTask.priority === 'Extreme' ? 'bg-red-100 text-red-700' :
                    selectedTask.priority === 'Moderate' ? 'bg-orange-100 text-orange-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {selectedTask.priority}
                  </span>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => handleStatusChange(selectedTask.id, e.target.value)}
                    className="task-status px-2 py-1 rounded-full text-xs border-0"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  {selectedTask.category && (
                    <span 
                      className="px-2 py-1 rounded-full text-xs"
                      style={{ 
                        backgroundColor: `${selectedTask.category.color}15`,
                        color: selectedTask.category.color
                      }}
                    >
                      {selectedTask.category.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleDeleteTask(selectedTask.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                  title="Delete Task"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <button 
                  onClick={() => navigate(`/task/${selectedTask.id}`)}
                  className="p-2 hover:bg-blue-50 rounded-lg text-blue-500"
                  title="View Full Details"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>

            {selectedTask.image && (
              <div className="mb-6">
                <img
                  src={selectedTask.image}
                  alt={selectedTask.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Description:</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line">{selectedTask.description}</p>
            </div>

            {selectedTask.optional?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Additional Notes:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {selectedTask.optional.map((note, index) => (
                    <li key={index} className="text-sm text-gray-600">{note}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Timeline */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Timeline:</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Start</p>
                    <p className="text-sm font-medium">
                      {formatDateTime(selectedTask.startDate, selectedTask.startTime)}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">End</p>
                    <p className="text-sm font-medium">
                      {formatDateTime(selectedTask.endDate, selectedTask.endTime)}
                    </p>
                  </div>
                </div>
                {selectedTask.completedAt && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Completed</p>
                    <p className="text-sm font-medium">
                      {new Date(selectedTask.completedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Deadline Information */}
            {selectedTask.deadline && selectedTask.deadline.type !== 'none' && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Deadline Details:</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Type: </span>
                    {selectedTask.deadline.type}
                  </p>
                  {selectedTask.deadline.type === 'flexible' && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Duration: </span>
                      {selectedTask.deadline.duration} {selectedTask.deadline.unit}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Category Information - NEW */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Category:</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {selectedTask.category ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: selectedTask.category.color }}
                      ></div>
                      <span 
                        className="text-sm font-medium"
                        style={{ color: selectedTask.category.color }}
                      >
                        {selectedTask.category.name}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg" style={{ 
                      backgroundColor: `${selectedTask.category.color}10`,
                      border: `1px solid ${selectedTask.category.color}30`
                    }}>
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: selectedTask.category.color }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="text-gray-600">Category Tasks: {categories.find(c => c.id === selectedTask.category.id)?.taskCount || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-sm">No category assigned</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Progress:</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          selectedTask.status === 'Completed' ? 'bg-green-500' :
                          selectedTask.status === 'In Progress' ? 'bg-blue-500' : 'bg-red-500'
                        }`}
                        style={{ 
                          width: selectedTask.status === 'Completed' ? '100%' : 
                                selectedTask.status === 'In Progress' ? '50%' : '0%' 
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {selectedTask.status === 'Completed' ? '100%' :
                     selectedTask.status === 'In Progress' ? '50%' : '0%'}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Not Started</span>
                  <span>In Progress</span>
                  <span>Completed</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTask; 