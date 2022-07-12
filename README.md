# 1. Install all dependencies
``` bash
npm install
```

# 2. Run script to start server
``` bash
npm run server
```

# Routes

## GET
### /api/doctors - Gets a list of all doctors

### /api/appts/:doctor_id/:date - Gets list of appointments specific to doctor and date specific in request parameters
<br></br>
## POST
### /api - Adds appointment to database

Request body requires:
```
{
  "_id": Appointment id,
  "doctor_id": Patients doctor,
  "firstName": Patients first name,
  "lastName": Patients last name,
  "apptDate": Date of appt,
  "apptTime": Time of appt,
  "isNewPatient": Bool, is patient new or follow-up
}
```
<br></br>
## DELETE 
### /api/:apptId - Deletes appointment based on the appointment id passed in the request parameters