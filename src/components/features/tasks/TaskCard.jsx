const TaskCard = ({ title, priority, dueDate, status }) => {
  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800"
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs ${priorityColors[priority]}`}>
          {priority}
        </span>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>{dueDate}</span>
        <span>{status}</span>
      </div>
    </div>
  )
}

export default TaskCard 