import { useTask } from '../../context/TaskContext'

function TaskStats() {
  const { taskStats } = useTask()

  return (
    <div className="bg-white rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-6">Task Status</h2>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Completed</span>
            <span className="text-sm font-medium">{taskStats.completed}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${taskStats.completed}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">In Progress</span>
            <span className="text-sm font-medium">{taskStats.inProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${taskStats.inProgress}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Not Started</span>
            <span className="text-sm font-medium">{taskStats.notStarted}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full" 
              style={{ width: `${taskStats.notStarted}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskStats 