function TaskCard({ task }) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
          />
          <div>
            <h3 className="font-medium text-gray-900">{task.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{task.description}</p>
          </div>
        </div>
        <img
          src={task.image}
          alt={task.title}
          className="w-16 h-16 rounded-lg object-cover"
        />
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-500">
          Priority: <span className="text-pink-500">{task.priority}</span>
        </span>
        <span className="text-sm text-gray-500">{task.dueDate}</span>
      </div>
    </div>
  )
}

export default TaskCard 