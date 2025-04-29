/**
 * Encryption utilities for Crypto Trader SaaS
 * Used to securely store sensitive data like API keys
 */

// Import required modules
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

/**
 * Encrypt data using AES-256-GCM
 * @param {string} data - The data to encrypt
 * @param {string} key - The encryption key
 * @returns {string} - The encrypted data as a base64 string
 */
export async function encryptData(data, key) {
  // Generate a random initialization vector
  const iv = randomBytes(16);
  
  // Create cipher
  const cipher = createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
  
  // Encrypt the data
  let encrypted = cipher.update(data, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  // Get the auth tag
  const authTag = cipher.getAuthTag();
  
  // Combine IV, encrypted data, and auth tag
  return Buffer.concat([
    iv,
    Buffer.from(encrypted, 'base64'),
    authTag
  ]).toString('base64');
}

/**
 * Decrypt data using AES-256-GCM
 * @param {string} encryptedData - The encrypted data as a base64 string
 * @param {string} key - The encryption key
 * @returns {string} - The decrypted data
 */
export async function decryptData(encryptedData, key) {
  // Convert the encrypted data from base64 to buffer
  const buffer = Buffer.from(encryptedData, 'base64');
  
  // Extract IV, encrypted data, and auth tag
  const iv = buffer.slice(0, 16);
  const authTag = buffer.slice(buffer.length - 16);
  const encryptedText = buffer.slice(16, buffer.length - 16);
  
  // Create decipher
  const decipher = createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
  decipher.setAuthTag(authTag);
  
  // Decrypt the data
  let decrypted = decipher.update(encryptedText, null, 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
