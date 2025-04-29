/**
 * Simplified Cloudflare Worker for Crypto Trader SaaS
 * No external dependencies, uses Web APIs only
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

// Mock authentication endpoint
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

// Mock market data endpoint
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
