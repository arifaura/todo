import React, { useEffect, useState } from 'react';
import { useTask } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { LoadingSpinner } from '../components/LoadingSpinner';

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
  const [sort, setSort] = useState('date'); // date, priority, status
  const [isLoading, setIsLoading] = useState(true);

  // Filter user's tasks
  const userTasks = tasks.filter(task => task.userId === currentUser.uid);

  // Apply filters
  const filteredTasks = userTasks.filter(task => {
    if (filter === 'active') return task.status !== 'Completed';
    if (filter === 'completed') return task.status === 'Completed';
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
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold mb-1">My Tasks</h1>
          <div className="flex gap-4">
            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#FF5C5C]"
            >
              <option value="all">All Tasks</option>
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
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Task List */}
        <div className="space-y-4">
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
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`${
                      task.priority === 'Extreme' ? 'text-red-500' :
                      task.priority === 'Moderate' ? 'text-orange-500' :
                      'text-green-500'
                    }`}>
                      Priority: {task.priority}
                    </span>
                    <span className={`${
                      task.status === 'Not Started' ? 'text-red-500' :
                      task.status === 'In Progress' ? 'text-blue-500' :
                      'text-green-500'
                    }`}>
                      Status: {task.status}
                    </span>
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
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-1">
                  {selectedTask.title}
                </h2>
                <div className="flex items-center gap-4">
                  <span className={`text-sm ${
                    selectedTask.priority === 'Extreme' ? 'text-red-500' :
                    selectedTask.priority === 'Moderate' ? 'text-orange-500' :
                    'text-green-500'
                  }`}>
                    Priority: {selectedTask.priority}
                  </span>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => handleStatusChange(selectedTask.id, e.target.value)}
                    className="text-sm border-0 bg-transparent focus:outline-none focus:ring-0"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleDeleteTask(selectedTask.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <button 
                  onClick={() => navigate(`/task/${selectedTask.id}`)}
                  className="p-2 hover:bg-blue-50 rounded-lg text-blue-500"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Description:</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line">{selectedTask.description}</p>
            </div>

            {selectedTask.optional?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Additional Notes:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {selectedTask.optional.map((note, index) => (
                    <li key={index} className="text-sm text-gray-600">{note}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 pt-4 border-t space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Start Date:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDateTime(selectedTask.startDate, selectedTask.startTime)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">End Date:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDateTime(selectedTask.endDate, selectedTask.endTime)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTask; 