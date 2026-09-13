const pool = require('../config/db');

const getMyResults = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.id, r.grade, c.code, c.title, c.credits 
      FROM results r 
      JOIN courses c ON r.course_id = c.id 
      WHERE r.student_id = ?
    `, [req.user.id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const submitResult = async (req, res) => {
  const { studentRegNo, courseCode, grade } = req.body;
  try {
    // Look up student and course IDs
    const [users] = await pool.query('SELECT id FROM users WHERE reg_no = ? AND role = "student"', [studentRegNo]);
    const [courses] = await pool.query('SELECT id FROM courses WHERE code = ?', [courseCode]);
    
    if (users.length === 0 || courses.length === 0) {
      return res.status(404).json({ message: 'Student or course not found' });
    }

    const studentId = users[0].id;
    const courseId = courses[0].id;

    // Check if result already exists and update, else insert
    const [existing] = await pool.query('SELECT id FROM results WHERE student_id = ? AND course_id = ?', [studentId, courseId]);
    
    if (existing.length > 0) {
      await pool.query('UPDATE results SET grade = ? WHERE id = ?', [grade, existing[0].id]);
      res.json({ message: 'Result updated' });
    } else {
      await pool.query('INSERT INTO results (student_id, course_id, grade) VALUES (?, ?, ?)', [studentId, courseId, grade]);
      res.status(201).json({ message: 'Result added' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMyResults, submitResult };