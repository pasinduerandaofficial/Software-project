const pool = require('../config/db');

const getActiveNotices = async (req, res) => {
  try {
    const { department, batch } = req.query;
    let query = 'SELECT * FROM notices WHERE status = "active"';
    let params = [];

    if (department) {
      query += ' AND (department = ? OR department IS NULL)';
      params.push(department);
    }
    
    if (batch) {
      query += ' AND (target_batch = "all" OR target_batch = ?)';
      params.push(batch);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createNotice = async (req, res) => {
  const { message, department, target_batch } = req.body;
  const author_name = req.user.name;
  try {
    const [result] = await pool.query(
      'INSERT INTO notices (message, department, author_name, target_batch) VALUES (?, ?, ?, ?)', 
      [message, department, author_name, target_batch || 'all']
    );
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

const getUnreadCount = async (req, res) => {
  try {
    const { department, batch } = req.query;
    const userId = req.user.id;

    // Get user's last read time
    const [userRows] = await pool.query('SELECT last_read_notice_time FROM users WHERE id = ?', [userId]);
    const lastRead = userRows[0]?.last_read_notice_time;

    let query = 'SELECT COUNT(*) as unread FROM notices WHERE status = "active"';
    let params = [];

    if (department) {
      query += ' AND (department = ? OR department IS NULL)';
      params.push(department);
    }
    
    if (batch) {
      query += ' AND (target_batch = "all" OR target_batch = ?)';
      params.push(batch);
    }
    
    if (lastRead) {
      query += ' AND created_at > ?';
      params.push(lastRead);
    }

    const [rows] = await pool.query(query, params);
    res.json({ success: true, unread: rows[0].unread });
  } catch (error) {
    console.error('Error fetching unread notices count:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const markRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await pool.query('UPDATE users SET last_read_notice_time = CURRENT_TIMESTAMP WHERE id = ?', [userId]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking notices as read:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getActiveNotices, createNotice, deleteNotice, getUnreadCount, markRead };