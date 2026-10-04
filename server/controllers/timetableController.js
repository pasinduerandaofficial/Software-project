const pool = require('../config/db');

const getTimetable = async (req, res) => {
  try {
    const { department, batch_code, lecturer_id } = req.query;
    let query = 'SELECT * FROM timetable_slots WHERE 1=1';
    let params = [];

    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }
    
    if (batch_code) {
      query += ' AND batch_code = ?';
      params.push(batch_code);
    }
    
    if (lecturer_id) {
      query += ' AND lecturer_id = ?';
      params.push(lecturer_id);
    }

    query += ` ORDER BY FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), start_time ASC`;

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addSlot = async (req, res) => {
  const { department, batch_code, semester, day_of_week, start_time, end_time, course_code, course_name, lecture_hall, lecturer_id, lecturer_name, special_notes } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO timetable_slots 
      (department, batch_code, semester, day_of_week, start_time, end_time, course_code, course_name, lecture_hall, lecturer_id, lecturer_name, special_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [department, batch_code, semester || 1, day_of_week, start_time, end_time, course_code, course_name, lecture_hall, lecturer_id || null, lecturer_name, special_notes]
    );
    res.status(201).json({ message: 'Slot added', id: result.insertId });
  } catch (error) {
    console.error('Error adding slot:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSlot = async (req, res) => {
  const { id } = req.params;
  const { status, lecture_hall, special_notes } = req.body;
  try {
    await pool.query(
      'UPDATE timetable_slots SET status = ?, lecture_hall = ?, special_notes = ? WHERE id = ?',
      [status, lecture_hall, special_notes, id]
    );
    res.json({ message: 'Slot updated' });
  } catch (error) {
    console.error('Error updating slot:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteSlot = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM timetable_slots WHERE id = ?', [id]);
    res.json({ message: 'Slot deleted' });
  } catch (error) {
    console.error('Error deleting slot:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTimetable, addSlot, updateSlot, deleteSlot };