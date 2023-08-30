const Entry = require('../models/entryModel');

const EntryController = {
  async postEntry(req, res, next) {
    try {
      // get entries from the request body
      const { content } = req.body;
      // create a new entry
      const newEntry = await Entry.create({ content });
      // res.locals.entry is assigned to the newEntry
      res.locals.entry = newEntry;
      return next();
    } catch (err) {
      return next({
        log: `EntryController.postEntry: ERROR: ${err}`,
        status: err.status || 500,
        message: {
          err: 'error occurred in the postEntry method on EntryController.'
        }
      });
    }
  },

  // get all entries and post to the blog page
  async getEntries(req, res, next) {
    try {
      // get all the extant entries from the database
      const entries = await Entry.find({});
      // assign res.locals.entries to all entries found
      res.locals.entries = entries;
      return next();
    }  catch (err) {
      return next({
        log: `EntryController.getEntries: ERROR: ${err}`,
        status: err.status || 500,
        message: {
          err: 'error occurred in the getEntries method on EntryController.'
        }
      });
    }
  },
  // delete specific entry from the database
  async deleteEntry(req, res, next) {
    try {
      // get the id from the url endpoint
      const { entryId } = req.params;
      const query = { _id: entryId };
      // delete action to remove item from the database
      await Entry.deleteOne( query ); 
      console.log(`deleted ${query}`);
      return next();
    } catch (err) {
      return next({
        log: `EntryController.deleteEntry: ERROR: ${err}`,
        status: err.status || 500,
        message: {
          err: 'error occurred in the deleteEntry method on EntryController.'
        } 
      });
    }
 }




};












module.exports = EntryController;
