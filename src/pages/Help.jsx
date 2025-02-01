import React from 'react'

const Help = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Help Center</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          {/* FAQ Section */}
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">How do I create a new task?</h3>
                <p className="text-gray-600">Click the "+" button in the dashboard or task list view to create a new task. Fill in the required details and click "Save".</p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">How do I mark a task as complete?</h3>
                <p className="text-gray-600">Click the checkbox next to any task to mark it as complete. You can also uncheck it to mark it as incomplete.</p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">How do I organize tasks into categories?</h3>
                <p className="text-gray-600">When creating or editing a task, you can select a category from the dropdown menu. You can also create new categories in the Categories section.</p>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">Need More Help?</h2>
            <p className="text-gray-600 mb-4">If you can't find the answer you're looking for, our support team is here to help.</p>
            <button className="bg-[#FF5C5C] text-white px-4 py-2 rounded-lg hover:bg-[#FF4444] transition-colors duration-200">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Help 