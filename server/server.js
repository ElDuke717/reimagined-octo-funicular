const express = require('express');
const app = express();
const port = 3333;

const path = require('path');
const cookieParser = require('cookie-parser');


// add link to controllers here
const entryController = require('./controllers/entryController');
const authController = require('./controllers/authController');

// Middleware to handle urls
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies from requests, don't forget to use it!
app.use(express.json());
// invoke cookieParser
app.use(cookieParser());


// serve static files - will handle right content type with express
app.use('/assets', express.static(path.resolve(__dirname, '../assets')));

// serve index.html sign-in page
app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname + '/../views/index.html'));
});

// serve the blog view
app.get('/blog', (req, res) => {
  return res.sendFile(path.join(__dirname + '/../views/blog.html'));
});

// route for posting blog posts
app.post('/entries', entryController.postEntry, (req, res) => {
  return res.status(201).json(res.locals.entry);
});

// get method on entries to see all blog entries
app.get('/entries', entryController.getEntries, (req, res) => {
  // get all entries in the database
  return res.status(200).json(res.locals.entries);
});

// delete method on entries to delete a blog entry
app.delete('/entries/:entryId', entryController.deleteEntry, (req, res) => {
  return res.status(200).json(res.locals.entry);
});

//catch-all route handler for requests to an unknown route - sends to a 404 page
app.use((req, res) => res.status(404).sendFile(path.resolve(__dirname + '/../views/404.html')));

// global error handler to catch all errors not related to routes
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// listen on unique specified port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
