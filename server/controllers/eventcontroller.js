const Event = require('../models/Event');

// GET /api/events - list all events (admin only)
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch events' });
  }
};

// POST /api/events - create event (admin only)
exports.createEvent = async (req, res) => {
  try {
    const { details, amountRs } = req.body;
    if (!details || details.trim() === '') {
      return res.status(400).json({ message: 'Event details are required' });
    }
    if (amountRs === undefined || amountRs === null || isNaN(amountRs)) {
      return res.status(400).json({ message: 'Amount (Rs) is required' });
    }

    const event = await Event.create({
      details: details.trim(),
      amountRs: Number(amountRs),
      createdBy: req.user && req.user.id ? req.user.id : undefined,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create event' });
  }
};
