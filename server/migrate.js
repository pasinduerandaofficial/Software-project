const db = require('./config/db');

async function run() {
  try {
    try { await db.query('ALTER TABLE users ADD COLUMN batch_code VARCHAR(20) DEFAULT NULL'); } catch (e) {}
    try { await db.query('ALTER TABLE users ADD COLUMN academic_year INT DEFAULT 1'); } catch (e) {}
    try { await db.query('ALTER TABLE users ADD COLUMN current_semester INT DEFAULT 1'); } catch (e) {}
    
    await db.query(`
      CREATE TABLE IF NOT EXISTS timetable_slots (
        id INT AUTO_INCREMENT PRIMARY KEY,
        department VARCHAR(50) NOT NULL,
        batch_code VARCHAR(20) NOT NULL,
        semester INT NOT NULL,
        day_of_week VARCHAR(15) NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        course_code VARCHAR(20),
        course_name VARCHAR(150),
        lecture_hall VARCHAR(100),
        lecturer_id INT,
        lecturer_name VARCHAR(100),
        status VARCHAR(50) DEFAULT 'scheduled',
        special_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    try { await db.query('ALTER TABLE notices ADD COLUMN target_batch VARCHAR(50) DEFAULT "all"'); } catch (e) {}
    
    await db.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        department VARCHAR(50),
        type ENUM('land_survey', 'other_subjects') NOT NULL,
        title VARCHAR(150),
        status VARCHAR(50) DEFAULT 'Pending',
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database updated successfully');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

run();
