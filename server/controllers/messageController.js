const pool = require('../config/db');

exports.getContacts = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let query = 'SELECT id, name, reg_no, role, department FROM users WHERE id != ?';
    let params = [userId];
    
    if (userRole === 'student') {
      query += ' AND NOT (role = "admin" AND department IS NULL)';
    }
    
    query += ' ORDER BY role ASC, name ASC';
    
    const [contacts] = await pool.query(query, params);
    res.json({ success: true, contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    // Get unique users who have sent a message to or received a message from this user
    const query = `
      SELECT 
        u.id, 
        u.name, 
        u.reg_no, 
        u.role,
        u.department,
        (SELECT message_text FROM messages WHERE (sender_id = u.id AND receiver_id = ?) OR (sender_id = ? AND receiver_id = u.id) ORDER BY created_at DESC LIMIT 1) as latest_message,
        (SELECT created_at FROM messages WHERE (sender_id = u.id AND receiver_id = ?) OR (sender_id = ? AND receiver_id = u.id) ORDER BY created_at DESC LIMIT 1) as latest_time,
        (SELECT COUNT(*) FROM messages WHERE sender_id = u.id AND receiver_id = ? AND is_read = false) as unread_count
      FROM users u
      WHERE u.id IN (
        SELECT sender_id FROM messages WHERE receiver_id = ?
        UNION
        SELECT receiver_id FROM messages WHERE sender_id = ?
      )
      ORDER BY latest_time DESC
    `;
    const [conversations] = await pool.query(query, [userId, userId, userId, userId, userId, userId, userId]);
    res.json({ success: true, conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getThread = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    // Mark messages from otherUser to currentUser as read
    await pool.query(
      'UPDATE messages SET is_read = true WHERE sender_id = ? AND receiver_id = ?',
      [otherUserId, userId]
    );

    const [messages] = await pool.query(
      `SELECT * FROM messages 
       WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
       ORDER BY created_at ASC`,
      [userId, otherUserId, otherUserId, userId]
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching thread:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const senderRole = req.user.role;
    const { receiverId, messageText } = req.body;

    if (!receiverId || !messageText) {
      return res.status(400).json({ success: false, message: 'Missing receiver or message' });
    }

    if (senderRole === 'student') {
      const [receiverRows] = await pool.query('SELECT role, department FROM users WHERE id = ?', [receiverId]);
      if (receiverRows.length > 0) {
        const receiver = receiverRows[0];
        if (receiver.role === 'admin' && !receiver.department) {
          return res.status(403).json({ success: false, message: 'Students are not permitted to message System Admins.' });
        }
      }
    }

    const [result] = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, message_text) VALUES (?, ?, ?)',
      [senderId, receiverId, messageText]
    );

    const [newMessage] = await pool.query('SELECT * FROM messages WHERE id = ?', [result.insertId]);

    res.status(201).json({ success: true, message: newMessage[0] });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      'SELECT COUNT(*) as unread FROM messages WHERE receiver_id = ? AND is_read = false',
      [userId]
    );
    res.json({ success: true, unread: rows[0].unread });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
