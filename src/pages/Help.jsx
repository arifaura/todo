import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HelpSection = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
    {children}
  </div>
);

const Help = () => {
  const [activeTab, setActiveTab] = useState('getting-started');
  const navigate = useNavigate();

  const tabs = [
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'tasks', label: 'Managing Tasks' },
    { id: 'categories', label: 'Categories' },
    { id: 'vital-tasks', label: 'Vital Tasks' },
    { id: 'features', label: 'Key Features' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Center</h1>
        <p className="text-gray-600">Learn how to use Task Manager effectively and boost your productivity.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-[#FF5C5C] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {activeTab === 'getting-started' && (
          <HelpSection title="Getting Started">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Task Manager</h3>
                <p className="text-gray-600 mb-4">
                  Task Manager helps you organize and track your tasks efficiently. Here's how to get started:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-gray-600">
                  <li><span className="font-medium">Create an account</span> - Sign up using your email or Google account</li>
                  <li><span className="font-medium">Set up your profile</span> - Add your name and customize your settings</li>
                  <li><span className="font-medium">Create categories</span> - Organize your tasks by creating relevant categories</li>
                  <li><span className="font-medium">Add your first task</span> - Click the "Add Task" button to create your first task</li>
                </ol>
              </div>
            </div>
          </HelpSection>
        )}

        {activeTab === 'tasks' && (
          <HelpSection title="Managing Tasks">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Creating Tasks</h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-600 mb-2">To create a new task:</p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600">
                    <li>Click the "Add Task" button in the dashboard</li>
                    <li>Fill in the task details:
                      <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                        <li>Title and description</li>
                        <li>Start and end dates</li>
                        <li>Priority level (Low, Moderate, Extreme)</li>
                        <li>Category (optional)</li>
                        <li>Additional notes (optional)</li>
                      </ul>
                    </li>
                    <li>Click "Create Task" to save</li>
                  </ol>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Task Status Management</h3>
                <p className="text-gray-600 mb-3">Tasks can have three status types:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="font-medium">Not Started</span>
                    </div>
                    <p className="text-sm text-gray-600">Tasks that haven't been initiated yet</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="font-medium">In Progress</span>
                    </div>
                    <p className="text-sm text-gray-600">Tasks currently being worked on</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="font-medium">Completed</span>
                    </div>
                    <p className="text-sm text-gray-600">Tasks that have been finished</p>
                  </div>
                </div>
              </div>
            </div>
          </HelpSection>
        )}

        {activeTab === 'categories' && (
          <HelpSection title="Categories">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Managing Categories</h3>
                <p className="text-gray-600 mb-4">
                  Categories help you organize tasks by different areas or projects. Here's how to use them:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Creating Categories</h4>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600">
                      <li>Navigate to the Categories page</li>
                      <li>Click "Add Category"</li>
                      <li>Enter category name and description</li>
                      <li>Choose a color for visual identification</li>
                      <li>Save the category</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Category Best Practices</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Create categories for different projects or areas of work</li>
                      <li>Use distinct colors for easy visual recognition</li>
                      <li>Keep category names short and clear</li>
                      <li>Review and update categories periodically</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </HelpSection>
        )}

        {activeTab === 'vital-tasks' && (
          <HelpSection title="Vital Tasks">
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-medium text-orange-800 mb-2">What are Vital Tasks?</h3>
                <p className="text-orange-700">
                  Vital tasks are high-priority tasks that require immediate attention. A task becomes vital when:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-orange-700">
                  <li>It has "Extreme" priority level</li>
                  <li>The deadline is within 3 days</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Managing Vital Tasks</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 mb-3">Vital tasks are automatically identified and can be managed through:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>The Vital Tasks dashboard section</li>
                    <li>Priority notifications and alerts</li>
                    <li>Special visual indicators in task lists</li>
                  </ul>
                </div>
              </div>
            </div>
          </HelpSection>
        )}

        {activeTab === 'features' && (
          <HelpSection title="Key Features">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Task Management</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Create, edit, and delete tasks</li>
                  <li>• Set priorities and deadlines</li>
                  <li>• Track task progress</li>
                  <li>• Add task descriptions and notes</li>
                  <li>• Attach images to tasks</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Organization</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Create custom categories</li>
                  <li>• Filter and sort tasks</li>
                  <li>• Group tasks by status</li>
                  <li>• Search functionality</li>
                  <li>• Task statistics and overview</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Collaboration</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Share tasks with team members</li>
                  <li>• Task comments and updates</li>
                  <li>• Team member assignments</li>
                  <li>• Activity tracking</li>
                  <li>• Real-time updates</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Productivity Tools</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Task prioritization</li>
                  <li>• Deadline tracking</li>
                  <li>• Progress monitoring</li>
                  <li>• Performance analytics</li>
                  <li>• Custom notifications</li>
                </ul>
              </div>
            </div>
          </HelpSection>
        )}

        {activeTab === 'faq' && (
          <HelpSection title="Frequently Asked Questions">
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">How do I create a vital task?</h3>
                  <p className="text-gray-600">
                    A task becomes vital automatically when you set its priority to "Extreme" and the deadline is within 3 days.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Can I change task categories after creation?</h3>
                  <p className="text-gray-600">
                    Yes, you can edit a task's category at any time by editing the task details.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">How do I track task progress?</h3>
                  <p className="text-gray-600">
                    You can update task status (Not Started, In Progress, Completed) and view progress in the dashboard.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">What happens to completed tasks?</h3>
                  <p className="text-gray-600">
                    Completed tasks are archived but still viewable in your task history and can be filtered in the task list.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Can I set recurring tasks?</h3>
                  <p className="text-gray-600">
                    Currently, you need to create individual tasks for recurring events. We're working on adding recurring task functionality.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mt-6">
                <h3 className="font-medium text-blue-900 mb-2">Need More Help?</h3>
                <p className="text-blue-700">
                  If you can't find the answer you're looking for, feel free to contact our support team or check our detailed documentation.
                </p>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => navigate('/contact')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Contact Support
                  </button>
                  <button
                    onClick={() => window.open('/docs', '_blank')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Documentation
                  </button>
                </div>
              </div>
            </div>
          </HelpSection>
        )}
      </div>
    </div>
  );
};

export default Help; 