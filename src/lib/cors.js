/**
 * CORS handling utilities for Crypto Trader SaaS
 */

/**
 * Handle CORS preflight requests and add CORS headers to responses
 * @param {Request} request - The incoming request
 * @returns {Object} - Response headers for CORS
 */
export function handleCors(request) {
  // Get the origin from the request
  const origin = request.headers.get('Origin') || '*';
  
  // Define allowed headers
  const allowedHeaders = [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
  ].join(', ');
  
  // Define CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': allowedHeaders,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
  
  // Return headers object
  return {
    headers: corsHeaders
  };
}
