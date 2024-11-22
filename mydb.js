const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to your .db file
const dbFilePath = path.resolve(__dirname, './databaseSQLite/schedulerData.db');

// Connect to the SQLite database
const db = new sqlite3.Database(dbFilePath, (err) => {
  if (err) {
    console.error('Failed to connect to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});




module.exports = db;
