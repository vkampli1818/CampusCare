const Student = require('../models/Student');

// Get all students - accessible by admin and teacher
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate key: regno must be unique' });
    }
    if (error && error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Add new student - admin only
exports.addStudent = async (req, res) => {
  const { name, regno, mobile, division, feeStatus, marks } = req.body;

  if (!name || !regno || !mobile) {
    return res.status(400).json({ message: 'Please provide name, regno and mobile' });
  }

  try {
    const existingStudent = await Student.findOne({ regno });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already exists with given regno' });
    }

    const student = new Student({
      name,
      regno,
      mobile,
      division: division || '',
      feeStatus: feeStatus || 'Pending',
      marks: typeof marks === 'number' ? marks : 0,
      cgpa: 0,
    });

    await student.save();
    res.status(201).json(student);
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate key: regno must be unique' });
    }
    if (error && error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('addStudent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update student details - admin only (except marks/cgpa)
exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, regno, mobile, division, feeStatus } = req.body;

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update allowed fields only
    if (name !== undefined) student.name = name;
    if (regno !== undefined) student.regno = regno;
    if (mobile !== undefined) student.mobile = mobile;
    if (feeStatus !== undefined) student.feeStatus = feeStatus;
    if (division !== undefined) student.division = division;

    await student.save();
    res.json(student);
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate key error' });
    }
    if (error && error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('updateStudent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update CGPA - teacher only
exports.updateMarks = async (req, res) => {
  const { id } = req.params;
  const { cgpa } = req.body;

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (typeof cgpa !== 'number' || Number.isNaN(cgpa)) {
      return res.status(400).json({ message: 'cgpa must be a number' });
    }
    const bounded = Math.max(0, Math.min(10, cgpa));
    student.cgpa = bounded;

    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete student - admin only
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.remove();
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Leaves: Get all leaves for a student - admin and teacher
exports.getLeaves = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student.leaves || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Leaves: Add a leave - admin only
exports.addLeave = async (req, res) => {
  const { id } = req.params;
  const { date, reason, status } = req.body;
  if (!date) return res.status(400).json({ message: 'date is required' });
  try {
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const leaveDate = new Date(date);
    // Enforce monthly cap of 10 leaves
    const monthStart = new Date(leaveDate.getFullYear(), leaveDate.getMonth(), 1);
    const monthEnd = new Date(leaveDate.getFullYear(), leaveDate.getMonth() + 1, 0, 23, 59, 59, 999);
    const monthlyCount = (student.leaves || []).filter(lv => {
      const d = new Date(lv.date);
      return d >= monthStart && d <= monthEnd;
    }).length;
    if (monthlyCount >= 10) {
      return res.status(400).json({ message: 'Monthly leave limit (10) reached for this student' });
    }

    const leave = {
      date: new Date(date),
      reason: reason || '',
      status: ['Pending', 'Approved', 'Rejected'].includes(status) ? status : 'Pending',
    };
    student.leaves = student.leaves || [];
    student.leaves.push(leave);
    await student.save();
    res.status(201).json(student.leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Leaves: Update a leave - admin only
exports.updateLeave = async (req, res) => {
  const { id, leaveId } = req.params;
  const { date, reason, status } = req.body;
  try {
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const l = (student.leaves || []).find(lv => String(lv.id) === String(leaveId));
    if (!l) return res.status(404).json({ message: 'Leave not found' });
    if (date !== undefined) {
      const newDate = new Date(date);
      // If month/year changed, ensure new month cap <= 10
      const monthStart = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
      const monthEnd = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0, 23, 59, 59, 999);
      const monthlyCount = (student.leaves || []).filter(lv => {
        if (String(lv.id) === String(leaveId)) return false; // exclude current being moved
        const d = new Date(lv.date);
        return d >= monthStart && d <= monthEnd;
      }).length;
      if (monthlyCount >= 10) {
        return res.status(400).json({ message: 'Monthly leave limit (10) would be exceeded' });
      }
      l.date = newDate;
    }
    if (reason !== undefined) l.reason = reason;
    if (status !== undefined && ['Pending', 'Approved', 'Rejected'].includes(status)) l.status = status;
    await student.save();
    res.json(student.leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Leaves: Delete a leave - admin only
exports.deleteLeave = async (req, res) => {
  const { id, leaveId } = req.params;
  try {
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const before = (student.leaves || []).length;
    student.leaves = (student.leaves || []).filter(lv => String(lv.id) !== String(leaveId));
    if (student.leaves.length === before) return res.status(404).json({ message: 'Leave not found' });
    await student.save();
    res.json(student.leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
