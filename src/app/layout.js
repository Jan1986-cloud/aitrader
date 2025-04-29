import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Crypto Trader SaaS',
  description: 'Geautomatiseerd handelen in cryptocurrencies met AI-ondersteuning',
}

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
