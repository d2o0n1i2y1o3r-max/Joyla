import crypto from 'crypto';

/**
 * Verify Telegram authentication data
 * @param {Object} authData - The auth data from Telegram widget
 * @param {string} botToken - Your Telegram bot token
 * @returns {boolean} - True if auth data is valid
 */
export function verifyTelegramAuth(authData, botToken) {
  if (!authData || !botToken) {
    return false;
  }

  const { hash, ...data } = authData;

  if (!hash) {
    return false;
  }

  // Create a check string from the sorted data
  const checkString = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join('\n');

  // Create the secret key
  const secretKey = crypto
    .createHash('sha256')
    .update(botToken)
    .digest();

  // Calculate the hash
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(checkString)
    .digest('hex');

  // Compare the hashes
  return calculatedHash === hash;
}
