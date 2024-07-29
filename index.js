const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointment');
const userRoutes = require('./routes/user');

const app = express();
app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000', // React app's origin
    credentials: true, // If you need to send cookies with the requests
  }));
  
//   app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/api', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api', userRoutes);

connectDB().then(() => {
  app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });
}).catch(error => {
  console.error('Unable to connect to the database:', error);
});
