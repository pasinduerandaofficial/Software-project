const pool = require('../config/db');

const getActiveNotices = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM notices WHERE status = "active" ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createNotice = async (req, res) => {
  const { message } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO notices (message) VALUES (?)', [message]);
    res.status(201).json({ message: 'Notice created', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteNotice = async (req, res) => {
  try {
    await pool.query('DELETE FROM notices WHERE id = ?', [req.params.id]);
    res.json({ message: 'Notice deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getActiveNotices, createNotice, deleteNotice };