const pool = require('../config/db');

const getAllCourses = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM courses');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createCourse = async (req, res) => {
  const { code, title, credits } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO courses (code, title, credits) VALUES (?, ?, ?)',
      [code, title, credits]
    );
    res.status(201).json({ message: 'Course created', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllCourses, createCourse };