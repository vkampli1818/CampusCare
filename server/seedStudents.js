const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const Student = require('./models/Student');

dotenv.config();

const students = [
  // Year 1 - Division A (with explicit campuscare.com emails)
  { rollNo: '23FY-A01', uucsmsNo: 'UUCMS101', name: 'Aarya Patil',    feeStatus: 'Paid',     marks: 81, cgpa: 8.1, email: 'aarya.patil@campuscare.com' },
  { rollNo: '23FY-A02', uucsmsNo: 'UUCMS102', name: 'Manav Rao',      feeStatus: 'Pending',  marks: 76, cgpa: 7.6, email: 'manav.rao@campuscare.com' },
  { rollNo: '23FY-A03', uucsmsNo: 'UUCMS103', name: 'Dhruv Shetty',   feeStatus: 'Paid',     marks: 89, cgpa: 8.9, email: 'dhruv.shetty@campuscare.com' },
  { rollNo: '23FY-A04', uucsmsNo: 'UUCMS104', name: 'Riya Nair',      feeStatus: 'Paid',     marks: 92, cgpa: 9.2, email: 'riya.nair@campuscare.com' },
  { rollNo: '23FY-A05', uucsmsNo: 'UUCMS105', name: 'Kiran Joshi',    feeStatus: 'Not Paid', marks: 63, cgpa: 6.3, email: 'kiran.joshi@campuscare.com' },
  { rollNo: '23FY-A06', uucsmsNo: 'UUCMS106', name: 'Shreya Desai',   feeStatus: 'Paid',     marks: 84, cgpa: 8.4, email: 'shreya.desai@campuscare.com' },
  { rollNo: '23FY-A07', uucsmsNo: 'UUCMS107', name: 'Tanish Gupta',   feeStatus: 'Pending',  marks: 72, cgpa: 7.2, email: 'tanish.gupta@campuscare.com' },
  { rollNo: '23FY-A08', uucsmsNo: 'UUCMS108', name: 'Meenal Shah',    feeStatus: 'Paid',     marks: 87, cgpa: 8.7, email: 'meenal.shah@campuscare.com' },
  { rollNo: '23FY-A09', uucsmsNo: 'UUCMS109', name: 'Vivek R',        feeStatus: 'Not Paid', marks: 69, cgpa: 6.9, email: 'vivek.r@campuscare.com' },
  { rollNo: '23FY-A10', uucsmsNo: 'UUCMS110', name: 'Pavan M',        feeStatus: 'Paid',     marks: 90, cgpa: 9.0, email: 'pavan.m@campuscare.com' },
];

const seed = async () => {
  try {
    await connectDB();
    // Remove all existing students before seeding fresh data
    await Student.deleteMany({});
    for (const s of students) {
      await Student.updateOne(
        { rollNo: s.rollNo },
        {
          name: s.name,
          rollNo: s.rollNo,
          uucsmsNo: s.uucsmsNo,
          email: s.email,
          feeStatus: s.feeStatus,
          marks: s.marks,
          cgpa: s.cgpa,
        },
        { upsert: true }
      );
    }
    console.log('Student seed completed');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
};

seed();
