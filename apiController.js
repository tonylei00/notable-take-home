const fs = require('fs/promises');
const path = require('path');

const apiController = {};

// parse database, go through list of doctors, concatenate their last and first name and append to a list
apiController.getAllDoctors = (req, res, next) => {
  const doctorsList = [];

  fs.readFile(path.resolve(__dirname, "./data/doctors.json"), 'UTF-8')
    .then(data => {
      const parsedData = JSON.parse(data);

      parsedData.forEach(doctor => {
        const { firstName, lastName } = doctor;
        const name = `${lastName}, ${firstName}`;
        doctorsList.push(name);
      });

      res.locals.doctors = doctorsList;
      return next();
    }).catch(err => next(err));
};

// filter out appointments according to request parameters of doctorId and the date
apiController.getApptForDoctor = (req, res, next) => {
  const apptList = [];
  const { doctorId, date } = req.params;
  console.log(req.params);

  fs.readFile(path.resolve(__dirname, "./data/appointments.json"), 'UTF-8')
    .then(data => {
      const parsedData = JSON.parse(data);
      
      parsedData.forEach(appt => {
        const { doctor_id, apptDate } = appt;
        console.log(appt);
        if (doctor_id == doctorId) {
          if (apptDate == date) {
            apptList.push(appt);
          }
        };
      });

      res.locals.appts = apptList;
      return next();
    }).catch(err => next(err));
};

// logic to add an appointment
apiController.addAppointment = (req, res, next) => {
  const propArray = [ '_id', 'doctor_id', 'firstName', 'lastName', 'apptDate', 'apptTime', 'isNewPatient' ];
  const message = { err: 'Insufficient data receieved' };
  res.locals.newAppointment = {};
  // make sure req body has all the required data
  for (const prop of propArray) {
    if (!req.body.hasOwnProperty(prop)) {
      return next({ ...message });
    }
    res.locals.newAppointment[prop] = req.body[prop];
  };

  // func to make sure time is within a 15 min block
  const isValidTime = (time) => {
    const digitArr = [];

    for (let i = 0; i < time.length; i++) {
      if (time[i] === ':') {
        digitArr.push(time[i + 1]);
        digitArr.push(time[i + 2]);
      }
    };

    const mins = Number(digitArr.join(''));
    return (mins % 15 === 0);
  };
  // throw an error if appointment isn't in valid time block
  if (!isValidTime(req.body.apptTime)) {
    return next({ err: "Not a valid 15 minute time block" });
  };

  fs.readFile(path.resolve(__dirname, "./data/appointments.json"), 'UTF-8')
    .then(data => {
      const parsedData = JSON.parse(data);

      // make sure there aren't 3 appts scheduled on the same time block on a given day for a doctor
      const filteredData = parsedData.filter(el => {
        return (el.doctor_id === req.body.doctor_id && el.apptDate === req.body.apptDate && el.apptTime === req.body.apptTime)
      });

      if (filteredData.length === 3) {
        return next(err);
      };

      parsedData.push(res.locals.newAppointment);
      console.log(parsedData);

      fs.writeFile(path.resolve(__dirname, './data/appointments.json'),
      JSON.stringify(parsedData), 'UTF-8')
        .catch(err => next(err));
      
    }).catch(err => next(err));

  return next();
}




// match appointment id in request params and delete accordingly
apiController.deleteAppointment = (req, res, next) => {
  const { apptId } = req.params;

  fs.readFile(path.resolve(__dirname, "./data/appointments.json"), 'UTF-8')
    .then(data => {
      const parsedData = JSON.parse(data);
      let deleted;

      for (let i = 0; i < parsedData.length; i++) {
        if (parsedData[i]._id == apptId) {
          deleted = parsedData[i];
          parsedData.splice(i, 1);
        }
      };

      // update database with appointment removed
      fs.writeFile(path.resolve(__dirname, './data/appointments.json'),
      JSON.stringify(parsedData), 'UTF-8')
        .then(() => {
          // save the deleted appointment in res.locals
          res.locals.deletedAppointment = deleted;
        })
        .catch(err => next(err));

      return next();
    })
    .catch(err => next(err));
}

// export controller
module.exports = apiController;