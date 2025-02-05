import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { TaskProvider } from './context/TaskContext'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import RootLayout from './layouts/RootLayout'
import Dashboard from './pages/Dashboard'
import VitalTask from './pages/VitalTask'
import MyTask from './pages/MyTask'
import Categories from './pages/Categories'
import Settings from './pages/Settings'
import Help from './pages/Help'
import TaskDetail from './components/TaskDetail'
import EditTaskModal from './components/EditTaskModal'
import NotFound from './pages/NotFound'
import ForgotPassword from './pages/ForgotPassword'
import { Suspense, lazy } from 'react'
import 'driver.js/dist/driver.css'

// Initial loading component
const InitialLoader = () => (
  <div className="fixed inset-0 bg-white flex items-center justify-center">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-[#FF5C5C] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">Loading your tasks...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <Toaster position="top-right" />
          <Suspense fallback={<InitialLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />


              {/* Protected Routes */}
              <Route path="/" element={<PrivateRoute><RootLayout /></PrivateRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="vital-task" element={<VitalTask />} />
                <Route path="my-task" element={<MyTask />} />
                <Route path="categories" element={<Categories />} />
                <Route path="settings" element={<Settings />} />
                <Route path="help" element={<Help />} />
                <Route path="task/:taskId" element={<TaskDetail />} />
                <Route path="task/:taskId/edit" element={<EditTaskModal />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </TaskProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
