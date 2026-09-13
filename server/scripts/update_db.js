require('dotenv').config();
const mysql = require('mysql2/promise');

async function updateDb() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'geomatics_portal',
    port: process.env.DB_PORT || 3306,
  });

  try {
    console.log('Adding lecturer_id to courses table...');
    await connection.query('ALTER TABLE courses ADD COLUMN lecturer_id INT');
    await connection.query('ALTER TABLE courses ADD FOREIGN KEY (lecturer_id) REFERENCES users(id) ON DELETE SET NULL');
    console.log('Database updated successfully.');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Column lecturer_id already exists.');
    } else {
      console.error('Error updating db:', error);
    }
  } finally {
    await connection.end();
  }
}

updateDb();
