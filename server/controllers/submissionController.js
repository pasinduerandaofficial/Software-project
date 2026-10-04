const pool = require('../config/db');

// ======== ADMIN CONTROLLERS ========

exports.getTasks = async (req, res) => {
  try {
    const { department, batch_code, type } = req.query;
    let query = 'SELECT * FROM submission_tasks WHERE 1=1';
    let params = [];

    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }
    if (batch_code) {
      query += ' AND batch_code = ?';
      params.push(batch_code);
    }
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTask = async (req, res) => {
  const { batch_code, course_code, title, type, department } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO submission_tasks (batch_code, course_code, title, type, department) VALUES (?, ?, ?, ?, ?)',
      [batch_code, course_code, title, type, department]
    );

    // Auto-create pending submission records for all students in that batch
    // Using a regex to find students of that batch. E.g., batch '21GES' -> reg_no starts with '21GES'
    const [students] = await pool.query(
      'SELECT id FROM users WHERE role = "student" AND (reg_no LIKE ? OR batch_code = ?)', 
      [`${batch_code}%`, batch_code]
    );
    
    if (students.length > 0) {
      const values = students.map(s => [result.insertId, s.id, 'pending']);
      await pool.query(
        'INSERT INTO submission_records (task_id, student_id, status) VALUES ?',
        [values]
      );
    }

    res.status(201).json({ message: 'Task created', id: result.insertId });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await pool.query('DELETE FROM submission_tasks WHERE id = ?', [req.params.id]);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Gets all submission records for a specific task
exports.getRecordsForTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const [rows] = await pool.query(`
      SELECT r.*, u.name as student_name, u.reg_no as student_reg_no 
      FROM submission_records r
      JOIN users u ON r.student_id = u.id
      WHERE r.task_id = ?
      ORDER BY u.reg_no ASC
    `, [taskId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateRecordStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query(
      'UPDATE submission_records SET status = ?, submitted_at = IF(status != "pending", CURRENT_TIMESTAMP, NULL) WHERE id = ?',
      [status, id]
    );
    res.json({ message: 'Status updated' });
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// ======== STUDENT CONTROLLERS ========

exports.getMySubmissions = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { type } = req.query; // 'land_survey' or 'other_subjects'

    let query = `
      SELECT r.id as record_id, r.status, r.submitted_at, 
             t.id as task_id, t.title, t.course_code, t.type
      FROM submission_records r
      JOIN submission_tasks t ON r.task_id = t.id
      WHERE r.student_id = ?
    `;
    let params = [studentId];

    if (type) {
      query += ' AND t.type = ?';
      params.push(type);
    }

    query += ' ORDER BY t.created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching student submissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
