import express from 'express';
import Message from '../models/Message.js';
import Subscriber from '../models/Subscriber.js';
import { sendContactNotification, sendSubscriberNotification } from '../services/emailService.js';

const router = express.Router();

/**
 * @route   POST /api/contact
 * @desc    Receive contact form submission, store in MongoDB, notify owner
 */
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message, role = 'project' } = req.body;

    // Basic Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and message.'
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.'
      });
    }

    // Capture metadata
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // 1. Store in MongoDB
    const newMessage = await Message.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      role: role.trim(),
      ip,
      userAgent
    });

    // 2. Trigger notification service asynchronously
    let notificationResult = { sent: false };
    try {
      notificationResult = await sendContactNotification({
        name: newMessage.name,
        email: newMessage.email,
        message: newMessage.message,
        role: newMessage.role,
        createdAt: newMessage.createdAt
      });

      newMessage.notificationSent = Boolean(notificationResult.sent);
      if (notificationResult.error) {
        newMessage.notificationError = notificationResult.error;
      }
      await newMessage.save();
    } catch (notifErr) {
      console.error('[Notification] Error during dispatch:', notifErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Your message has been safely received and stored!',
      id: newMessage._id,
      notificationSent: newMessage.notificationSent
    });
  } catch (error) {
    console.error('[API /api/contact] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred while saving your message. Please try again.'
    });
  }
});

/**
 * @route   POST /api/subscribe
 * @desc    Add email to circle/subscriber list, store in MongoDB, notify owner
 */
router.post('/subscribe', async (req, res) => {
  try {
    const { email, source = 'contact_modal' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email address is required.'
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Check if already subscribed
    let subscriber = await Subscriber.findOne({ email: cleanEmail });

    if (subscriber) {
      if (subscriber.status !== 'active') {
        subscriber.status = 'active';
        await subscriber.save();
      }
      return res.status(200).json({
        success: true,
        message: 'You are already in the circle!',
        alreadySubscribed: true
      });
    }

    // 1. Store in MongoDB
    subscriber = await Subscriber.create({
      email: cleanEmail,
      source,
      ip
    });

    // 2. Trigger notification
    const notificationResult = await sendSubscriberNotification({
      email: cleanEmail,
      source
    });

    subscriber.notificationSent = Boolean(notificationResult.sent);
    await subscriber.save();

    return res.status(201).json({
      success: true,
      message: 'Successfully subscribed to the circle!'
    });
  } catch (error) {
    console.error('[API /api/subscribe] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to subscribe. Please try again.'
    });
  }
});

/**
 * @route   GET /api/messages & /api/contact/messages
 * @desc    View all received inquiries (sorted latest first)
 */
const getMessagesHandler = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 100);
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('[API /api/messages] Error:', error);
    return res.status(500).json({ success: false, error: 'Could not fetch messages.' });
  }
};
router.get('/messages', getMessagesHandler);
router.get('/contact/messages', getMessagesHandler);

/**
 * @route   GET /api/subscribers & /api/contact/subscribers
 * @desc    View all subscribers
 */
const getSubscribersHandler = async (req, res) => {
  try {
    const subscribers = await Subscriber.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (error) {
    console.error('[API /api/subscribers] Error:', error);
    return res.status(500).json({ success: false, error: 'Could not fetch subscribers.' });
  }
};
router.get('/subscribers', getSubscribersHandler);
router.get('/contact/subscribers', getSubscribersHandler);

/**
 * @route   GET /api/stats & /api/contact/stats
 * @desc    Summary statistics for portfolio dashboard
 */
const getStatsHandler = async (req, res) => {
  try {
    const totalMessages = await Message.countDocuments();
    const totalSubscribers = await Subscriber.countDocuments();
    const unreadMessages = await Message.countDocuments({ status: 'new' });

    return res.json({
      success: true,
      stats: {
        totalMessages,
        totalSubscribers,
        unreadMessages
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Could not fetch stats.' });
  }
};
router.get('/stats', getStatsHandler);
router.get('/contact/stats', getStatsHandler);

export default router;
