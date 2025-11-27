const User = require('../models/User');

// GET /api/teachers/:id/salary - admin and teacher can view
exports.getTeacherSalary = async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await User.findById(id).select('role totalSalary paidSalary');
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    const total = Number(teacher.totalSalary || 0);
    const paid = Number(teacher.paidSalary || 0);
    const remaining = Math.max(0, total - paid);
    res.json({ totalSalary: total, paidSalary: paid, remaining });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ========== Monthly Salary Records (admin CRUD, teacher read-only) ==========

// GET /api/teachers/:id/salary-records - admin and teacher
exports.getTeacherSalaryRecords = async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await User.findById(id).select('role salaryRecords');
    if (!teacher || teacher.role !== 'teacher') return res.status(404).json({ message: 'Teacher not found' });
    const records = (teacher.salaryRecords || []).sort((a, b) => (a.month > b.month ? -1 : 1));
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/teachers/:id/salary-records - admin only
exports.addTeacherSalaryRecord = async (req, res) => {
  const { id } = req.params;
  const { month, total, paid, status } = req.body;
  try {
    const teacher = await User.findById(id);
    if (!teacher || teacher.role !== 'teacher') return res.status(404).json({ message: 'Teacher not found' });
    if (!month || typeof month !== 'string') return res.status(400).json({ message: 'month (YYYY-MM) is required' });
    const t = Number(total), p = Number(paid);
    if (Number.isNaN(t) || Number.isNaN(p)) return res.status(400).json({ message: 'total and paid must be numbers' });
    if (!['Fully Paid', 'Half Paid', 'Not Paid'].includes(status)) return res.status(400).json({ message: 'invalid status' });
    const rec = { month, total: Math.max(0, t), paid: Math.max(0, p), status };
    teacher.salaryRecords = teacher.salaryRecords || [];
    // If record exists for month, replace it
    const idx = teacher.salaryRecords.findIndex(r => r.month === month);
    if (idx >= 0) teacher.salaryRecords[idx] = { ...teacher.salaryRecords[idx], ...rec };
    else teacher.salaryRecords.push(rec);
    await teacher.save();
    res.status(201).json(teacher.salaryRecords);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/teachers/:id/salary-records/:recordId - admin only
exports.updateTeacherSalaryRecord = async (req, res) => {
  const { id, recordId } = req.params;
  const { month, total, paid, status } = req.body;
  try {
    const teacher = await User.findById(id);
    if (!teacher || teacher.role !== 'teacher') return res.status(404).json({ message: 'Teacher not found' });
    const r = (teacher.salaryRecords || []).find(x => String(x.id) === String(recordId));
    if (!r) return res.status(404).json({ message: 'Record not found' });
    if (month !== undefined) r.month = String(month);
    if (total !== undefined) {
      const t = Number(total); if (Number.isNaN(t) || t < 0) return res.status(400).json({ message: 'total must be non-negative' }); r.total = t;
    }
    if (paid !== undefined) {
      const p = Number(paid); if (Number.isNaN(p) || p < 0) return res.status(400).json({ message: 'paid must be non-negative' }); r.paid = p;
    }
    if (status !== undefined) {
      if (!['Fully Paid', 'Half Paid', 'Not Paid'].includes(status)) return res.status(400).json({ message: 'invalid status' });
      r.status = status;
    }
    await teacher.save();
    res.json(teacher.salaryRecords);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/teachers/:id/salary-records/:recordId - admin only
exports.deleteTeacherSalaryRecord = async (req, res) => {
  const { id, recordId } = req.params;
  try {
    const teacher = await User.findById(id);
    if (!teacher || teacher.role !== 'teacher') return res.status(404).json({ message: 'Teacher not found' });
    const before = (teacher.salaryRecords || []).length;
    teacher.salaryRecords = (teacher.salaryRecords || []).filter(r => String(r.id) !== String(recordId));
    if (teacher.salaryRecords.length === before) return res.status(404).json({ message: 'Record not found' });
    await teacher.save();
    res.json(teacher.salaryRecords);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/teachers/:id/salary - admin only, update totals
// Accepts either { totalSalary, paidSalary } absolute values or { payIncrement } to add payment
exports.updateTeacherSalary = async (req, res) => {
  const { id } = req.params;
  const { totalSalary, paidSalary, payIncrement } = req.body;
  try {
    const teacher = await User.findById(id);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    if (payIncrement !== undefined) {
      const inc = Number(payIncrement);
      if (Number.isNaN(inc)) return res.status(400).json({ message: 'payIncrement must be a number' });
      teacher.paidSalary = Math.max(0, Number(teacher.paidSalary || 0) + inc);
    }
    if (totalSalary !== undefined) {
      const t = Number(totalSalary);
      if (Number.isNaN(t) || t < 0) return res.status(400).json({ message: 'totalSalary must be a non-negative number' });
      teacher.totalSalary = t;
    }
    if (paidSalary !== undefined) {
      const p = Number(paidSalary);
      if (Number.isNaN(p) || p < 0) return res.status(400).json({ message: 'paidSalary must be a non-negative number' });
      teacher.paidSalary = p;
    }

    // Clamp paidSalary to not exceed totalSalary
    const total = Number(teacher.totalSalary || 0);
    teacher.paidSalary = Math.min(Number(teacher.paidSalary || 0), total);

    await teacher.save();
    const remaining = Math.max(0, total - Number(teacher.paidSalary || 0));
    res.json({ totalSalary: total, paidSalary: Number(teacher.paidSalary || 0), remaining });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
