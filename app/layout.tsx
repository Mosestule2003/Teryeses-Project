import type { Metadata } from 'next'
import { ThemeToggle } from '@/components/theme-toggle'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Teryese Rebecca — EV4GH 2026',
  description: 'Medical Student & Health Advocate — building a healthier Africa through community outreach, continental advocacy, and evidence-informed policy change.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport = {
  themeColor: '#0a0908',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground transition-colors duration-300">
        {children}
        <ThemeToggle />
        <Toaster />
      </body>
    </html>
  )
}
