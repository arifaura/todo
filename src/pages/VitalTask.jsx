import React, { useEffect, useState } from 'react';
import { useTask } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { OnboardingService } from '../services/OnboardingService';
import 'driver.js/dist/driver.css';

const VitalTask = () => {
  const { tasks } = useTask();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Get vital tasks (Extreme priority tasks that are due within 3 days or overdue)
  const vitalTasks = tasks.filter(task => {
    const dueDate = new Date(task.endDate);
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);
    
    return (
      task.priority === 'Extreme' && 
      dueDate <= threeDaysFromNow &&
      task.status !== 'Completed'
    );
  }).sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

  // Group tasks by their due date status
  const groupedTasks = {
    overdue: [],
    dueToday: [],
    upcoming: []
  };

  vitalTasks.forEach(task => {
    const dueDate = new Date(task.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dueDate < today) {
      groupedTasks.overdue.push(task);
    } else if (dueDate.toDateString() === today.toDateString()) {
      groupedTasks.dueToday.push(task);
    } else {
      groupedTasks.upcoming.push(task);
    }
  });

  // Initialize loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Initialize onboarding tour
  useEffect(() => {
    let mounted = true;

    const initTour = async () => {
      if (mounted && currentUser && !isLoading) {
        try {
          await OnboardingService.checkAndStartTour(currentUser.uid, 'vitalTask');
        } catch (error) {
          console.error('Error starting tour:', error);
        }
      }
    };

    initTour();

    return () => {
      mounted = false;
    };
  }, [currentUser, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#FF5C5C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 lg:px-6 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="vital-task-header text-center space-y-3">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
            Vital Tasks
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            High-priority tasks that require immediate attention. These are extreme priority tasks due within 3 days.
          </p>
        </div>

        {/* Stats */}
        <div className="vital-stats grid grid-cols-3 gap-4">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-red-500 font-semibold">Overdue</div>
            <div className="text-2xl font-bold">{groupedTasks.overdue.length}</div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-orange-500 font-semibold">Due Today</div>
            <div className="text-2xl font-bold">{groupedTasks.dueToday.length}</div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-blue-500 font-semibold">Coming Up</div>
            <div className="text-2xl font-bold">{groupedTasks.upcoming.length}</div>
          </div>
        </div>

        {/* Task Sections */}
        <div className="vital-task-list space-y-8">
          {/* Overdue Tasks */}
          {groupedTasks.overdue.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-red-500">Overdue Tasks</h2>
              <div className="space-y-3">
                {groupedTasks.overdue.map(task => (
                  <div
                    key={task.id}
                    onClick={() => navigate(`/task/${task.id}`)}
                    className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20 cursor-pointer hover:bg-white/70 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                        {new Date(task.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Due Today Tasks */}
          {groupedTasks.dueToday.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-orange-500">Due Today</h2>
              <div className="space-y-3">
                {groupedTasks.dueToday.map(task => (
                  <div
                    key={task.id}
                    onClick={() => navigate(`/task/${task.id}`)}
                    className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20 cursor-pointer hover:bg-white/70 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                        Today
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Tasks */}
          {groupedTasks.upcoming.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-500">Coming Up</h2>
              <div className="space-y-3">
                {groupedTasks.upcoming.map(task => (
                  <div
                    key={task.id}
                    onClick={() => navigate(`/task/${task.id}`)}
                    className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20 cursor-pointer hover:bg-white/70 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {new Date(task.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Tasks Message */}
          {vitalTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No vital tasks</h3>
              <p className="text-gray-500 mt-1">You're all caught up! No extreme priority tasks due soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VitalTask; 