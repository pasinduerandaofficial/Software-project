const pool = require('../config/db');

const getAllCourses = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, u.name AS lecturer_name 
      FROM courses c 
      LEFT JOIN users u ON c.lecturer_id = u.id
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyCourses = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM courses WHERE lecturer_id = ?', [req.user.id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createCourse = async (req, res) => {
  const { code, title, credits, lecturer_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO courses (code, title, credits, lecturer_id) VALUES (?, ?, ?, ?)',
      [code, title, credits, lecturer_id || null]
    );
    res.status(201).json({ message: 'Course created', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllCourses, getMyCourses, createCourse };