import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Sidebar = ({ isMobile = false, onClose }) => {
  const { currentUser, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* White strip for profile image */}
      <div className="h-12 bg-white"></div>

      {/* User Profile Section */}
      <div className="bg-[#FF5C5C] relative">
        <div className="px-4 text-center -mt-8">
          <img
            src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.displayName || currentUser?.email || 'User')}&background=FF5C5C&color=fff`}
            alt={currentUser?.displayName || 'Profile'}
            className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-white"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.email || 'User')}&background=FF5C5C&color=fff`
            }}
          />
          <h2 className="text-base font-normal text-white mb-0.5">{currentUser?.displayName || currentUser?.email?.split('@')[0]}</h2>
          <p className="text-xs text-white/80 mb-4">{currentUser?.email}</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="px-4 mt-4">
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg mb-1 ${location.pathname === '/dashboard'
              ? 'bg-white text-[#FF5C5C]'
              : 'text-white hover:bg-white/10'
            }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-sm">Dashboard</span>
        </Link>

        <Link
          to="/vital-task"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg mb-1 ${location.pathname === '/vital-task'
              ? 'bg-white text-[#FF5C5C]'
              : 'text-white hover:bg-white/10'
            }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">Vital Task</span>
        </Link>

        <Link
          to="/my-task"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg mb-1 ${
            location.pathname === '/my-task'
              ? 'bg-white text-[#FF5C5C]'
              : 'text-white hover:bg-white/10'
          }`}
          onClick={isMobile ? onClose : undefined}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-sm">My Task</span>
        </Link>

        <Link
          to="/categories"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg mb-1 ${location.pathname === '/categories'
              ? 'bg-white text-[#FF5C5C]'
              : 'text-white hover:bg-white/10'
            }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-sm">Task Categories</span>
        </Link>

        <Link
          to="/settings"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg mb-1 ${location.pathname === '/settings'
              ? 'bg-white text-[#FF5C5C]'
              : 'text-white hover:bg-white/10'
            }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">Settings</span>
        </Link>

        <Link
          to="/help"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg mb-1 ${location.pathname === '/help'
              ? 'bg-white text-[#FF5C5C]'
              : 'text-white hover:bg-white/10'
            }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">Help</span>
        </Link>
      </div>

      {/* Logout Button */}
      <div className="mt-auto px-4 pb-4">
        <Link
          onClick={handleLogout}
          to="#"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-white/10"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-sm">Logout</span>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar