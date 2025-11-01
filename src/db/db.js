const mongoose = require('mongoose');

// This is the updated connection function
async function connectdb() {
  try {
    // We are adding an options object { dbName: ... }
    // This forces Mongoose to use the database you specified
    const connectionInstance = await mongoose.connect(
      process.env.MONGO_URI,
      {
        dbName: process.env.DB_NAME,
      }
    );

    console.log(
      `connected to DataBase !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (err) {
    console.error('Error connecting to DataBase', err);
    process.exit(1); // Exit with failure
  }
}

module.exports = connectdb;

