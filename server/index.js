require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Initialize DB connection

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Basic Health Check Route
app.get('/', (req, res) => {
  res.send('Geomatics Portal API is running!');
});

// Route Mounts (Placeholders to be filled)
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/results', require('./routes/resultRoutes'));
// app.use('/api/timetable', require('./routes/timetableRoutes'));
// app.use('/api/medical', require('./routes/medicalRoutes'));
// app.use('/api/courses', require('./routes/courseRoutes'));
// app.use('/api/notices', require('./routes/noticeRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
