import { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

export default function AdminLayout({ children, title }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="lg:pl-64">
        <AdminHeader onMenuToggle={() => setMobileOpen(true)} title={title} />
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
