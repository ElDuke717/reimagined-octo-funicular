require('dotenv').config({ path: __dirname + '../../.env'});

// v-- REPLACE THE EMPTY STRING WITH YOUR LOCAL/MLAB/ELEPHANTSQL URI
const myURI = "";

// UNCOMMENT THE LINE BELOW IF USING MONGO
const URI = process.env.MONGO_URI || myURI;

// UNCOMMENT THE LINE BELOW IF USING POSTGRESQL
// const URI = process.env.PG_URI || myURI;

const mongoose = require('mongoose');
// connect mongoose to the database
mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true});
// db is set to the mogoose.connection object
const db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  // we're connected!
  console.log('Successfully connected to MongoDB');
});

const entrySchema = new mongoose.Schema({
  content : { type: String, required: true },
  // createdAt has a date type and a default value of Date.now
  created_at : { type : Date, default: Date.now }
});

module.exports = mongoose.model('Entry', entrySchema); // <-- export your model
