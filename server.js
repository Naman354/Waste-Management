const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/bins',      require('./routes/binRoutes'));
app.use('/complaint', require('./routes/complaintRoutes'));
app.use('/classify',  require('./routes/classifyRoutes'));
app.use('/route',     require('./routes/routeRoutes'));
app.use('/driver',    require('./routes/driverRoutes'));
app.use('/drivers',   require('./routes/driverRoutes'));
app.use('/wards',     require('./routes/wardRoutes'));
app.use('/stats',     require('./routes/statsRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Smart Waste Management API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
