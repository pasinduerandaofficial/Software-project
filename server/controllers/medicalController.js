const pool = require('../config/db');

const getMyRequests = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM medical_requests WHERE student_id = ?', [req.user.id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createRequest = async (req, res) => {
  const { absenceDate, reason, referenceId } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO medical_requests (student_id, absence_date, reason, reference_id) VALUES (?, ?, ?, ?)',
      [req.user.id, absenceDate, reason, referenceId || null]
    );
    res.status(201).json({ message: 'Medical request submitted', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.*, u.reg_no, u.name 
      FROM medical_requests m 
      JOIN users u ON m.student_id = u.id
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateRequestStatus = async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query('UPDATE medical_requests SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Status updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMyRequests, createRequest, getAllRequests, updateRequestStatus };