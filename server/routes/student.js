const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  addStudent,
  updateStudent,
  updateMarks,
  deleteStudent,
} = require('../controllers/studentcontroller');

const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// All routes protected by auth middleware
router.use(authMiddleware);

// GET /api/students/ - accessible by admin and teacher to view all students
router.get('/', roleMiddleware(['admin', 'teacher']), getAllStudents);

// POST /api/students/ - admin only to add student
router.post('/', roleMiddleware(['admin']), addStudent);

// PUT /api/students/:id - admin only to update student (excluding marks)
router.put('/:id', roleMiddleware(['admin']), updateStudent);

// PUT /api/students/:id/marks - admin and teacher can update CGPA
router.put('/:id/marks', roleMiddleware(['admin', 'teacher']), updateMarks);

// DELETE /api/students/:id - admin only to delete student
router.delete('/:id', roleMiddleware(['admin']), deleteStudent);


module.exports = router;
