const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function initDB() {
  try {
    // Connect without database selected first to create it if needed
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhos:3306',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('Connected to MySQL server.');

    // Read schema.sql
    const schemaPath = path.join(__dirname, '../schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema
    console.log('Executing schema.sql...');
    await connection.query(schemaSql);
    console.log('Database and tables created successfully.');

    // Switch to database
    await connection.query(`USE ${process.env.DB_NAME || 'geomatics_portal'}`);

    // Create default Admin user if not exists
    const [rows] = await connection.query('SELECT * FROM users WHERE reg_no = "admin"');
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.query(
        'INSERT INTO users (reg_no, name, password_hash, role) VALUES (?, ?, ?, ?)',
        ['admin', 'System Admin', hashedPassword, 'admin']
      );
      console.log('Default admin account created (reg_no: admin, password: admin123)');
    } else {
      console.log('Admin account already exists.');
    }

    // Create default Student and Lecturer for demo
    const [students] = await connection.query('SELECT * FROM users WHERE role = "student"');
    if (students.length === 0) {
      const pass = await bcrypt.hash('student123', 10);
      await connection.query(
        'INSERT INTO users (reg_no, name, password_hash, role) VALUES (?, ?, ?, ?)',
        ['EG/2021/4000', 'Pasindu Eranda', pass, 'student']
      );
      console.log('Default student account created (reg_no: EG/2021/4000, password: student123)');
    }

    const [lecturers] = await connection.query('SELECT * FROM users WHERE role = "lecturer"');
    if (lecturers.length === 0) {
      const pass = await bcrypt.hash('lecturer123', 10);
      await connection.query(
        'INSERT INTO users (reg_no, name, password_hash, role) VALUES (?, ?, ?, ?)',
        ['EMP/105', 'Dr. Saman Silva', pass, 'lecturer']
      );
      console.log('Default lecturer account created (reg_no: EMP/105, password: lecturer123)');
    }

    await connection.end();
    console.log('Database initialization complete.');
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
}

initDB();
