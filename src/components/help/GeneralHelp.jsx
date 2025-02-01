import React from 'react'

const GeneralHelp = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Getting Started with Task Manager</h2>
      
      <div className="space-y-8">
        {/* Quick Start Guide */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Start Guide</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#FF5C5C] text-white font-medium">1</span>
              <div className="ml-4">
                <h4 className="font-medium">Create Your Account</h4>
                <p className="text-gray-600">Sign up with your email or log in if you already have an account.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#FF5C5C] text-white font-medium">2</span>
              <div className="ml-4">
                <h4 className="font-medium">Set Up Your Profile</h4>
                <p className="text-gray-600">Add your personal information and customize your preferences.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#FF5C5C] text-white font-medium">3</span>
              <div className="ml-4">
                <h4 className="font-medium">Create Your First Task</h4>
                <p className="text-gray-600">Click the "Add Task" button to create and manage your tasks.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Task Organization</h4>
              <p className="text-gray-600">Organize tasks by priority, due date, and categories.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Progress Tracking</h4>
              <p className="text-gray-600">Monitor task completion and track your productivity.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Team Collaboration</h4>
              <p className="text-gray-600">Share tasks and work together with team members.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Notifications</h4>
              <p className="text-gray-600">Get reminders for upcoming and overdue tasks.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">How do I reset my password?</h4>
              <p className="text-gray-600">Go to Settings > Change Password and follow the instructions to update your password.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Can I share tasks with others?</h4>
              <p className="text-gray-600">Yes, you can share tasks by using the share button on any task and entering the email of your team member.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">How do I set task priorities?</h4>
              <p className="text-gray-600">When creating or editing a task, use the priority dropdown to select High, Medium, or Low priority.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default GeneralHelp 