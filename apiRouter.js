const express = require('express');
const router = express.Router();
const apiController = require('./apiController.js');

// GET req for list of all doctors
router.get('/doctors', apiController.getAllDoctors, (req, res) => {
  return res.status(200).json(res.locals.doctors);
});

// GET req for list of appoints for specific doctor on specific date
router.get('/appts/:doctorId/:date', apiController.getApptForDoctor, (req, res) => {
  return res.status(200).json(res.locals.appts);
});

// POST req to update a doctor's calendar
router.post('/', apiController.addAppointment, (req, res) => {
  return res.status(200).send('Appointment added!');
});

// DELETE req to delete an appointment
router.delete('/:apptId', apiController.deleteAppointment, (req, res) => {
  return res.status(200).send('Appointment removed!');
});

module.exports = router;