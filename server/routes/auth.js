const express = require('express');
const router = express.Router();
const { register, login, listTeachers, adminExists } = require('../controllers/authcontroller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// @route   POST /api/auth/register
// @desc    Register user. Policy enforced in controller to allow only:
//          - First admin without token
//          - Admins (with token) for any subsequent admin/teacher registrations
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', login);

// @route   GET /api/auth/admin-exists
// @desc    Returns { exists: boolean }
router.get('/admin-exists', adminExists);

// @route   GET /api/auth/teachers
// @desc    List all teachers (admin, or teachers to see colleagues)
router.get('/teachers', authMiddleware, roleMiddleware(['admin', 'teacher']), listTeachers);

module.exports = router;
