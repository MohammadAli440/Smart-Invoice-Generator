import '../globals.css'
import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'Smart Invoice Generator',
  description: 'Create and send professional invoices'
}

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <body>
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <a href="/" className="font-bold">Smart Invoice</a>
              <a href="/dashboard" className="text-sm text-gray-600">Dashboard</a>
              <a href="/invoices" className="text-sm text-gray-600">Invoices</a>
              <a href="/clients" className="text-sm text-gray-600">Clients</a>
              <a href="/templates" className="text-sm text-gray-600">Templates</a>
              <a href="/scheduled" className="text-sm text-gray-600">Scheduled</a>
              <a href="/email-logs" className="text-sm text-gray-600">Email Logs</a>
              <a href="/analytics" className="text-sm text-gray-600">Analytics</a>
            </div>
            <div className="flex items-center gap-2">
              <a href="/settings/company" className="text-sm text-gray-600">Company</a>
              <a href="/settings/account" className="text-sm text-gray-600">Account</a>
            </div>
          </div>
        </div>
        <main className="min-h-screen bg-gray-50 text-gray-900">{children}</main>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
