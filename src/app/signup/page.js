'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignup = async () => {
    setIsLoading(true)
    // In a real implementation, this would redirect to Google OAuth
    // For now, we'll just simulate the loading state
    setTimeout(() => {
      window.location.href = '/dashboard'
    }, 1500)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Registreren</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Maak een nieuw Crypto Trader account aan
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <button
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? (
              <span>Bezig met registreren...</span>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
                Registreren met Google
              </>
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Al een account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Log in
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Door te registreren gaat u akkoord met onze{' '}
            <Link href="/terms" className="text-blue-600 hover:text-blue-500">
              Gebruiksvoorwaarden
            </Link>{' '}
            en{' '}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
              Privacybeleid
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
