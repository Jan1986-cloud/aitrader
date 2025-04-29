/**
 * JWT authentication utilities for Crypto Trader SaaS
 * Uses Web Crypto API instead of jsonwebtoken library
 */

/**
 * Generate a JWT token
 * @param {Object} payload - The data to include in the token
 * @param {string} secret - The secret key for signing
 * @returns {Promise<string>} - The JWT token
 */
export async function generateJwt(payload, secret) {
  // Create JWT header
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  // Add expiration to payload (7 days)
  const now = Math.floor(Date.now() / 1000);
  payload.iat = now;
  payload.exp = now + (7 * 24 * 60 * 60); // 7 days
  
  // Encode header and payload
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=+$/, '');
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=+$/, '');
  
  // Create signature
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = await createHmacSignature(data, secret);
  
  // Return complete JWT
  return `${data}.${signature}`;
}

/**
 * Verify a JWT token
 * @param {string} token - The JWT token to verify
 * @param {string} secret - The secret key for verification
 * @returns {Promise<Object>} - The decoded token payload
 */
export async function verifyJwt(token, secret) {
  // Split token into parts
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }
  
  const [encodedHeader, encodedPayload, providedSignature] = parts;
  
  // Verify signature
  const data = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = await createHmacSignature(data, secret);
  
  if (providedSignature !== expectedSignature) {
    throw new Error('Invalid signature');
  }
  
  // Decode payload
  const payload = JSON.parse(atob(encodedPayload));
  
  // Check expiration
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    throw new Error('Token expired');
  }
  
  return payload;
}

/**
 * Create HMAC signature using Web Crypto API
 * @param {string} data - Data to sign
 * @param {string} secret - Secret key
 * @returns {Promise<string>} - Base64 URL encoded signature
 */
async function createHmacSignature(data, secret) {
  // Convert secret to key
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  // Sign data
  const dataBuffer = encoder.encode(data);
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    dataBuffer
  );
  
  // Convert to base64url
  return arrayBufferToBase64Url(signatureBuffer);
}

/**
 * Convert ArrayBuffer to base64url string
 * @param {ArrayBuffer} buffer - ArrayBuffer
 * @returns {string} - Base64url string
 */
function arrayBufferToBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
