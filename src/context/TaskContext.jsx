import React, { createContext, useContext, useState, useEffect } from 'react'
import { db } from '../config/firebase'
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { useAuth } from './AuthContext'

const TaskContext = createContext()

export const useTask = () => {
  return useContext(TaskContext)
}

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const { currentUser } = useAuth()

  // Fetch tasks for the current user
  useEffect(() => {
    const fetchTasks = async () => {
      if (!currentUser) {
        setTasks([])
        setLoading(false)
        return
      }

      try {
        const q = query(
          collection(db, 'tasks'),
          where('userId', '==', currentUser.uid)
        )
        const querySnapshot = await getDocs(q)
        const taskList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setTasks(taskList)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [currentUser])

  // Add a new task
  const addTask = async (taskData) => {
    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...taskData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString()
      })
      const newTask = { id: docRef.id, ...taskData }
      setTasks(prev => [...prev, newTask])
      return newTask
    } catch (error) {
      console.error('Error adding task:', error)
      throw error
    }
  }

  // Update a task
  const updateTask = async (taskId, taskData) => {
    try {
      const taskRef = doc(db, 'tasks', taskId)
      await updateDoc(taskRef, taskData)
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...taskData } : task
      ))
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId))
      setTasks(prev => prev.filter(task => task.id !== taskId))
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }

  const value = {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask
  }

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
}

export default TaskContext 