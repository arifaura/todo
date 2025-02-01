import TaskCard from '../components/features/tasks/TaskCard'

function Home() {
  const tasks = [
    {
      title: "Complete UI Design",
      priority: "high",
      dueDate: "2024-01-30",
      status: "In Progress"
    },
    // Add more tasks as needed
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">
        Task Manager
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task, index) => (
          <TaskCard key={index} {...task} />
        ))}
      </div>
    </div>
  )
}

export default Home 