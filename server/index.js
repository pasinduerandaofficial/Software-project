require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db'); 

const app = express();


app.use(cors());
app.use(express.json()); 


app.get('/', (req, res) => {
  res.send('Geomatics Portal API is running!');
});


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/medical', require('./routes/medicalRoutes'));
app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));
app.use('/api/timetable', require('./routes/timetableRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
