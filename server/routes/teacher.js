const express = require('express');
const router = express.Router();
const { getTeacherLeaves, addTeacherLeave, updateTeacherLeave } = require('../controllers/teacherleavecontroller');
const { getTeacherSalary, updateTeacherSalary } = require('../controllers/teachersalarycontroller');
const { getTeacherSalaryRecords, addTeacherSalaryRecord, updateTeacherSalaryRecord, deleteTeacherSalaryRecord } = require('../controllers/teachersalarycontroller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// Protect all teacher routes
router.use(authMiddleware);

// Leaves endpoints
// GET /api/teachers/:id/leaves - admin and teacher can view
router.get('/:id/leaves', roleMiddleware(['admin', 'teacher']), getTeacherLeaves);
// POST /api/teachers/:id/leaves - teacher appeals (teacher only)
router.post('/:id/leaves', roleMiddleware(['teacher']), addTeacherLeave);
// PUT /api/teachers/:id/leaves/:leaveId - admin can approve/reject
router.put('/:id/leaves/:leaveId', roleMiddleware(['admin']), updateTeacherLeave);
// DELETE removed: admin should not delete appeals

// Salary endpoints
// GET /api/teachers/:id/salary - admin and teacher can view
router.get('/:id/salary', roleMiddleware(['admin', 'teacher']), getTeacherSalary);
// PUT /api/teachers/:id/salary - admin only
router.put('/:id/salary', roleMiddleware(['admin']), updateTeacherSalary);

// Salary records endpoints
// GET /api/teachers/:id/salary-records - admin and teacher can view
router.get('/:id/salary-records', roleMiddleware(['admin', 'teacher']), getTeacherSalaryRecords);
// POST /api/teachers/:id/salary-records - admin only
router.post('/:id/salary-records', roleMiddleware(['admin']), addTeacherSalaryRecord);
// PUT /api/teachers/:id/salary-records/:recordId - admin only
router.put('/:id/salary-records/:recordId', roleMiddleware(['admin']), updateTeacherSalaryRecord);
// DELETE /api/teachers/:id/salary-records/:recordId - admin only
router.delete('/:id/salary-records/:recordId', roleMiddleware(['admin']), deleteTeacherSalaryRecord);

module.exports = router;
