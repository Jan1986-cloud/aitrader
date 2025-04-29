
'use client'

import { useState, useEffect } from 'react'

export default function TradingPage() {
  const [tradingStatus, setTradingStatus] = useState('Stopped') // or 'Running'
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Fetch initial trading status (if applicable)
  // useEffect(() => { ... }, [])

  const handleStartTrading = async () => {
    setError('')
    setMessage('Starting trading...')
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''; // Use env var
      const response = await fetch(`${apiUrl}/api/trading/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include Authorization header if needed
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to start trading')
      }
      setTradingStatus('Running')
      setMessage(data.message || 'Trading started successfully')
    } catch (err) {
      setError(err.message)
      setMessage('')
    }
  }

  const handleStopTrading = async () => {
    setError('')
    setMessage('Stopping trading...')
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''; // Use env var
      const response = await fetch(`${apiUrl}/api/trading/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include Authorization header if needed
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to stop trading')
      }
      setTradingStatus('Stopped')
      setMessage(data.message || 'Trading stopped successfully')
    } catch (err) {
      setError(err.message)
      setMessage('')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Trading Control</h1>

      <div className="bg-gray-800 p-4 rounded-lg mb-4 shadow-md">
        <h2 className="text-xl font-semibold mb-2">Status: <span className={tradingStatus === 'Running' ? 'text-green-500' : 'text-red-500'}>{tradingStatus}</span></h2>
        
        {message && <p className="text-blue-400 mb-2">{message}</p>}
        {error && <p className="text-red-500 mb-2">Error: {error}</p>}

        <div className="flex space-x-4">
          <button 
            onClick={handleStartTrading}
            disabled={tradingStatus === 'Running'}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Trading
          </button>
          <button 
            onClick={handleStopTrading}
            disabled={tradingStatus === 'Stopped'}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Stop Trading
          </button>
        </div>
      </div>

      {/* Placeholder for future trading logs or detailed status */}
      {/* <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Trading Log</h2>
        <p>Trading log will appear here...</p>
      </div> */}
    </div>
  )
}

