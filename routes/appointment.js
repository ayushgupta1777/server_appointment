const express = require('express');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/book', async (req, res) => {
  const { studentId, teacherId, date, time } = req.body;
  try {
    const newAppointment = new Appointment({ studentId, teacherId, date, time });
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: 'Error booking appointment', details: error.message });
  }
});

router.get('/user', authenticateUser, (req, res) => {
  try {
   console.log('Decoded user%ol:', req.user);
    const { id, role} = req.user;
    res.json({ id, role });
  } catch (error) {
    console.error('Error in /api/user endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/appointment/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const appointments = await Appointment.findOne({ studentId: id });
    if (!appointments) {
      return res.status(404).json({ error: 'Appointments not found' });
    }
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching appointments' });
  }
});

router.put('/confirm/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findOne({ studentId: id });
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    appointment.confirmed = true;
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Error confirming appointment' });
  }
});



router.get('/student/:studentId', async (req, res) => {
  const { studentId } = req.params;
  try {
    const appointments = await Appointment.find({ studentId: studentId }).populate('teacherId', 'name');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching appointments' });
  }
});

// Fetch appointments for a specific teacher
router.get('/teacher/:teacherId', async (req, res) => {
  const { teacherId } = req.params;
  try {
    const appointments = await Appointment.find({ teacherId: teacherId }).populate('studentId', 'name');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching appointments' });
  }
});

module.exports = router;
