const express = require('express');
const router = express.Router();
const { getEvents, createEvent } = require('../controllers/eventcontroller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// Protect all event routes
router.use(authMiddleware);

// Admin only
router.get('/', roleMiddleware(['admin']), getEvents);
router.post('/', roleMiddleware(['admin']), createEvent);

module.exports = router;
