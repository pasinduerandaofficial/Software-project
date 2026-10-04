const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, reg_no, name, role, department, created_at FROM users');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createUser = async (req, res) => {
  const { regNo, name, password, role, department } = req.body;
  if (!regNo || !name || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (reg_no, name, password_hash, role, department) VALUES (?, ?, ?, ?, ?)',
      [regNo, name, hashedPassword, role, department || null]
    );
    res.status(201).json({ message: 'User created', id: result.insertId });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Registration number already exists.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  const { regNo, name, role, department } = req.body;
  try {
    await pool.query(
      'UPDATE users SET reg_no = ?, name = ?, role = ?, department = ? WHERE id = ?',
      [regNo, name, role, department || null, req.params.id]
    );
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Registration number already exists.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllUsers, createUser, deleteUser, updateUser };