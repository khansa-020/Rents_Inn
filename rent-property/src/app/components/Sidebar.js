'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { name: 'Dashboard', href: '/user/dashboard' },
  { name: 'Users', href: 'user/dashboard/users' },
  { name: 'MyProperties', href: '/user/dashboard/properties' },
  { name: 'Settings', href: 'user/dashboard/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-8">My Dashboard</h2>
      <nav className="space-y-2">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded hover:bg-gray-700 transition ${
              pathname === link.href ? 'bg-gray-700' : ''
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
