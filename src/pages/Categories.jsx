import React, { useEffect, useState } from 'react';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { OnboardingService } from '../services/OnboardingService';
import 'driver.js/dist/driver.css';
import AddCategoryModal from '../components/modals/AddCategoryModal';
import toast from 'react-hot-toast';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

const CustomAlert = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl transform transition-all">
        <div className="mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 text-center mb-2">{title}</h3>
          <p className="text-sm text-gray-500 text-center">{message}</p>
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const CategorySkeleton = () => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm animate-pulse">
    <div className="flex justify-between items-start">
      <div className="w-full">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="h-6 w-6 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const Categories = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', color: '#FF5C5C', description: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteAlert, setDeleteAlert] = useState({ isOpen: false, categoryId: null });

  const tasks = {
    daily: [
      { id: 1, title: 'Team Stand-up Meeting', status: 'pending', time: '10:00 AM' },
      { id: 2, title: 'Daily Report Submission', status: 'completed', time: '5:00 PM' },
      { id: 3, title: 'Email Follow-ups', status: 'pending', time: '2:00 PM' }
    ],
    project: [
      { id: 4, title: 'Project Planning Session', status: 'pending', time: 'Tomorrow' },
      { id: 5, title: 'Client Presentation', status: 'completed', time: 'Next Week' },
      { id: 6, title: 'Sprint Review', status: 'pending', time: 'Friday' }
    ],
    personal: [
      { id: 7, title: 'Gym Session', status: 'pending', time: '7:00 AM' },
      { id: 8, title: 'Reading Goal', status: 'pending', time: '8:00 PM' },
      { id: 9, title: 'Learning React', status: 'completed', time: '9:00 PM' }
    ],
    urgent: [
      { id: 10, title: 'Critical Bug Fix', status: 'pending', time: 'ASAP' },
      { id: 11, title: 'Emergency Meeting', status: 'completed', time: '1:00 PM' },
      { id: 12, title: 'Deadline Task', status: 'pending', time: 'Today' }
    ]
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowAddModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      toast.success('Category deleted successfully!');
      fetchCategories();
      setDeleteAlert({ isOpen: false, categoryId: null });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const handleAddCategory = async (categoryData) => {
    try {
      const newCategoryData = {
        ...categoryData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        taskCount: 0
      };

      await addDoc(collection(db, 'categories'), newCategoryData);
      toast.success('Category added successfully!');
      setShowAddModal(false);
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  // Initialize loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Initialize onboarding tour
  useEffect(() => {
    let mounted = true;

    const initTour = async () => {
      if (mounted && currentUser && !loading) {
        try {
          await OnboardingService.checkAndStartTour(currentUser.uid, 'categories');
        } catch (error) {
          console.error('Error starting tour:', error);
        }
      }
    };

    initTour();

    return () => {
      mounted = false;
    };
  }, [currentUser, loading]);

  useEffect(() => {
    fetchCategories();
  }, [currentUser]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const q = query(
        collection(db, 'categories'),
        where('userId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const categoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#FF5C5C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="categories-header mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
              <p className="text-gray-600 mt-1">Organize and manage your tasks by categories</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="add-category-btn px-4 py-2 bg-[#FF5C5C] text-white rounded-lg hover:bg-[#ff4444] transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Category
            </button>
          </div>
        </div>

        {/* Category Cards */}
        <div className="categories-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isLoading ? (
            <>
              <CategorySkeleton />
              <CategorySkeleton />
              <CategorySkeleton />
              <CategorySkeleton />
            </>
          ) : categories.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-100 rounded-full p-4 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No categories yet</h3>
              <p className="text-sm text-gray-500 mb-4">Create categories to organize your tasks better</p>
              <button
                onClick={() => setIsAdding(true)}
                className="text-[#FF5C5C] text-sm hover:underline focus:outline-none"
              >
                + Add your first category
              </button>
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="category-stats bg-white rounded-lg p-6 shadow-sm"
                style={{ borderLeft: `4px solid ${category.color}` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                  </div>
                  <div className="category-actions flex items-center gap-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-1 hover:bg-gray-100 rounded-lg text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-1 hover:bg-red-50 rounded-lg text-red-500"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="category-tasks space-y-4">
                  {tasks[category.id]?.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-600 truncate flex-1">{task.title}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Category Modal */}
        <AddCategoryModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddCategory}
          editingCategory={editingCategory}
        />
      </div>
    </div>
  );
};

export default Categories; 