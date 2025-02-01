import React from 'react';
import { useTask } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';

const VitalTask = () => {
  const { tasks } = useTask();
  const navigate = useNavigate();

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

  const TaskCard = ({ task }) => {
    const dueDate = new Date(task.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let dueDateText = '';
    let dueDateColor = '';
    let bgGradient = '';
    
    if (dueDate < today) {
      const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
      dueDateText = `${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue`;
      dueDateColor = 'text-red-500';
      bgGradient = 'bg-gradient-to-r from-red-50 to-transparent';
    } else if (dueDate.toDateString() === today.toDateString()) {
      dueDateText = 'Due today';
      dueDateColor = 'text-orange-500';
      bgGradient = 'bg-gradient-to-r from-orange-50 to-transparent';
    } else {
      const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      dueDateText = `Due in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`;
      dueDateColor = 'text-blue-500';
      bgGradient = 'bg-gradient-to-r from-blue-50 to-transparent';
    }

    const startDate = new Date(task.startDate);
    const timeRange = `${startDate.toLocaleDateString()} ${task.startTime || '00:00'} - ${dueDate.toLocaleDateString()} ${task.endTime || '23:59'}`;

    return (
      <div 
        className={`rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] backdrop-blur-sm ${bgGradient} border border-white/20`}
        onClick={() => navigate(`/task/${task.id}`)}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium text-lg truncate">{task.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${dueDateColor} ${bgGradient.replace('50', '100')} ml-2`}>
                {dueDateText}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  task.status === 'Not Started' ? 'bg-red-500' :
                  task.status === 'In Progress' ? 'bg-blue-500' :
                  'bg-green-500'
                }`} />
                <span className="text-gray-700 font-medium">
                  {task.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600">{timeRange}</span>
              </div>
            </div>
          </div>
          {task.image && (
            <div className="relative">
              <img 
                src={task.image} 
                alt="" 
                className="w-20 h-20 rounded-lg object-cover shadow-md" 
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}
        </div>
      </div>
    );
  };

  const TaskSection = ({ title, tasks, color, icon }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full ${color} bg-opacity-20 flex items-center justify-center`}>
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          <span className="text-sm text-gray-500">({tasks.length})</span>
        </div>
      </div>
      <div className="space-y-4">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 lg:px-6 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
            Vital Tasks
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            High-priority tasks that require immediate attention. These are extreme priority tasks due within 3 days.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
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
        <div className="space-y-8">
          {groupedTasks.overdue.length > 0 && (
            <TaskSection 
              title="Overdue" 
              tasks={groupedTasks.overdue} 
              color="bg-red-500"
              icon="⚠️"
            />
          )}
          
          {groupedTasks.dueToday.length > 0 && (
            <TaskSection 
              title="Due Today" 
              tasks={groupedTasks.dueToday} 
              color="bg-orange-500"
              icon="📅"
            />
          )}
          
          {groupedTasks.upcoming.length > 0 && (
            <TaskSection 
              title="Coming Up" 
              tasks={groupedTasks.upcoming} 
              color="bg-blue-500"
              icon="🔜"
            />
          )}

          {vitalTasks.length === 0 && (
            <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <p className="text-gray-600 font-medium">No vital tasks at the moment</p>
              <p className="text-sm text-gray-500 mt-1">
                Vital tasks are extreme priority tasks due within 3 days
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VitalTask; 