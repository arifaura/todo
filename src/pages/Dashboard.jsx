import React, { useEffect, useState } from 'react';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import InviteModal from '../components/modals/InviteModal';
import AddTaskModal from '../components/modals/AddTaskModal';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LoadingScreen, LoadingSkeleton } from '../components/LoadingSpinner';

const TaskSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="w-3/4">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

const Dashboard = () => {
  const { tasks, updateTask, fetchTasks } = useTask();
  const { currentUser } = useAuth();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Calculate task statistics
  const calculateTaskStats = () => {
    const total = tasks.length;
    if (total === 0) return { completed: 0, inProgress: 0, notStarted: 0 };

    const completed = tasks.filter(task => task.status === 'Completed').length;
    const inProgress = tasks.filter(task => task.status === 'In Progress').length;
    const notStarted = tasks.filter(task => task.status === 'Not Started').length;

    return {
      completed: Math.round((completed / total) * 100),
      inProgress: Math.round((inProgress / total) * 100),
      notStarted: Math.round((notStarted / total) * 100)
    };
  };

  const taskStatusData = calculateTaskStats();

  // Filter tasks by status
  const activeTasks = tasks.filter(task => task.status !== 'Completed');
  const completedTasks = tasks.filter(task => task.status === 'Completed');

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Extreme':
        return 'text-red-500';
      case 'Moderate':
        return 'text-blue-500';
      case 'Low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-green-500';
      case 'In Progress':
        return 'text-blue-500';
      case 'Not Started':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      toast.success(`Task marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const TaskStatusDropdown = ({ task, onClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    const statusOptions = ['Not Started', 'In Progress', 'Completed'];

    const handleOptionClick = async (e, status) => {
      e.stopPropagation(); // Prevent task card click
      setIsOpen(false);
      if (status !== task.status) {
        await handleStatusChange(task.id, status);
      }
    };

    return (
      <div className="relative inline-block" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1 px-2 py-1 rounded ${
            task.status === 'Completed' ? 'bg-green-100' :
            task.status === 'In Progress' ? 'bg-blue-100' :
            'bg-red-100'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${
            task.status === 'Completed' ? 'bg-green-500' :
            task.status === 'In Progress' ? 'bg-blue-500' :
            'bg-red-500'
          }`}></span>
          <span className={`text-sm font-medium ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-32">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={(e) => handleOptionClick(e, status)}
                className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 ${
                  status === task.status ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    status === 'Completed' ? 'bg-green-500' :
                    status === 'In Progress' ? 'bg-blue-500' :
                    'bg-red-500'
                  }`}></span>
                  {status}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        await fetchTasks();
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setIsLoading(false);
        // Simulate stats loading with a slight delay for better UX
        setTimeout(() => setIsLoadingStats(false), 500);
      }
    };

    loadDashboard();
  }, [fetchTasks]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold flex items-center gap-2">
            Welcome back, {currentUser?.displayName || currentUser?.email?.split('@')[0]} <span className="text-2xl">👋</span>
          </h1>
          <div className="flex items-center gap-2">
            {/* Team members avatars */}
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <img
                  key={i}
                  src={`https://placehold.co/32x32`}
                  alt={`Team member ${i}`}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ))}
            </div>
            <button 
              onClick={() => setIsInviteModalOpen(true)}
              className="px-4 py-2 text-[#FF5C5C] bg-white rounded-lg border border-[#FF5C5C] hover:bg-[#FF5C5C] hover:text-white transition-colors"
            >
              + Invite
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">📝</span>
                <h2 className="text-lg font-medium">To-Do</h2>
              </div>
              <button 
                onClick={() => setIsAddTaskModalOpen(true)}
                className="text-[#FF5C5C] hover:underline text-sm"
              >
                + Add task
              </button>
            </div>

            <div className="space-y-4">
              {activeTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/task/${task.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium truncate">{task.title}</h3>
                        <TaskStatusDropdown task={task} />
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Priority:</span>
                          <span className={`flex items-center gap-1 font-medium ${getPriorityColor(task.priority)}`}>
                            <span className={`w-2 h-2 rounded-full ${
                              task.priority === 'Extreme' ? 'bg-red-500' :
                              task.priority === 'Moderate' ? 'bg-blue-500' :
                              'bg-green-500'
                            }`}></span>
                            {task.priority}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Created on:</span>
                          <span className="text-gray-700">
                            {new Date(task.createdOn).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <img src={task.image} alt="" className="w-16 h-16 rounded-lg ml-4 flex-shrink-0" />
                  </div>
                </div>
              ))}
              {activeTasks.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No active tasks. Click "Add task" to create one!
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Task Status */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-6">Task Status</h2>
              <div className="grid grid-cols-3 gap-4">
                {isLoadingStats ? (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="text-center">
                        <LoadingSkeleton lines={2} />
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="relative inline-block">
                        <svg className="w-20 sm:w-24 h-20 sm:h-24 transform -rotate-90">
                          <circle
                            className="text-gray-200"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="48"
                            cy="48"
                          />
                          <circle
                            className="text-green-500"
                            strokeWidth="8"
                            strokeDasharray={251.2}
                            strokeDashoffset={251.2 - (251.2 * taskStatusData.completed) / 100}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="48"
                            cy="48"
                          />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <span className="text-lg sm:text-xl font-semibold">{taskStatusData.completed}%</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm">Completed</p>
                    </div>

                    <div className="text-center">
                      <div className="relative inline-block">
                        <svg className="w-20 sm:w-24 h-20 sm:h-24 transform -rotate-90">
                          <circle
                            className="text-gray-200"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="48"
                            cy="48"
                          />
                          <circle
                            className="text-blue-500"
                            strokeWidth="8"
                            strokeDasharray={251.2}
                            strokeDashoffset={251.2 - (251.2 * taskStatusData.inProgress) / 100}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="48"
                            cy="48"
                          />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <span className="text-lg sm:text-xl font-semibold">{taskStatusData.inProgress}%</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm">In Progress</p>
                    </div>

                    <div className="text-center">
                      <div className="relative inline-block">
                        <svg className="w-20 sm:w-24 h-20 sm:h-24 transform -rotate-90">
                          <circle
                            className="text-gray-200"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="48"
                            cy="48"
                          />
                          <circle
                            className="text-red-500"
                            strokeWidth="8"
                            strokeDasharray={251.2}
                            strokeDashoffset={251.2 - (251.2 * taskStatusData.notStarted) / 100}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="48"
                            cy="48"
                          />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <span className="text-lg sm:text-xl font-semibold">{taskStatusData.notStarted}%</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm">Not Started</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-6">Completed Task</h2>
              <div className="space-y-4">
                {completedTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/task/${task.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium mb-2 truncate">{task.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Priority:</span>
                            <span className={`flex items-center gap-1 font-medium ${getPriorityColor(task.priority)}`}>
                              <span className={`w-2 h-2 rounded-full ${
                                task.priority === 'Extreme' ? 'bg-red-500' :
                                task.priority === 'Moderate' ? 'bg-blue-500' :
                                'bg-green-500'
                              }`}></span>
                              {task.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Completed on:</span>
                            <span className="text-gray-700">
                              {new Date(task.createdOn).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <img src={task.image} alt="" className="w-16 h-16 rounded-lg ml-4 flex-shrink-0" />
                    </div>
                  </div>
                ))}
                {completedTasks.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    No completed tasks yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <InviteModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
      <AddTaskModal isOpen={isAddTaskModalOpen} onClose={() => setIsAddTaskModalOpen(false)} />
    </div>
  );
};

export default Dashboard; 