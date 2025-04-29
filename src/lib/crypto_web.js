/**
 * Cloudflare Worker-compatible crypto utilities for Crypto Trader SaaS
 * Uses Web Crypto API instead of Node.js crypto module
 */

/**
 * Encrypt data using AES-GCM with Web Crypto API
 * @param {string} data - The data to encrypt
 * @param {string} key - The encryption key (hex string)
 * @returns {string} - The encrypted data as a base64 string
 */
export async function encryptData(data, key) {
  // Convert hex key to ArrayBuffer
  const keyBuffer = hexToArrayBuffer(key);
  
  // Import the key
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  // Generate a random IV
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Encrypt the data
  const dataBuffer = new TextEncoder().encode(data);
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    cryptoKey,
    dataBuffer
  );
  
  // Combine IV and encrypted data
  const result = new Uint8Array(iv.length + encryptedBuffer.byteLength);
  result.set(iv, 0);
  result.set(new Uint8Array(encryptedBuffer), iv.length);
  
  // Convert to base64
  return arrayBufferToBase64(result);
}

/**
 * Decrypt data using AES-GCM with Web Crypto API
 * @param {string} encryptedData - The encrypted data as a base64 string
 * @param {string} key - The encryption key (hex string)
 * @returns {string} - The decrypted data
 */
export async function decryptData(encryptedData, key) {
  // Convert base64 to ArrayBuffer
  const encryptedBuffer = base64ToArrayBuffer(encryptedData);
  
  // Extract IV and encrypted data
  const iv = encryptedBuffer.slice(0, 12);
  const data = encryptedBuffer.slice(12);
  
  // Convert hex key to ArrayBuffer
  const keyBuffer = hexToArrayBuffer(key);
  
  // Import the key
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );
  
  // Decrypt the data
  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv
    },
    cryptoKey,
    data
  );
  
  // Convert to string
  return new TextDecoder().decode(decryptedBuffer);
}

/**
 * Convert hex string to ArrayBuffer
 * @param {string} hex - Hex string
 * @returns {ArrayBuffer} - ArrayBuffer
 */
function hexToArrayBuffer(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
}

/**
 * Convert ArrayBuffer to base64 string
 * @param {ArrayBuffer} buffer - ArrayBuffer
 * @returns {string} - Base64 string
 */
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert base64 string to ArrayBuffer
 * @param {string} base64 - Base64 string
 * @returns {ArrayBuffer} - ArrayBuffer
 */
function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
