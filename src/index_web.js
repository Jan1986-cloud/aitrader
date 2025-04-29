/**
 * Updated index.js for Cloudflare Workers compatibility
 * Uses Web-compatible libraries instead of Node.js modules
 */

// Import required modules
import { Router } from 'itty-router'
import { verifyJwt, generateJwt } from './lib/auth_web'
import { handleCors } from './lib/cors'
import { encryptData, decryptData } from './lib/crypto_web'

// Create a new router
const router = Router()

// CORS preflight handler
router.options('*', handleCors)

// Authentication endpoints
router.post('/api/auth/google', async (request, env) => {
  try {
    const { code } = await request.json()
    
    // In a real implementation, we would exchange the code for Google tokens
    // For now, we'll simulate a successful authentication
    
    // Create a user record or get existing user
    const userId = 'user_' + Date.now()
    const userEmail = 'user@example.com'
    const userName = 'Demo User'
    
    // Store user in database
    await env.DB.prepare(`
      INSERT INTO users (id, email, name, subscription_tier, subscription_expires)
      VALUES (?, ?, ?, 'free_trial', datetime('now', '+7 days'))
      ON CONFLICT (email) DO UPDATE SET
      last_login = CURRENT_TIMESTAMP
    `).bind(userId, userEmail, userName).run()
    
    // Generate JWT token
    const token = await generateJwt({ 
      sub: userId,
      email: userEmail,
      name: userName
    }, env.JWT_SECRET)
    
    return new Response(JSON.stringify({ 
      token,
      user: { id: userId, email: userEmail, name: userName }
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...handleCors(request).headers
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...handleCors(request).headers
      }
    })
  }
})

// Protected API routes
// Middleware to verify JWT token
const authenticate = async (request, env) => {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        ...handleCors(request).headers
      }
    })
  }
  
  const token = authHeader.split(' ')[1]
  try {
    const payload = await verifyJwt(token, env.JWT_SECRET)
    request.user = payload
    return null // Continue to the next handler
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        ...handleCors(request).headers
      }
    })
  }
}

// API endpoints for Coinbase integration
router.post('/api/coinbase/credentials', async (request, env) => {
  const authResponse = await authenticate(request, env)
  if (authResponse) return authResponse
  
  try {
    const { apiKey, apiSecret, isSandbox } = await request.json()
    
    // Encrypt API credentials
    const encryptedKey = await encryptData(apiKey, env.ENCRYPTION_KEY)
    const encryptedSecret = await encryptData(apiSecret, env.ENCRYPTION_KEY)
    
    // Store in database
    await env.DB.prepare(`
      INSERT INTO api_credentials (id, user_id, provider, encrypted_key, encrypted_secret, is_sandbox)
      VALUES (?, ?, 'coinbase', ?, ?, ?)
      ON CONFLICT (user_id, provider) DO UPDATE SET
      encrypted_key = ?, encrypted_secret = ?, is_sandbox = ?, last_used = CURRENT_TIMESTAMP
    `).bind(
      'cred_' + Date.now(),
      request.user.sub,
      encryptedKey,
      encryptedSecret,
      isSandbox ? 1 : 0,
      encryptedKey,
      encryptedSecret,
      isSandbox ? 1 : 0
    ).run()
    
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        ...handleCors(request).headers
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...handleCors(request).headers
      }
    })
  }
})

// Get portfolio data
router.get('/api/portfolio', async (request, env) => {
  const authResponse = await authenticate(request, env)
  if (authResponse) return authResponse
  
  try {
    // Get user's Coinbase credentials
    const credentialsResult = await env.DB.prepare(`
      SELECT encrypted_key, encrypted_secret, is_sandbox
      FROM api_credentials
      WHERE user_id = ? AND provider = 'coinbase'
    `).bind(request.user.sub).first()
    
    if (!credentialsResult) {
      return new Response(JSON.stringify({ error: 'No Coinbase API credentials found' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...handleCors(request).headers
        }
      })
    }
    
    // Decrypt credentials
    const apiKey = await decryptData(credentialsResult.encrypted_key, env.ENCRYPTION_KEY)
    const apiSecret = await decryptData(credentialsResult.encrypted_secret, env.ENCRYPTION_KEY)
    
    // In a real implementation, we would fetch portfolio data from Coinbase API
    // For now, return mock data
    const portfolioData = {
      totalValue: '12,345.67',
      change24h: '+2.34%',
      assets: [
        { symbol: 'BTC', name: 'Bitcoin', amount: '0.5', value: '8,765.43' },
        { symbol: 'ETH', name: 'Ethereum', amount: '4.2', value: '2,345.67' },
        { symbol: 'SOL', name: 'Solana', amount: '12.5', value: '1,234.57' }
      ]
    }
    
    // Store a snapshot
    await env.DB.prepare(`
      INSERT INTO portfolio_snapshots (id, user_id, snapshot_data, total_value)
      VALUES (?, ?, ?, ?)
    `).bind(
      'snap_' + Date.now(),
      request.user.sub,
      JSON.stringify(portfolioData),
      parseFloat(portfolioData.totalValue.replace(',', ''))
    ).run()
    
    return new Response(JSON.stringify(portfolioData), {
      headers: {
        'Content-Type': 'application/json',
        ...handleCors(request).headers
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...handleCors(request).headers
      }
    })
  }
})

// Get trading settings
router.get('/api/trading/settings', async (request, env) => {
  const authResponse = await authenticate(request, env)
  if (authResponse) return authResponse
  
  try {
    // Get user's trading settings
    const settingsResult = await env.DB.prepare(`
      SELECT max_transaction_percent, max_position_percent, trading_frequency, risk_level, active_cryptocurrencies
      FROM trading_settings
      WHERE user_id = ?
    `).bind(request.user.sub).first()
    
    if (!settingsResult) {
      // Create default settings if none exist
      const defaultSettings = {
        max_transaction_percent: 20.0,
        max_position_percent: 20.0,
        trading_frequency: 'Optimal',
        risk_level: 'Medium',
        active_cryptocurrencies: JSON.stringify(['BTC', 'ETH', 'SOL', 'ADA', 'DOT'])
      }
      
      await env.DB.prepare(`
        INSERT INTO trading_settings (id, user_id, max_transaction_percent, max_position_percent, trading_frequency, risk_level, active_cryptocurrencies)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        'set_' + Date.now(),
        request.user.sub,
        defaultSettings.max_transaction_percent,
        defaultSettings.max_position_percent,
        defaultSettings.trading_frequency,
        defaultSettings.risk_level,
        defaultSettings.active_cryptocurrencies
      ).run()
      
      return new Response(JSON.stringify({
        max_transaction_percent: defaultSettings.max_transaction_percent,
        max_position_percent: defaultSettings.max_position_percent,
        trading_frequency: defaultSettings.trading_frequency,
        risk_level: defaultSettings.risk_level,
        active_cryptocurrencies: JSON.parse(defaultSettings.active_cryptocurrencies)
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...handleCors(request).headers
        }
      })
    }
    
    return new Response(JSON.stringify({
      max_transaction_percent: settingsResult.max_transaction_percent,
      max_position_percent: settingsResult.max_position_percent,
      trading_frequency: settingsResult.trading_frequency,
      risk_level: settingsResult.risk_level,
      active_cryptocurrencies: JSON.parse(settingsResult.active_cryptocurrencies)
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...handleCors(request).headers
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...handleCors(request).headers
      }
    })
  }
})

// Update trading settings
router.post('/api/trading/settings', async (request, env) => {
  const authResponse = await authenticate(request, env)
  if (authResponse) return authResponse
  
  try {
    const { max_transaction_percent, max_position_percent, trading_frequency, risk_level, active_cryptocurrencies } = await request.json()
    
    // Update settings
    await env.DB.prepare(`
      INSERT INTO trading_settings (id, user_id, max_transaction_percent, max_position_percent, trading_frequency, risk_level, active_cryptocurrencies, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) DO UPDATE SET
      max_transaction_percent = ?, max_position_percent = ?, trading_frequency = ?, risk_level = ?, active_cryptocurrencies = ?, updated_at = CURRENT_TIMESTAMP
    `).bind(
      'set_' + Date.now(),
      request.user.sub,
      max_transaction_percent,
      max_position_percent,
      trading_frequency,
      risk_level,
      JSON.stringify(active_cryptocurrencies),
      max_transaction_percent,
      max_position_percent,
      trading_frequency,
      risk_level,
      JSON.stringify(active_cryptocurrencies)
    ).run()
    
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        ...handleCors(request).headers
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...handleCors(request).headers
      }
    })
  }
})

// Get market data
router.get('/api/market/data', async (request, env) => {
  try {
    // In a real implementation, we would fetch market data from external APIs
    // For now, return mock data
    const marketData = {
      totalMarketCap: '1,109,801.30',
      change24h: '-0.67%',
      totalVolume: '7,558,464.81',
      btcDominance: '61.03%',
      ethDominance: '7.07%',
      activeCryptos: '16997',
      fearGreedIndex: '54 (Neutral)'
    }
    
    return new Response(JSON.stringify(marketData), {
      headers: {
        'Content-Type': 'application/json',
        ...handleCors(request).headers
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...handleCors(request).headers
      }
    })
  }
})

// Get recent trades
router.get('/api/trades/recent', async (request, env) => {
  const authResponse = await authenticate(request, env)
  if (authResponse) return authResponse
  
  try {
    // Get user's recent trades
    const tradesResult = await env.DB.prepare(`
      SELECT id, product_id, side, size, price, value, reasoning, executed_at
      FROM trade_history
      WHERE user_id = ?
      ORDER BY executed_at DESC
      LIMIT 10
    `).bind(request.user.sub).all()
    
    if (!tradesResult || !tradesResult.results || tradesResult.results.length === 0) {
      // Return mock data if no trades exist
      return new Response(JSON.stringify([
        { date: '2025-04-28 15:30:22', pair: 'BTC-USD', type: 'BUY', amount: '0.05 BTC', value: '$3,245.67' },
        { date: '2025-04-28 14:15:10', pair: 'ETH-USD', type: 'SELL', amount: '1.2 ETH', value: '$2,876.40' },
        { date: '2025-04-28 12:45:33', pair: 'SOL-USD', type: 'BUY', amount: '10 SOL', value: '$1,245.80' }
      ]), {
        headers: {
          'Content-Type': 'application/json',
          ...handleCors(request).headers
        }
      })
    }
    
    // Format trades
    const formattedTrades = tradesResult.results.map(trade => ({
      date: new Date(trade.executed_at).toLocaleString(),
      pair: trade.product_id,
      type: trade.side,
      amount: `${trade.size} ${trade.product_id.split('-')[0]}`,
      value: `$${trade.value.toFixed(2)}`,
      reasoning: trade.reasoning
    }))
    
    return new Response(JSON.stringify(formattedTrades), {
      headers: {
        'Content-Type': 'application/json',
        ...handleCors(request).headers
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...handleCors(request).headers
      }
    })
  }
})

// Catch-all for 404s
router.all('*', (request) => {
  return new Response('Not Found', {
    status: 404,
    headers: handleCors(request).headers
  })
})

// Main handler
export default {
  async fetch(request, env, ctx) {
    return router.handle(request, env, ctx)
  },
  
  // Scheduled task handler
  async scheduled(event, env, ctx) {
    // This would run trading algorithms and update portfolios
    console.log('Running scheduled task:', event.cron)
    
    // Get all users with valid API credentials
    const users = await env.DB.prepare(`
      SELECT u.id, u.email, ac.encrypted_key, ac.encrypted_secret, ac.is_sandbox, ts.max_transaction_percent, ts.max_position_percent, ts.risk_level, ts.active_cryptocurrencies
      FROM users u
      JOIN api_credentials ac ON u.id = ac.user_id
      JOIN trading_settings ts ON u.id = ts.user_id
      WHERE ac.provider = 'coinbase'
    `).all()
    
    if (!users || !users.results || users.results.length === 0) {
      console.log('No users with API credentials found')
      return
    }
    
    // Process each user
    for (const user of users.results) {
      try {
        console.log(`Processing user: ${user.email}`)
        
        // In a real implementation, we would:
        // 1. Decrypt API credentials
        // 2. Fetch portfolio data from Coinbase
        // 3. Run trading algorithms
        // 4. Execute trades if needed
        // 5. Log results
        
        // For now, just log that we processed the user
        console.log(`Successfully processed user: ${user.email}`)
      } catch (error) {
        console.error(`Error processing user ${user.email}:`, error)
      }
    }
  }
}
