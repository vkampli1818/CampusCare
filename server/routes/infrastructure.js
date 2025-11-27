const express = require('express');
const router = express.Router();
const { getInfrastructure, createInfrastructure, updateInfrastructure, deleteInfrastructure } = require('../controllers/infrastructurecontroller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// Protect all infrastructure routes
router.use(authMiddleware);

// Admin only
router.get('/', roleMiddleware(['admin']), getInfrastructure);
router.post('/', roleMiddleware(['admin']), createInfrastructure);
router.put('/:id', roleMiddleware(['admin']), updateInfrastructure);
router.delete('/:id', roleMiddleware(['admin']), deleteInfrastructure);

module.exports = router;
