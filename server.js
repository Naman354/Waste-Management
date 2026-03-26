const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/bins',      require('./routes/binRoutes.js'));
app.use('/complaint', require('./routes/complaintRoutes.js'));
app.use('/classify',  require('./routes/classifyRoutes.js'));
app.use('/route',     require('./routes/routeRoutes.js'));
app.use('/driver',    require('./routes/driverRoutes.js'));
app.use('/drivers',   require('./routes/driverRoutes.js'));
app.use('/wards',     require('./routes/wardRoutes.js'));
app.use('/stats',     require('./routes/statsRoutes.js'));

// Health check
app.get('/', (req, res) => {
  res.send('Smart Waste Management API is running' );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
