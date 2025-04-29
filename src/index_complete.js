/**
 * Enhanced Cloudflare Worker for Crypto Trader SaaS
 * Includes all necessary API endpoints with mock data
 */

// Simple router implementation
function createRouter() {
  const routes = [];
  
  const router = {
    get: (path, handler) => {
      routes.push({ method: 'GET', path, handler });
      return router;
    },
    post: (path, handler) => {
      routes.push({ method: 'POST', path, handler });
      return router;
    },
    put: (path, handler) => {
      routes.push({ method: 'PUT', path, handler });
      return router;
    },
    delete: (path, handler) => {
      routes.push({ method: 'DELETE', path, handler });
      return router;
    },
    options: (path, handler) => {
      routes.push({ method: 'OPTIONS', path, handler });
      return router;
    },
    all: (path, handler) => {
      routes.push({ method: '*', path, handler });
      return router;
    },
    handle: async (request, env, ctx) => {
      const url = new URL(request.url);
      const method = request.method;
      
      // Handle CORS preflight
      if (method === 'OPTIONS') {
        return handleCors(request);
      }
      
      // Find matching route
      for (const route of routes) {
        if ((route.method === method || route.method === '*') && 
            (route.path === url.pathname || route.path === '*' || 
             (route.path.endsWith('*') && url.pathname.startsWith(route.path.slice(0, -1))))) {
          try {
            return await route.handler(request, env, ctx);
          } catch (error) {
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            });
          }
        }
      }
      
      // No route matched
      return new Response('Not Found', {
        status: 404,
        headers: corsHeaders
      });
    }
  };
  
  return router;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Handle CORS preflight requests
function handleCors(request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

// Create router
const router = createRouter();

// Health check endpoint
router.get('/api/health', async (request, env) => {
  return new Response(JSON.stringify({ status: 'ok', environment: env.ENVIRONMENT }), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
});

// Authentication endpoint
router.post('/api/auth/google', async (request, env) => {
  try {
    const { code } = await request.json();
    
    // In a real implementation, we would exchange the code for Google tokens
    // For now, we'll simulate a successful authentication
    
    // Create a mock token
    const token = 'mock_jwt_token_' + Date.now();
    
    return new Response(JSON.stringify({ 
      token,
      user: { id: 'user_123', email: 'demo@example.com', name: 'Demo User' }
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});

// Market data endpoint
router.get('/api/market/data', async (request, env) => {
  try {
    // Return mock data
    const marketData = {
      totalMarketCap: '1,109,801.30',
      change24h: '-0.67%',
      totalVolume: '7,558,464.81',
      btcDominance: '61.03%',
      ethDominance: '7.07%',
      activeCryptos: '16997',
      fearGreedIndex: '54 (Neutral)'
    };
    
    return new Response(JSON.stringify(marketData), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});

// Portfolio data endpoint
router.get('/api/portfolio', async (request, env) => {
  try {
    // Return mock portfolio data
    const portfolioData = {
      totalValue: '12,345.67',
      change24h: '+2.34%',
      assets: [
        { symbol: 'BTC', name: 'Bitcoin', amount: '0.5', value: '8,765.43', change24h: '+1.2%' },
        { symbol: 'ETH', name: 'Ethereum', amount: '4.2', value: '2,345.67', change24h: '+3.5%' },
        { symbol: 'SOL', name: 'Solana', amount: '12.5', value: '1,234.57', change24h: '-0.8%' }
      ]
    };
    
    return new Response(JSON.stringify(portfolioData), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});

// Recent trades endpoint
router.get('/api/trades/recent', async (request, env) => {
  try {
    // Return mock trades data
    const tradesData = [
      { date: '2025-04-28 15:30:22', pair: 'BTC-USD', type: 'BUY', amount: '0.05 BTC', value: '$3,245.67' },
      { date: '2025-04-28 14:15:10', pair: 'ETH-USD', type: 'SELL', amount: '1.2 ETH', value: '$2,876.40' },
      { date: '2025-04-28 12:45:33', pair: 'SOL-USD', type: 'BUY', amount: '10 SOL', value: '$1,245.80' }
    ];
    
    return new Response(JSON.stringify(tradesData), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});

// News endpoint
router.get('/api/news', async (request, env) => {
  try {
    // Return mock news data
    const newsData = [
      {
        id: 'news1',
        title: 'Bitcoin Breaks $50,000 Barrier Again',
        summary: 'Bitcoin has surged past $50,000 for the first time in three months, signaling renewed investor confidence.',
        source: 'CryptoNews',
        url: 'https://example.com/news1',
        publishedAt: '2025-04-28T10:30:00Z',
        sentiment: 'positive'
      },
      {
        id: 'news2',
        title: 'Ethereum 2.0 Upgrade Scheduled for Next Month',
        summary: 'The long-awaited Ethereum 2.0 upgrade is now officially scheduled for next month, promising improved scalability and reduced gas fees.',
        source: 'CoinDesk',
        url: 'https://example.com/news2',
        publishedAt: '2025-04-27T14:15:00Z',
        sentiment: 'positive'
      },
      {
        id: 'news3',
        title: 'Regulatory Concerns Grow for DeFi Platforms',
        summary: 'Regulators worldwide are increasing scrutiny of decentralized finance platforms, raising concerns about compliance and future growth.',
        source: 'CoinTelegraph',
        url: 'https://example.com/news3',
        publishedAt: '2025-04-26T09:45:00Z',
        sentiment: 'negative'
      }
    ];
    
    return new Response(JSON.stringify(newsData), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});

// Get trading settings
router.get('/api/trading/settings', async (request, env) => {
  try {
    // Return mock settings data
    const settingsData = {
      max_transaction_percent: 20.0,
      max_position_percent: 20.0,
      trading_frequency: 'Optimal',
      risk_level: 'Medium',
      active_cryptocurrencies: ['BTC', 'ETH', 'SOL', 'ADA', 'DOT']
    };
    
    return new Response(JSON.stringify(settingsData), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});

// Update trading settings
router.post('/api/trading/settings', async (request, env) => {
  try {
    const settings = await request.json();
    
    // In a real implementation, we would save these settings to the database
    // For now, just return success
    
    return new Response(JSON.stringify({ success: true, settings }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});

// Save Coinbase API credentials
router.post('/api/coinbase/credentials', async (request, env) => {
  try {
    const { apiKey, apiSecret, isSandbox } = await request.json();
    
    // In a real implementation, we would encrypt and save these credentials
    // For now, just return success
    
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});

// Start trading
router.post('/api/trading/start', async (request, env) => {
  try {
    // In a real implementation, we would start the trading algorithm
    // For now, just return success
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Trading started successfully. The system will now automatically execute trades based on your settings.'
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});

// Stop trading
router.post('/api/trading/stop', async (request, env) => {
  try {
    // In a real implementation, we would stop the trading algorithm
    // For now, just return success
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Trading stopped successfully. No new trades will be executed until you start trading again.'
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});

// Main handler
export default {
  async fetch(request, env, ctx) {
    return router.handle(request, env, ctx);
  },
  
  // Scheduled task handler
  async scheduled(event, env, ctx) {
    console.log('Running scheduled task:', event.cron);
    return new Response('OK');
  }
};
