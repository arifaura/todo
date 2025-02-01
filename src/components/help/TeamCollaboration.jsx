import React from 'react'

const TeamCollaboration = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Team Collaboration Guide</h2>
      
      <div className="space-y-8">
        {/* Collaboration Features */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Collaboration Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-[#FF5C5C] mb-2">Task Sharing</h4>
              <p className="text-gray-600 mb-3">Share tasks with team members and track progress together.</p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>Assign tasks to team members</li>
                <li>Set shared deadlines</li>
                <li>Track team progress</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-[#FF5C5C] mb-2">Team Communication</h4>
              <p className="text-gray-600 mb-3">Built-in communication tools for effective collaboration.</p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>Task comments</li>
                <li>Team chat</li>
                <li>Status updates</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-[#FF5C5C] mb-2">Project Overview</h4>
              <p className="text-gray-600 mb-3">Get a clear view of team projects and progress.</p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>Project dashboards</li>
                <li>Team workload view</li>
                <li>Progress reports</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-[#FF5C5C] mb-2">File Sharing</h4>
              <p className="text-gray-600 mb-3">Share and manage task-related files.</p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>Attach files to tasks</li>
                <li>Share documents</li>
                <li>Version control</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Team Roles */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Team Roles & Permissions</h3>
          <div className="space-y-4">
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium mb-2">Team Admin</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Manage team members</li>
                <li>• Set team permissions</li>
                <li>• Create team projects</li>
                <li>• Generate team reports</li>
              </ul>
            </div>
            
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium mb-2">Team Member</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• View assigned tasks</li>
                <li>• Update task status</li>
                <li>• Communicate with team</li>
                <li>• Share task files</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Collaboration Best Practices</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">1. Clear Communication</h4>
                <p className="text-gray-600">Keep team communication clear and organized:</p>
                <ul className="mt-2 space-y-1 text-sm text-gray-600 ml-4">
                  <li>• Use task comments for task-specific discussions</li>
                  <li>• Update task status regularly</li>
                  <li>• Share progress updates with the team</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">2. Task Organization</h4>
                <p className="text-gray-600">Maintain organized team workflows:</p>
                <ul className="mt-2 space-y-1 text-sm text-gray-600 ml-4">
                  <li>• Use consistent task naming conventions</li>
                  <li>• Organize tasks by projects or departments</li>
                  <li>• Set clear deadlines and priorities</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">3. Regular Updates</h4>
                <p className="text-gray-600">Keep everyone in sync:</p>
                <ul className="mt-2 space-y-1 text-sm text-gray-600 ml-4">
                  <li>• Schedule regular team check-ins</li>
                  <li>• Review team progress weekly</li>
                  <li>• Address blockers promptly</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default TeamCollaboration 