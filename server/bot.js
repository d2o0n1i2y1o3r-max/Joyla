import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

console.log('[Bot] TELEGRAM_BOT_TOKEN defined:', !!process.env.TELEGRAM_BOT_TOKEN);
console.log('[Bot] Token loaded:', !!process.env.TELEGRAM_BOT_TOKEN);

if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error('[Bot] ERROR: TELEGRAM_BOT_TOKEN is not defined in .env file');
  process.exit(1);
}

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Delete any existing webhook to avoid conflicts with polling
bot.deleteWebhook().then(() => {
  console.log('[Bot] Webhook deleted (if existed)');
}).catch((error) => {
  console.error('[Bot] Failed to delete webhook:', error.message);
});

// In-memory storage for OTP codes (in production, use Redis or database)
const otpStore = new Map();

// Map chatId to sessionId for resend functionality
const chatIdToSessionId = new Map();

// OTP expiry time (5 minutes)
const OTP_EXPIRY = 5 * 60 * 1000;

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Clean expired OTPs
const cleanExpiredOTPs = () => {
  const now = Date.now();
  for (const [sessionId, data] of otpStore.entries()) {
    if (now - data.createdAt > OTP_EXPIRY) {
      otpStore.delete(sessionId);
    }
  }
};

// Run cleanup every minute
setInterval(cleanExpiredOTPs, 60000);

// Raw message logger for debugging
bot.on('message', (msg) => {
  console.log('[Bot] Received message:', JSON.stringify(msg));
  console.log('[Bot] Message chat_id:', msg.chat.id);
  console.log('[Bot] Message from:', msg.from?.id);
});

// Handle /start command with sessionId
bot.onText(/\/start (.+)/, async (msg, match) => {
  try {
    console.log('[Bot] /start with payload received');
    console.log('[Bot] Full message object:', JSON.stringify(msg, null, 2));
    
    const chatId = msg.chat.id;
    const sessionId = match[1];

    console.log(`[Bot] Extracted chatId: ${chatId}, sessionId: ${sessionId}`);

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP data
    otpStore.set(sessionId, {
      chatId,
      otp,
      createdAt: Date.now(),
    });

    // Store chatId to sessionId mapping for resend functionality
    chatIdToSessionId.set(chatId, sessionId);

    console.log(`[Bot] Generated OTP ${otp} for session ${sessionId}, chat ${chatId}`);
    console.log('[Bot] Attempting to send message to Telegram API...');

    // Send OTP to user
    const result = await bot.sendMessage(chatId, `Hi, this is Doniyor 👋\n\nYour Joyla verification code: ${otp}\n\nThis code will expire in 5 minutes.`);
    console.log('[Bot] Message sent successfully');
    console.log('[Bot] Telegram API response:', JSON.stringify(result));
  } catch (error) {
    console.error('[Bot] Error in /start handler:', error);
    console.error('[Bot] Error details:', JSON.stringify(error, null, 2));
    // Don't crash the bot - just log the error
  }
});

// Handle /start without sessionId
bot.onText(/\/start$/, async (msg) => {
  try {
    console.log('[Bot] /start without payload received');
    console.log('[Bot] Full message object:', JSON.stringify(msg, null, 2));
    
    const result = await bot.sendMessage(msg.chat.id, 'Welcome to Joyla! Please use the link from the app to start the authentication process.');
    console.log('[Bot] Welcome message sent successfully');
    console.log('[Bot] Telegram API response:', JSON.stringify(result));
  } catch (error) {
    console.error('[Bot] Error in /start (no payload) handler:', error);
    console.error('[Bot] Error details:', JSON.stringify(error, null, 2));
    // Don't crash the bot - just log the error
  }
});

// Handle /getcode command - resend OTP
bot.onText(/\/getcode/, async (msg) => {
  try {
    console.log('[Bot] /getcode command received');
    const chatId = msg.chat.id;

    // Check if this chatId has an associated sessionId
    const sessionId = chatIdToSessionId.get(chatId);
    
    if (!sessionId) {
      console.log('[Bot] No sessionId found for chatId:', chatId);
      await bot.sendMessage(chatId, 'Please start the authentication process from the Joyla app first by clicking the "Login with Telegram" button.');
      return;
    }

    console.log('[Bot] Resending OTP for sessionId:', sessionId, 'chatId:', chatId);

    // Generate new OTP
    const otp = generateOTP();
    
    // Update OTP data
    otpStore.set(sessionId, {
      chatId,
      otp,
      createdAt: Date.now(),
    });

    console.log(`[Bot] Generated new OTP ${otp} for session ${sessionId}, chat ${chatId}`);

    // Send new OTP to user
    const result = await bot.sendMessage(chatId, `Hi, this is Doniyor 👋\n\nYour new Joyla verification code: ${otp}\n\nThis code will expire in 5 minutes.`);
    console.log('[Bot] New code sent successfully');
    console.log('[Bot] Telegram API response:', JSON.stringify(result));
  } catch (error) {
    console.error('[Bot] Error in /getcode handler:', error);
    console.error('[Bot] Error details:', JSON.stringify(error, null, 2));
    // Don't crash the bot - just log the error
  }
});

// Handle errors
bot.on('polling_error', (error) => {
  console.error(`[Telegram Bot Polling Error] ${error.code}: ${error.message}`);
});

console.log('[Bot] Telegram bot is running with polling enabled...');

export { otpStore, OTP_EXPIRY, chatIdToSessionId };
