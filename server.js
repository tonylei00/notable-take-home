const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// require routers
const apiRouter = require('./apiRouter.js');

// handle parsing of request body
app.use(express.json());

// route handlers
app.use('/api', apiRouter);

// route handler to respond with main page
app.get('/', (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, './index.html'));
});

//route handler to catch requests to unknown routes
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// express global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occured' },
  }
  const customErr = Object.assign({}, defaultErr, err);

  console.log(customErr.log);

  return res.status(customErr.status).json(customErr.message);
});

// connect server to port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});