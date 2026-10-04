const db = require('./config/db');
async function run() {
  try {
    await db.query('DROP TABLE IF EXISTS submission_records');
    await db.query('DROP TABLE IF EXISTS submission_tasks');
    await db.query('DROP TABLE IF EXISTS submissions');
    
    await db.query(`
      CREATE TABLE submission_tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        batch_code VARCHAR(10) NOT NULL,
        course_code VARCHAR(20) NOT NULL,
        title VARCHAR(150) NOT NULL,
        type ENUM('land_survey', 'other_subjects') NOT NULL,
        department VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await db.query(`
      CREATE TABLE submission_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT NOT NULL,
        student_id INT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        submitted_at TIMESTAMP NULL,
        FOREIGN KEY (task_id) REFERENCES submission_tasks(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_student_task (task_id, student_id)
      )
    `);
    console.log('Submission tables created');
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
run();
