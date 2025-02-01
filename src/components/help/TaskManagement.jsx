import React from 'react'

const TaskManagement = () => {
  const taskCategories = [
    {
      title: "Daily Tasks",
      description: "Regular day-to-day activities",
      examples: ["Team meetings", "Email responses", "Daily reports", "Check-ins"]
    },
    {
      title: "Project Tasks",
      description: "Specific project-related activities",
      examples: ["Project milestones", "Deliverables", "Client meetings", "Documentation"]
    },
    {
      title: "Personal Tasks",
      description: "Personal to-dos and reminders",
      examples: ["Learning goals", "Personal appointments", "Health tasks", "Self-development"]
    },
    {
      title: "Urgent Tasks",
      description: "Time-sensitive activities",
      examples: ["Critical bugs", "Emergency meetings", "Deadline tasks", "Priority updates"]
    }
  ]

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Task Management Guide</h2>
      
      <div className="space-y-8">
        {/* Task Categories */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Task Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taskCategories.map((category, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium text-[#FF5C5C] mb-2">{category.title}</h4>
                <p className="text-gray-600 mb-3">{category.description}</p>
                <div className="bg-gray-50 p-3 rounded">
                  <h5 className="text-sm font-medium mb-2">Common Examples:</h5>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {category.examples.map((example, i) => (
                      <li key={i}>{example}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Task Management Tips */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Best Practices</h3>
          <div className="space-y-4">
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium mb-2">1. Prioritize Your Tasks</h4>
              <p className="text-gray-600">Use the priority flags (High, Medium, Low) to organize tasks by importance.</p>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
                <li>• High Priority: Urgent and important tasks</li>
                <li>• Medium Priority: Important but not urgent</li>
                <li>• Low Priority: Tasks that can wait</li>
              </ul>
            </div>
            
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium mb-2">2. Set Clear Deadlines</h4>
              <p className="text-gray-600">Always set realistic deadlines and use reminders to stay on track.</p>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
                <li>• Use the calendar view for better planning</li>
                <li>• Set reminders before deadlines</li>
                <li>• Break down large tasks into smaller deadlines</li>
              </ul>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium mb-2">3. Track Progress</h4>
              <p className="text-gray-600">Regularly update task status and track completion.</p>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
                <li>• Update task status regularly</li>
                <li>• Use progress indicators</li>
                <li>• Review completed tasks weekly</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Quick Tips */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Tips</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#FF5C5C] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Start your day by reviewing and organizing tasks
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#FF5C5C] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Use tags to categorize related tasks
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#FF5C5C] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Break down complex tasks into smaller subtasks
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#FF5C5C] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Regularly clean up completed tasks
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}

export default TaskManagement 