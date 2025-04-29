
'use client'

import { useState, useEffect } from 'react'

export default function PortfolioPage() {
  const [portfolioData, setPortfolioData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        setLoading(true)
       const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const response = await fetch(`${apiUrl}/api/portfolio`, {
          headers: {
            // Include Authorization header if needed
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setPortfolioData(data)
        setError(null)
      } catch (err) {
        setError(err.message)
        setPortfolioData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolio()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Portfolio</h1>
      
      {loading && <p>Loading portfolio data...</p>}
      {error && <p className="text-red-500">Error loading portfolio: {error}</p>}
      
      {portfolioData && (
        <div>
          <div className="bg-gray-800 p-4 rounded-lg mb-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2">Portfolio Summary</h2>
            <p>Total Value: ${portfolioData.totalValue}</p>
            <p>24h Change: <span className={portfolioData.change24h.startsWith('+') ? 'text-green-500' : 'text-red-500'}>{portfolioData.change24h}</span></p>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Assets</h2>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2">Asset</th>
                  <th>Amount</th>
                  <th>Value</th>
                  <th>24h Change</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.assets.map(asset => (
                  <tr key={asset.symbol} className="border-b border-gray-700 last:border-b-0">
                    <td className="py-2">
                      <span className="font-bold">{asset.symbol}</span>
                      <span className="text-gray-400 ml-2">{asset.name}</span>
                    </td>
                    <td>{asset.amount}</td>
                    <td>${asset.value}</td>
                    <td><span className={asset.change24h.startsWith('+') ? 'text-green-500' : 'text-red-500'}>{asset.change24h}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

