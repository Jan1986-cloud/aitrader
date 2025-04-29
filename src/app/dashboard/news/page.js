
'use client'

import { useState, useEffect } from 'react'

export default function NewsPage() {
  const [newsData, setNewsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true)
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''; // Corrected default value
        const response = await fetch(`${apiUrl}/api/news`, {
          headers: {
            // Include Authorization header if needed
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setNewsData(data)
        setError(null)
      } catch (err) {
        setError(err.message)
        setNewsData([])
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      default: return 'text-gray-400';
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Latest News</h1>
      
      {loading && <p>Loading news...</p>}
      {error && <p className="text-red-500">Error loading news: {error}</p>}
      
      {newsData.length > 0 && (
        <div className="space-y-4">
          {newsData.map(newsItem => (
            <div key={newsItem.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-1">{newsItem.title}</h2>
              <p className="text-gray-400 text-sm mb-2">
                Source: {newsItem.source} | Published: {new Date(newsItem.publishedAt).toLocaleString()}
              </p>
              <p className="mb-2">{newsItem.summary}</p>
              <div className="flex justify-between items-center">
                <a href={newsItem.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  Read More
                </a>
                {newsItem.sentiment && (
                  <span className={`font-semibold ${getSentimentColor(newsItem.sentiment)}`}>
                    Sentiment: {newsItem.sentiment}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

