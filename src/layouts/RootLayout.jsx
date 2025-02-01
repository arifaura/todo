import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'

function RootLayout() {
  return (
    <div className="min-h-screen">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      {/* Main Layout with Fixed Sidebar and Scrollable Content */}
      <div className="flex pt-[57px] min-h-screen">
        {/* Fixed Sidebar */}
        <aside className="hidden lg:block fixed left-0 top-[57px] bottom-0 w-64">
          <div className="h-full bg-[#FF5C5C]">
            <Sidebar />
          </div>
        </aside>

        {/* Scrollable Main Content */}
        <main className="flex-1 lg:pl-64 bg-[#F8F8F8] min-h-screen overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default RootLayout 