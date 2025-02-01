import { driver } from 'driver.js';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const OnboardingService = {
  // Dashboard tour
  dashboardTour: (userDocRef) => {
    console.log('Creating dashboard tour');
    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      overlayClickNext: false,
      stagePadding: 0,
      popoverClass: 'driverjs-theme',
      steps: [
        {
          element: '.dashboard-header',
          popover: {
            title: 'Welcome to Your Dashboard',
            description: 'This is your task management hub. Get an overview of all your tasks and activities.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '.stats-overview',
          popover: {
            title: 'Task Statistics',
            description: 'Get a quick overview of your task progress, completion rates, and upcoming deadlines.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '.vital-tasks-section',
          popover: {
            title: 'Vital Tasks',
            description: 'High-priority tasks that need immediate attention. These tasks are critical and time-sensitive.',
            side: "left",
            align: 'start'
          }
        },
        {
          element: '.recent-tasks-section',
          popover: {
            title: 'Recent Tasks',
            description: 'View and manage your most recently added or modified tasks.',
            side: "right",
            align: 'start'
          }
        },
        {
          element: '.completed-tasks-section',
          popover: {
            title: 'Completed Tasks',
            description: 'Track your accomplishments and view recently completed tasks.',
            side: "right",
            align: 'start'
          }
        },
        {
          element: '.categories-overview',
          popover: {
            title: 'Task Categories',
            description: 'View and access your task categories. Click on any category to see its tasks.',
            side: "bottom",
            align: 'start'
          }
        }
      ],
      onDestroyed: async () => {
        console.log('Tour destroyed, updating Firebase');
        try {
          await setDoc(userDocRef, {
            onboarding: {
              dashboardTourSeen: true
            }
          }, { merge: true });
          console.log('Firebase updated successfully');
        } catch (error) {
          console.error('Error updating tour status:', error);
        }
      }
    });

    return driverObj;
  },

  // MyTask tour
  myTaskTour: (userDocRef) => {
    console.log('Creating myTask tour');
    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      overlayClickNext: false,
      stagePadding: 0,
      popoverClass: 'driverjs-theme',
      steps: [
        {
          element: '.task-filters',
          popover: {
            title: 'Task Filters',
            description: 'Filter your tasks by category, status, and sort them according to your preference.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '.task-list',
          popover: {
            title: 'Task List',
            description: 'View all your tasks here. Click on any task to see its details.',
            side: "left",
            align: 'start'
          }
        },
        {
          element: '.task-details',
          popover: {
            title: 'Task Details',
            description: 'See complete task information, update status, and manage your tasks here.',
            side: "left",
            align: 'start'
          }
        }
      ],
      onDestroyed: async () => {
        console.log('Tour destroyed, updating Firebase');
        try {
          await setDoc(userDocRef, {
            onboarding: {
              myTaskTourSeen: true
            }
          }, { merge: true });
          console.log('Firebase updated successfully');
        } catch (error) {
          console.error('Error updating tour status:', error);
        }
      }
    });

    return driverObj;
  },

  // VitalTask tour
  vitalTaskTour: (userDocRef) => {
    console.log('Creating vitalTask tour');
    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      overlayClickNext: false,
      stagePadding: 0,
      popoverClass: 'driverjs-theme',
      steps: [
        {
          element: '.vital-task-header',
          popover: {
            title: 'Vital Tasks Overview',
            description: 'This section shows your highest priority tasks that need immediate attention.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '.vital-stats',
          popover: {
            title: 'Task Statistics',
            description: 'Quick overview of overdue, due today, and upcoming vital tasks.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '.vital-task-list',
          popover: {
            title: 'Priority Tasks',
            description: 'View and manage your critical tasks here. Tasks are grouped by their due date status.',
            side: "left",
            align: 'start'
          }
        }
      ],
      onDestroyed: async () => {
        console.log('Tour destroyed, updating Firebase');
        try {
          await setDoc(userDocRef, {
            onboarding: {
              vitalTaskTourSeen: true
            }
          }, { merge: true });
          console.log('Firebase updated successfully');
        } catch (error) {
          console.error('Error updating tour status:', error);
        }
      }
    });

    return driverObj;
  },

  // Categories tour
  categoriesTour: (userDocRef) => {
    console.log('Creating categories tour');
    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      overlayClickNext: false,
      stagePadding: 0,
      popoverClass: 'driverjs-theme',
      steps: [
        {
          element: '.categories-header',
          popover: {
            title: 'Task Categories',
            description: 'Organize your tasks into different categories for better management.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '.add-category-btn',
          popover: {
            title: 'Create Categories',
            description: 'Click here to create new categories with custom names and colors.',
            side: "left",
            align: 'start'
          }
        },
        {
          element: '.categories-list',
          popover: {
            title: 'Categories Overview',
            description: 'View all your categories here. Each category shows its tasks and status.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '.category-stats',
          popover: {
            title: 'Category Details',
            description: 'See category information and task statistics at a glance.',
            side: "right",
            align: 'start'
          }
        },
        {
          element: '.category-actions',
          popover: {
            title: 'Category Management',
            description: 'Edit or delete categories using these action buttons.',
            side: "left",
            align: 'start'
          }
        },
        {
          element: '.category-tasks',
          popover: {
            title: 'Category Tasks',
            description: 'View tasks within each category and their current status.',
            side: "top",
            align: 'start'
          }
        }
      ],
      onDestroyed: async () => {
        console.log('Tour destroyed, updating Firebase');
        try {
          await setDoc(userDocRef, {
            onboarding: {
              categoriesTourSeen: true
            }
          }, { merge: true });
          console.log('Firebase updated successfully');
        } catch (error) {
          console.error('Error updating tour status:', error);
        }
      }
    });

    return driverObj;
  },

  // Check and start tour for specific page
  checkAndStartTour: async (userId, pageName) => {
    console.log(`Checking tour status for ${pageName}`);
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);
      
      if (!userDocSnap.exists()) {
        console.log('Creating new user document');
        await setDoc(userDocRef, {
          onboarding: {
            dashboardTourSeen: false,
            myTaskTourSeen: false,
            vitalTaskTourSeen: false,
            categoriesTourSeen: false
          }
        }, { merge: true });
        
        const tourFunction = OnboardingService[`${pageName}Tour`];
        if (tourFunction) {
          console.log('Starting initial tour');
          const driverInstance = tourFunction(userDocRef);
          driverInstance.drive();
        }
        return;
      }

      const onboardingData = userDocSnap.data()?.onboarding || {};
      console.log('Current onboarding data:', onboardingData);

      const tourKey = `${pageName}TourSeen`;
      if (!onboardingData[tourKey]) {
        console.log(`Starting ${pageName} tour`);
        const tourFunction = OnboardingService[`${pageName}Tour`];
        if (tourFunction) {
          const driverInstance = tourFunction(userDocRef);
          driverInstance.drive();
        }
      } else {
        console.log(`${pageName} tour already seen`);
      }
    } catch (error) {
      console.error('Error checking tour status:', error);
    }
  }
}; 