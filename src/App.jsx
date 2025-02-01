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

function App() {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <Toaster position="top-right" />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />

            {/* Protected Routes */}
            <Route path="/" element={
              <PrivateRoute>
                <RootLayout />
              </PrivateRoute>
            }>
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
          </Routes>
        </TaskProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
