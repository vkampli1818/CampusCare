const express = require('express');
const router = express.Router();
const { getBooks, createBook, updateBook, deleteBook } = require('../controllers/bookcontroller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// Protect all book routes
router.use(authMiddleware);

// Admin only CRUD
router.get('/', roleMiddleware(['admin']), getBooks);
router.post('/', roleMiddleware(['admin']), createBook);
router.put('/:id', roleMiddleware(['admin']), updateBook);
router.delete('/:id', roleMiddleware(['admin']), deleteBook);

module.exports = router;
