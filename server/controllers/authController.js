const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const login = async (req, res) => {
  const { regNo, password } = req.body;

  if (!regNo || !password) {
    return res.status(400).json({ message: 'Registration number and password are required.' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE reg_no = ?', [regNo]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    let user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Auto-parse batch info for students
    if (user.role === 'student' && user.reg_no) {
      const match = user.reg_no.match(/^(\d{2})([A-Z]+)\d+$/i);
      if (match) {
        const batchYearPart = parseInt(match[1]); // e.g. 22
        const deptCode = match[2]; // e.g. GES
        const batchCode = `${match[1]}${deptCode}`.toUpperCase();
        
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const entryYear = 2000 + batchYearPart;
        
        let yearsDiff = currentYear - entryYear;
        // Assume new academic year starts around July/August (month 7)
        // If before July, they are in the 2nd semester of the PREVIOUS year's cycle, or 1st semester if it's delayed.
        // Let's use a simple heuristic:
        const semester = Math.max(1, Math.min(8, (yearsDiff * 2) + (currentMonth > 6 ? 2 : 1)));
        const academicYear = Math.ceil(semester / 2);

        // Update DB if not set or changed
        if (user.batch_code !== batchCode || user.academic_year !== academicYear || user.current_semester !== semester) {
          await pool.query(
            'UPDATE users SET batch_code = ?, academic_year = ?, current_semester = ? WHERE id = ?',
            [batchCode, academicYear, semester, user.id]
          );
          user.batch_code = batchCode;
          user.academic_year = academicYear;
          user.current_semester = semester;
        }
      }
    }

    // Generate JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role, 
        name: user.name, 
        regNo: user.reg_no, 
        department: user.department,
        batchCode: user.batch_code,
        academicYear: user.academic_year,
        currentSemester: user.current_semester
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        regNo: user.reg_no,
        department: user.department,
        batchCode: user.batch_code,
        academicYear: user.academic_year,
        currentSemester: user.current_semester
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login };