'use client'

import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [marketData, setMarketData] = useState({
    totalMarketCap: '1,109,801.30',
    change24h: '-0.67%',
    totalVolume: '7,558,464.81',
    btcDominance: '61.03%',
    ethDominance: '7.07%',
    activeCryptos: '16997',
    fearGreedIndex: '54 (Neutral)'
  })
  
  const [portfolio, setPortfolio] = useState({
    totalValue: '0.00',
    change24h: '0.00%',
    assets: []
  })
  
  const [recentTrades, setRecentTrades] = useState([
    { date: '2025-04-28 15:30:22', pair: 'BTC-USD', type: 'BUY', amount: '0.05 BTC', value: '$3,245.67' },
    { date: '2025-04-28 14:15:10', pair: 'ETH-USD', type: 'SELL', amount: '1.2 ETH', value: '$2,876.40' },
    { date: '2025-04-28 12:45:33', pair: 'SOL-USD', type: 'BUY', amount: '10 SOL', value: '$1,245.80' }
  ])

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Overzicht van uw portfolio en de huidige marktomstandigheden.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Start Trading
          </button>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Market Overview */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Marktoverzicht</h3>
            <div className="mt-5 grid grid-cols-2 gap-5">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Totale Marktkapitalisatie</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">${marketData.totalMarketCap}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">24u Verandering</dt>
                <dd className="mt-1 text-lg font-semibold text-red-600 dark:text-red-400">{marketData.change24h}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Totaal Volume</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">${marketData.totalVolume}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">BTC Dominantie</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{marketData.btcDominance}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">ETH Dominantie</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{marketData.ethDominance}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Actieve Cryptocurrencies</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{marketData.activeCryptos}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Fear & Greed Index</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{marketData.fearGreedIndex}</dd>
              </div>
            </div>
          </div>
        </div>
        
        {/* Portfolio Summary */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Portfolio Samenvatting</h3>
            {portfolio.assets.length > 0 ? (
              <div className="mt-5">
                <div className="flex justify-between">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Totale Waarde</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">${portfolio.totalValue}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">24u Verandering</dt>
                    <dd className="mt-1 text-lg font-semibold text-green-600 dark:text-green-400">{portfolio.change24h}</dd>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Assets</h4>
                  <ul className="mt-3 divide-y divide-gray-200 dark:divide-gray-700">
                    {portfolio.assets.map((asset, index) => (
                      <li key={index} className="py-3 flex justify-between">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{asset.symbol}</span>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{asset.amount}</span>
                        </div>
                        <div className="text-sm text-gray-900 dark:text-white">${asset.value}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="mt-5 text-center py-10">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Geen portfolio data beschikbaar. Configureer uw Coinbase API-sleutels in de instellingen.
                </p>
                <div className="mt-4">
                  <a
                    href="/dashboard/settings"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Naar Instellingen
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Trades */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recente Transacties</h3>
            <div className="mt-5">
              <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Datum
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Paar
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Hoeveelheid
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Waarde
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {recentTrades.map((trade, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {trade.date}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {trade.pair}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  trade.type === 'BUY' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                }`}>
                                  {trade.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {trade.amount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {trade.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Latest News */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Laatste Nieuws</h3>
            <div className="mt-5">
              <p className="text-center py-10 text-sm text-gray-500 dark:text-gray-400">
                Geen nieuws beschikbaar. Configureer nieuwsbronnen in de instellingen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
