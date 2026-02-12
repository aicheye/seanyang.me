/**
 * Generate HMAC-SHA256 signature for API requests
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {string} path - Request path (e.g., '/cat')
 * @param {string} timestamp - Unix timestamp as string
 * @param {string} body - Request body (empty string for GET)
 * @param {string} secret - HMAC secret from environment variable
 * @returns {Promise<string>} HMAC signature in hex format
 */
async function generateSignature(method, path, timestamp, body, secret) {
  const message = `${method}${path}${timestamp}${body}`;

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);

  // Convert to hex string
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Make authenticated API request with HMAC signature
 * @param {string} url - Full API URL
 * @param {RequestInit} options - Fetch options (method, body, etc.)
 * @returns {Promise<Response>}
 * @throws {Error} If HMAC secret is not configured
 */
export async function authenticatedFetch(url, options = {}) {
  const secret = process.env.NEXT_PUBLIC_HMAC_SECRET;

  if (!secret) {
    throw new Error('HMAC secret not configured');
  }

  // Extract method and path
  const method = options.method || 'GET';
  const urlObj = new URL(url);
  const path = urlObj.pathname;

  // Generate timestamp
  const timestamp = Math.floor(Date.now() / 1000).toString();

  // Get body (empty string for GET requests)
  const body = options.body || '';

  // Generate signature
  const signature = await generateSignature(method, path, timestamp, body, secret);

  // Add signature headers
  const headers = {
    ...options.headers,
    'X-Signature': signature,
    'X-Timestamp': timestamp,
  };

  return fetch(url, { ...options, headers });
}
