import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTask } from '../../context/TaskContext'
import { useState, useEffect } from 'react'
// import searchIcon from '../../assets/Images/search.png'
// import notificationIcon from '../../assets/Images/notifi.png'
// import calendarIcon from '../../assets/Images/cal.png'
import Sidebar from './Sidebar'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname
    switch (path) {
      case '/dashboard':
        return 'Dashboard'
      case '/vital-task':
        return 'Vital Task'
      case '/my-task':
        return 'My Task'
      case '/categories':
        return 'Categories'
      case '/settings':
        return 'Settings'
      case '/help':
        return 'Help Center'
      default:
        return 'Dashboard'
    }
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [navigate])

  // Handle mobile menu toggle
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    // Prevent body scroll when mobile menu is open
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'auto'
  }

  // Handle mobile menu close
  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false)
    document.body.style.overflow = 'auto'
  }

  return (
    <header className="bg-white border-b h-[57px]">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <button 
            className="lg:hidden"
            onClick={handleMobileMenuToggle}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold">
            <span className="text-[#FF5C5C]">{getPageTitle()}</span>
          </h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search your task here..."
              className="w-full bg-gray-100 rounded-lg pl-4 pr-10 py-2 focus:outline-none"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar - Fixed Position */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={handleMobileMenuClose}
          ></div>
          
          {/* Mobile Sidebar */}
          <aside className="fixed inset-y-0 left-0 w-64 bg-[#FF5C5C]">
            <div className="h-full relative">
              {/* Close button - Now with white background */}
              <button
                onClick={handleMobileMenuClose}
                className="absolute top-3 right-3 p-1.5 bg-white rounded-lg z-10 hover:bg-gray-100"
              >
                <svg className="w-5 h-5 text-[#FF5C5C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Render the Sidebar component */}
              <div className="h-full overflow-y-auto">
                <Sidebar isMobile={true} onClose={handleMobileMenuClose} />
              </div>
            </div>
          </aside>
        </div>
      )}
    </header>
  )
}

export default Header 