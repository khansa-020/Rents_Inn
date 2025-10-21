import Sidebar from '../../components/Sidebar'
import UserMenu from '../../components/UserMenu'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-700">
      <div className="w-64 fixed top-0 left-0 h-screen">
        <Sidebar />
      </div>

      <main className="flex-1 ml-64 p-6 overflow-y-auto relative">
        <div className="flex justify-end mb-4">
          <UserMenu />
        </div>

        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
