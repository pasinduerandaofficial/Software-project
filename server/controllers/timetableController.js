const pool = require('../config/db');

const getTimetable = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, c.code, c.title 
      FROM timetable t 
      JOIN courses c ON t.course_id = c.id
      ORDER BY FIELD(t.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), t.start_time
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addSlot = async (req, res) => {
  const { courseCode, dayOfWeek, startTime, endTime, hall } = req.body;
  try {
    const [courses] = await pool.query('SELECT id FROM courses WHERE code = ?', [courseCode]);
    if (courses.length === 0) return res.status(404).json({ message: 'Course not found' });

    const [result] = await pool.query(
      'INSERT INTO timetable (course_id, day_of_week, start_time, end_time, hall) VALUES (?, ?, ?, ?, ?)',
      [courses[0].id, dayOfWeek, startTime, endTime, hall]
    );
    res.status(201).json({ message: 'Slot added', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteSlot = async (req, res) => {
  try {
    await pool.query('DELETE FROM timetable WHERE id = ?', [req.params.id]);
    res.json({ message: 'Slot deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTimetable, addSlot, deleteSlot };