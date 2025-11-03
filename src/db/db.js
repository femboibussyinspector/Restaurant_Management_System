const mongoose = require('mongoose');

async function connectdb() {
  try {

    const connectionInstance = await mongoose.connect(
      process.env.MONGO_URI,
      {
        dbName: process.env.DB_NAME,
      }
    );

    console.log(
      `\nconnected to DataBase !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (err) {
    console.error('Error connecting to DataBase', err);
    process.exit(1); // Exit with failure
  }
}

module.exports = connectdb;

