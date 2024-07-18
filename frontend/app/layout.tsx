import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Provider } from 'react-redux';

import { UserProvider } from '../context/user/UserContext';
import { ClientOnly, ToasterProvider } from '@/components';

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'eReminder | Reminder App',
  description: 'Welcome to eReminder, your personal reminder app'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {

  return (
        <UserProvider>
          <html lang="en">
            <body className={inter.className}>
              <ClientOnly>
                <ToasterProvider />
              </ClientOnly>
              <main>
                {children}
              </main>
            </body>
          </html>
        </UserProvider>
  )
}
