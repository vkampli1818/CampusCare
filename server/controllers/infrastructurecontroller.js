const Infrastructure = require('../models/Infrastructure');

// GET /api/infrastructure - list all items (admin only)
exports.getInfrastructure = async (req, res) => {
  try {
    const items = await Infrastructure.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch infrastructure' });
  }
};

// PUT /api/infrastructure/:id - update item (admin only)
exports.updateInfrastructure = async (req, res) => {
  const { id } = req.params;
  const { details, amountRs } = req.body;
  try {
    const item = await Infrastructure.findById(id);
    if (!item) return res.status(404).json({ message: 'Infrastructure not found' });
    if (details !== undefined) item.details = String(details).trim();
    if (amountRs !== undefined) {
      const amt = Number(amountRs);
      if (Number.isNaN(amt)) return res.status(400).json({ message: 'Amount (Rs) must be a number' });
      item.amountRs = Math.max(0, amt);
    }
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update infrastructure' });
  }
};

// DELETE /api/infrastructure/:id - delete item (admin only)
exports.deleteInfrastructure = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Infrastructure.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ message: 'Infrastructure not found' });
    res.json({ message: 'Infrastructure deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete infrastructure' });
  }
};

// POST /api/infrastructure - create item (admin only)
exports.createInfrastructure = async (req, res) => {
  try {
    const { details, amountRs } = req.body;
    if (!details || details.trim() === '') {
      return res.status(400).json({ message: 'Details are required' });
    }
    if (amountRs === undefined || amountRs === null || isNaN(amountRs)) {
      return res.status(400).json({ message: 'Amount (Rs) is required' });
    }

    const item = await Infrastructure.create({
      details: details.trim(),
      amountRs: Number(amountRs),
      createdBy: req.user && req.user.id ? req.user.id : undefined,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create infrastructure' });
  }
};
