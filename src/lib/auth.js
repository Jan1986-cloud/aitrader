/**
 * Authentication utilities for Crypto Trader SaaS
 */

// Import required modules
import { sign, verify } from 'jsonwebtoken'

/**
 * Generate a JWT token
 * @param {Object} payload - The data to include in the token
 * @param {string} secret - The secret key for signing
 * @returns {Promise<string>} - The JWT token
 */
export async function generateJwt(payload, secret) {
  return new Promise((resolve, reject) => {
    sign(
      payload,
      secret,
      {
        expiresIn: '7d', // Token expires in 7 days
        algorithm: 'HS256'
      },
      (err, token) => {
        if (err) return reject(err)
        resolve(token)
      }
    )
  })
}

/**
 * Verify a JWT token
 * @param {string} token - The JWT token to verify
 * @param {string} secret - The secret key for verification
 * @returns {Promise<Object>} - The decoded token payload
 */
export async function verifyJwt(token, secret) {
  return new Promise((resolve, reject) => {
    verify(token, secret, { algorithms: ['HS256'] }, (err, decoded) => {
      if (err) return reject(err)
      resolve(decoded)
    })
  })
}
