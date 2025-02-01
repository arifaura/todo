import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { db } from '../config/firebase'
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const TaskContext = createContext()

export const useTask = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider')
  }
  return context
}

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const { currentUser } = useAuth()

  // Memoize fetch tasks function
  const fetchTasks = useCallback(async () => {
    if (!currentUser) {
      setTasks([])
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', currentUser.uid)
      )
      const querySnapshot = await getDocs(q)
      const tasksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTasks(tasksData)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }, [currentUser])

  // Memoize add task function
  const addTask = useCallback(async (taskData) => {
    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...taskData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString()
      })
      const newTask = { id: docRef.id, ...taskData }
      setTasks(prev => [...prev, newTask])
      toast.success('Task added successfully!')
      return docRef.id
    } catch (error) {
      console.error('Error adding task:', error)
      toast.error('Failed to add task')
      throw error
    }
  }, [currentUser])

  // Memoize update task function
  const updateTask = useCallback(async (taskId, updates) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), updates)
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      ))
      toast.success('Task updated successfully!')
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task')
      throw error
    }
  }, [])

  // Memoize delete task function
  const deleteTask = useCallback(async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId))
      setTasks(prev => prev.filter(task => task.id !== taskId))
      toast.success('Task deleted successfully!')
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error('Failed to delete task')
      throw error
    }
  }, [])

  useEffect(() => {
    if (currentUser) {
      fetchTasks()
    }
  }, [currentUser, fetchTasks])

  // Memoize context value
  const value = useMemo(() => ({
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    fetchTasks
  }), [tasks, loading, addTask, updateTask, deleteTask, fetchTasks])

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
}

export default TaskContext 