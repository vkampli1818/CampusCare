const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'default_secret_key', {
    expiresIn: '24h',
  });
};

exports.adminExists = async (req, res) => {
  try {
    const exists = await User.exists({ role: 'admin' });
    res.json({ exists: !!exists });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.register = async (req, res) => {
  const { name, email, password, role, department, phone, cgpa, designation, specifications } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }
  if (!['admin', 'teacher'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  try {
    // Policy: if no admin exists, allow creating the first admin without a token.
    // Otherwise, only an authenticated admin can register users.
    const adminExists = await User.exists({ role: 'admin' });
    if (!adminExists) {
      if (role !== 'admin') {
        return res.status(400).json({ message: 'First user must be an admin' });
      }
      // proceed without token
    } else {
      // Require valid admin token
      const authHeader = req.headers.authorization || '';
      if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, token missing' });
      }
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const requestingUser = await User.findById(decoded.id);
        if (!requestingUser || requestingUser.role !== 'admin') {
          return res.status(403).json({ message: 'Access denied: admin only' });
        }
      } catch (e) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    if (role === 'teacher' && !email.endsWith('@campuscare.com')) {
      return res.status(400).json({ message: 'Teacher email must end with @campuscare.com' });
    }

    const user = new User({
      name,
      email,
      password,
      role,
      department,
      phone,
      // cgpa: keep schema but do not set from teacher registration
      designation,
      specifications,
    });
    await user.save();

    const token = generateToken(user._id, user.role);
    console.log(`User ${user.email} logged in successfully`);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department || null,
        phone: user.phone || null,
        designation: user.designation || null,
        specifications: user.specifications || null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(`Failed login attempt for email: ${email} - Incorrect password`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);
    console.log(`User ${user.email} logged in successfully`);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department || null,
        phone: user.phone || null,
        designation: user.designation || null,
        specifications: user.specifications || null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-password');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
