import type { Metadata } from 'next'
import Providers from './providers'

export const metadata: Metadata = {
  title: 'Kanban Board',
  description: 'Kanban-style task management',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
