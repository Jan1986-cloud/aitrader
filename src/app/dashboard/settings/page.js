'use client'

import { useState, useEffect } from 'react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    max_transaction_percent: 20,
    max_position_percent: 20,
    trading_frequency: 'Optimal',
    risk_level: 'Medium',
    active_cryptocurrencies: ['BTC', 'ETH', 'SOL', 'ADA', 'DOT']
  })
  
  const [coinbaseCredentials, setCoinbaseCredentials] = useState({
    apiKey: '',
    apiSecret: '',
    isSandbox: false
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Fetch current settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true)
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const response = await fetch(`${apiUrl}/api/trading/settings`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setSettings(data)
        setError('')
      } catch (err) {
        setError(`Error loading settings: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      setSettings({
        ...settings,
        [name]: checked
      })
    } else if (name === 'active_cryptocurrencies') {
      // Handle multi-select or checkbox group
      const values = value.split(',').map(v => v.trim())
      setSettings({
        ...settings,
        active_cryptocurrencies: values
      })
    } else {
      setSettings({
        ...settings,
        [name]: value
      })
    }
  }

  const handleCredentialsChange = (e) => {
    const { name, value, type, checked } = e.target
    
    setCoinbaseCredentials({
      ...coinbaseCredentials,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const saveSettings = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setSaving(true)
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response = await fetch(`${apiUrl}/api/trading/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save settings')
      }
      
      setMessage('Trading settings saved successfully')
    } catch (err) {
      setError(`Error saving settings: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const saveCoinbaseCredentials = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setSaving(true)
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response = await fetch(`${apiUrl}/api/coinbase/credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(coinbaseCredentials)
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save Coinbase credentials')
      }
      
      setMessage('Coinbase API credentials saved successfully')
    } catch (err) {
      setError(`Error saving credentials: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      
      {loading && <p>Loading settings...</p>}
      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trading Settings */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Trading Settings</h2>
          
          <form onSubmit={saveSettings}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Maximum Transaction Percentage
              </label>
              <input
                type="number"
                name="max_transaction_percent"
                value={settings.max_transaction_percent}
                onChange={handleSettingsChange}
                min="1"
                max="100"
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">Maximum percentage of wallet per transaction</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Maximum Position Percentage
              </label>
              <input
                type="number"
                name="max_position_percent"
                value={settings.max_position_percent}
                onChange={handleSettingsChange}
                min="1"
                max="100"
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">Maximum percentage of wallet per position</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Trading Frequency
              </label>
              <select
                name="trading_frequency"
                value={settings.trading_frequency}
                onChange={handleSettingsChange}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="Low">Low (Few trades per day)</option>
                <option value="Medium">Medium (Several trades per day)</option>
                <option value="High">High (Many trades per day)</option>
                <option value="Optimal">Optimal (Based on market conditions)</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Risk Level
              </label>
              <select
                name="risk_level"
                value={settings.risk_level}
                onChange={handleSettingsChange}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Active Cryptocurrencies
              </label>
              <input
                type="text"
                name="active_cryptocurrencies"
                value={settings.active_cryptocurrencies.join(', ')}
                onChange={handleSettingsChange}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">Comma-separated list of cryptocurrencies to trade</p>
            </div>
            
            <button
              type="submit"
              disabled={saving || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
        
        {/* Coinbase API Settings */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Coinbase API Settings</h2>
          
          <form onSubmit={saveCoinbaseCredentials}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                API Name
              </label>
              <input
                type="text"
                name="apiKey"
                value={coinbaseCredentials.apiKey}
                onChange={handleCredentialsChange}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your Coinbase API Name"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                API Private Key
              </label>
              <input
                type="password"
                name="apiSecret"
                value={coinbaseCredentials.apiSecret}
                onChange={handleCredentialsChange}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your Coinbase API Private Key"
              />
            </div>
            
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="isSandbox"
                name="isSandbox"
                checked={coinbaseCredentials.isSandbox}
                onChange={handleCredentialsChange}
                className="mr-2"
              />
              <label htmlFor="isSandbox" className="text-sm font-medium">
                Use Sandbox Mode (Testing)
              </label>
            </div>
            
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save API Credentials'}
            </button>
          </form>
          
          <div className="mt-4 p-3 bg-gray-700 rounded">
            <h3 className="font-medium mb-2">How to get your API credentials:</h3>
            <ol className="list-decimal list-inside text-sm space-y-1 text-gray-300">
              <li>Log in to your Coinbase account</li>
              <li>Go to Settings &gt; API</li>
              <li>Click "New API Key"</li>
              <li>Set appropriate permissions (View, Trade)</li>
              <li>Copy the API Name and Private Key</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
