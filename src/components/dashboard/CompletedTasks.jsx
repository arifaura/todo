import { useTask } from '../../context/TaskContext'

function CompletedTasks() {
  const { tasks } = useTask()
  const completedTasks = tasks.filter(task => task.status === 'Completed')

  return (
    <div className="bg-white rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-6">Completed Task</h2>
      <div className="space-y-4">
        {completedTasks.map(task => (
          <div key={task.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <img
                src={task.image}
                alt={task.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {task.title}
              </h4>
              <p className="text-xs text-gray-500">
                Completed 2 days ago
              </p>
            </div>
            <div className="inline-flex items-center text-sm font-medium text-green-500">
              ✓ Completed
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompletedTasks 