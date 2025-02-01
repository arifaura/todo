import React, { useState } from 'react'

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)

  const faqs = [
    {
      id: 1,
      category: "Getting Started",
      question: "How do I get started with Task Manager?",
      answer: "Getting started is easy! First, create your account using email or social login. Then, customize your profile and preferences. You can start creating tasks right away by clicking the '+ Add Task' button on your dashboard. We recommend starting with a simple task to get familiar with the interface."
    },
    {
      id: 2,
      category: "Task Management",
      question: "How do I organize my tasks effectively?",
      answer: "There are several ways to organize your tasks: 1) Use categories to group similar tasks, 2) Set priority levels (High, Medium, Low) to focus on what's important, 3) Use due dates to manage deadlines, 4) Create subtasks for complex projects, and 5) Use tags to filter and find tasks quickly. You can also use the drag-and-drop feature to reorder tasks within your lists."
    },
    {
      id: 3,
      category: "Task Management",
      question: "Can I set recurring tasks?",
      answer: "Yes! When creating or editing a task, check the 'Recurring' option. You can set tasks to repeat daily, weekly, monthly, or custom intervals. You can also specify an end date for the recurring series or let it continue indefinitely. The system will automatically create new instances of the task based on your settings."
    },
    {
      id: 4,
      category: "Collaboration",
      question: "How do I share tasks with team members?",
      answer: "Sharing tasks is simple: 1) Open the task you want to share, 2) Click the 'Share' button, 3) Enter your team member's email or select from your team list, 4) Choose their permission level (view or edit), and 5) Click 'Send Invite'. Team members will receive a notification and can start collaborating immediately."
    },
    {
      id: 5,
      category: "Notifications",
      question: "How do I customize my notification settings?",
      answer: "Go to Settings > Notifications to customize your preferences. You can set up: 1) Email notifications for task assignments and deadlines, 2) Push notifications for updates and reminders, 3) Daily or weekly digest emails, and 4) Custom notification times. You can also mute notifications for specific projects or time periods."
    },
    {
      id: 6,
      category: "Account Management",
      question: "How do I change my password or update account information?",
      answer: "To manage your account: 1) Click your profile picture, 2) Select 'Settings', 3) Navigate to 'Account Settings'. Here you can: change your password, update email, modify personal information, and manage connected social accounts. For security, you'll need to verify your current password for sensitive changes."
    },
    {
      id: 7,
      category: "Mobile Access",
      question: "Can I access Task Manager on my mobile device?",
      answer: "Yes! Task Manager is fully accessible on mobile devices through: 1) Our responsive web interface that works on any mobile browser, 2) Our dedicated mobile apps for iOS and Android (available on App Store and Google Play). All your tasks sync automatically across devices, and you can work offline with automatic syncing when you're back online."
    },
    {
      id: 8,
      category: "Data & Security",
      question: "How secure is my data and how are backups handled?",
      answer: "We take security seriously! Your data is: 1) Encrypted in transit and at rest, 2) Backed up automatically every hour, 3) Stored in multiple secure locations. We use industry-standard security protocols and regular security audits. You can also enable two-factor authentication for additional security and export your data anytime."
    }
  ]

  const quickGuides = [
    {
      title: "Getting Started",
      icon: "🚀",
      description: "Learn the basics of Task Manager",
      link: "#"
    },
    {
      title: "Task Management",
      icon: "📝",
      description: "Master task creation and organization",
      link: "#"
    },
    {
      title: "Team Collaboration",
      icon: "👥",
      description: "Work effectively with your team",
      link: "#"
    },
    {
      title: "Productivity Tips",
      icon: "⚡",
      description: "Boost your productivity",
      link: "#"
    }
  ]

  const supportOptions = [
    {
      icon: "💬",
      title: "Live Chat",
      description: "Chat with our support team",
      action: "Start Chat",
      available: true
    },
    {
      icon: "📧",
      title: "Email Support",
      description: "Get help via email",
      action: "Send Email",
      available: true
    },
    {
      icon: "📞",
      title: "Phone Support",
      description: "Talk to a representative",
      action: "Call Now",
      available: false
    }
  ]

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group FAQs by category
  const groupedFaqs = filteredFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = []
    }
    acc[faq.category].push(faq)
    return acc
  }, {})

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Help Center</h2>
        <p className="text-gray-600 mt-2">Find answers to common questions and learn how to use Task Manager effectively</p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5C5C] focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* FAQs by Category */}
      <div className="space-y-8">
        {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
          <div key={category} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 p-4 border-b border-gray-200 bg-gray-50">
              {category}
            </h3>
            <div className="divide-y divide-gray-200">
              {categoryFaqs.map((faq) => (
                <div key={faq.id} className="p-4">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full text-left group focus:outline-none"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-base font-medium text-gray-900 group-hover:text-[#FF5C5C]">
                        {faq.question}
                      </h4>
                      <svg
                        className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                          expandedFaq === faq.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="mt-4 text-gray-600 text-sm leading-relaxed">
                      {faq.answer.split(', ').map((point, index) => (
                        <p key={index} className="mb-2">{point}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <div className="mt-12 text-center bg-gray-50 rounded-lg p-8 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Still need help?</h3>
        <p className="text-gray-600 mb-6">Our support team is here to assist you</p>
        <button className="inline-flex items-center px-6 py-3 bg-[#FF5C5C] text-white rounded-lg hover:bg-[#ff4444] transition-colors duration-200">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Contact Support
        </button>
      </div>
    </div>
  )
}

export default Help 