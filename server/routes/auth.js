import express from 'express';
import crypto from 'crypto';
import axios from 'axios';
import { verifyTelegramAuth } from '../utils/telegramAuth.js';
import { otpStore, OTP_EXPIRY, chatIdToSessionId } from '../bot.js';

const router = express.Router();

// Telegram auth endpoint (legacy - for widget-based auth)
router.post('/telegram', async (req, res) => {
  try {
    const authData = req.body;

    // Verify the Telegram auth data
    const isValid = verifyTelegramAuth(authData, process.env.TELEGRAM_BOT_TOKEN);

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid Telegram authentication' });
    }

    // Extract user data
    const { id, first_name, last_name, username, photo_url } = authData;

    // Create user object
    const user = {
      telegramId: id,
      firstName: first_name,
      lastName: last_name,
      username: username,
      photoUrl: photo_url,
    };

    // Send welcome message via Telegram Bot API
    if (process.env.TELEGRAM_BOT_TOKEN) {
      try {
        await axios.post(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            chat_id: id,
            text: `Hi, this is Doniyor 👋\n\nWelcome to Joylar! Discover amazing places in Uzbekistan.`,
          }
        );
      } catch (error) {
        console.error('Failed to send Telegram message:', error);
        // Continue even if message fails
      }
    }

    // Generate a simple token (in production, use JWT)
    const token = Buffer.from(JSON.stringify({ telegramId: id, timestamp: Date.now() })).toString('base64');

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  try {
    console.log('[Backend] /verify-otp request received');
    console.log('[Backend] Request body:', req.body);
    
    const { sessionId, code } = req.body;

    if (!sessionId || !code) {
      console.log('[Backend] Missing sessionId or code');
      return res.status(400).json({ error: 'Session ID and code are required' });
    }

    console.log('[Backend] Looking up OTP for session:', sessionId);
    
    // Get OTP data from store
    const otpData = otpStore.get(sessionId);

    if (!otpData) {
      console.log('[Backend] No OTP found for session:', sessionId);
      return res.status(400).json({ error: 'Invalid or expired session' });
    }

    console.log('[Backend] OTP data found:', { chatId: otpData.chatId, otp: otpData.otp });

    // Check if OTP has expired
    const now = Date.now();
    if (now - otpData.createdAt > OTP_EXPIRY) {
      console.log('[Backend] OTP expired');
      otpStore.delete(sessionId);
      return res.status(400).json({ error: 'Code has expired' });
    }

    // Verify the code
    if (otpData.otp !== code) {
      console.log('[Backend] Invalid code - expected:', otpData.otp, 'got:', code);
      return res.status(400).json({ error: 'Invalid code' });
    }

    console.log('[Backend] Code verified successfully');

    // Get user info from Telegram
    const chatId = otpData.chatId;
    let userInfo = {
      telegramId: chatId,
      firstName: 'User',
      username: null,
    };

    try {
      console.log('[Backend] Fetching user info from Telegram API for chatId:', chatId);
      const response = await axios.get(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getChat`,
        {
          params: { chat_id: chatId },
        }
      );

      if (response.data.ok) {
        const chat = response.data.result;
        userInfo = {
          telegramId: chatId,
          firstName: chat.first_name || 'User',
          lastName: chat.last_name || '',
          username: chat.username || null,
          photoUrl: null, // Would need separate call to getUserProfilePhotos
        };
        console.log('[Backend] User info fetched:', userInfo);
      }
    } catch (error) {
      console.error('[Backend] Failed to get chat info:', error);
      console.error('[Backend] Continuing with basic user info');
      // Continue with basic info if API call fails
    }

    // Generate token
    const token = Buffer.from(JSON.stringify({ telegramId: chatId, timestamp: Date.now() })).toString('base64');

    // Clean up OTP after successful verification
    otpStore.delete(sessionId);

    console.log('[Backend] Sending successful response');
    res.json({
      user: userInfo,
      token,
    });
  } catch (error) {
    console.error('[Backend] OTP verification error:', error);
    console.error('[Backend] Error stack:', error.stack);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Resend OTP endpoint
router.post('/resend-otp', async (req, res) => {
  try {
    console.log('[Backend] /resend-otp request received');
    console.log('[Backend] Request body:', req.body);
    
    const { sessionId } = req.body;

    if (!sessionId) {
      console.log('[Backend] Missing sessionId');
      return res.status(400).json({ error: 'Session ID is required' });
    }

    console.log('[Backend] Looking up OTP for session:', sessionId);
    
    // Get OTP data from store
    const otpData = otpStore.get(sessionId);

    if (!otpData) {
      console.log('[Backend] No OTP found for session:', sessionId);
      return res.status(400).json({ error: 'Invalid or expired session' });
    }

    const chatId = otpData.chatId;

    console.log('[Backend] Resending OTP for sessionId:', sessionId, 'chatId:', chatId);

    // Generate new OTP
    const generateOTP = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };
    const newOtp = generateOTP();
    
    // Update OTP data
    otpStore.set(sessionId, {
      chatId,
      otp: newOtp,
      createdAt: Date.now(),
    });

    console.log(`[Backend] Generated new OTP ${newOtp} for session ${sessionId}, chat ${chatId}`);

    // Send new OTP to user via Telegram
    try {
      const response = await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id: chatId,
          text: `Hi, this is Doniyor 👋\n\nYour new Joylar verification code: ${newOtp}\n\nThis code will expire in 5 minutes.`,
        }
      );

      if (response.data.ok) {
        console.log('[Backend] New code sent successfully via Telegram API');
        res.json({ success: true, message: 'Code resent successfully' });
      } else {
        console.error('[Backend] Telegram API returned error:', response.data);
        res.status(500).json({ error: 'Failed to send code via Telegram' });
      }
    } catch (error) {
      console.error('[Backend] Failed to send OTP via Telegram API:', error);
      res.status(500).json({ error: 'Failed to send code via Telegram' });
    }
  } catch (error) {
    console.error('[Backend] Resend OTP error:', error);
    console.error('[Backend] Error stack:', error.stack);
    res.status(500).json({ error: 'Resend failed' });
  }
});

// Verify token endpoint
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    // Check if token is not too old (24 hours)
    const isExpired = Date.now() - decoded.timestamp > 24 * 60 * 60 * 1000;

    if (isExpired) {
      return res.status(401).json({ error: 'Token expired' });
    }

    res.json({ valid: true, telegramId: decoded.telegramId });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
