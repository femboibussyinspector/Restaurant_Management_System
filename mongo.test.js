const mongoose = require('mongoose');
require('dotenv').config();

// --- THIS IS THE FIX ---
// We just import the User model directly from the file.
const User = require('./src/models/User');

// --- THE TEST FUNCTION ---
async function runTest() {
  try {
    // 1. CONNECT
    console.log('--- 1. CONNECTING ---');
    console.log(`--- Using DB_NAME: ${process.env.DB_NAME} ---`);
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log('--- 2. CONNECTED! ---');

    // 2. RUN THE QUERY
    console.log("--- 3. RUNNING User.findOne({ email: 'shlok@test.com' }) ---");
    const user = await User.findOne({ email: 'shlok@test.com' });
    console.log('--- 4. QUERY FINISHED! ---');

    // 3. SHOW RESULTS
    if (user) {
      console.log('--- 5. RESULT: Found a user! ---', user.name);
    } else {
      console.log('--- 5. RESULT: No user found. (This is also a success!) ---');
    }

    // 4. DISCONNECT
    await mongoose.disconnect();
    console.log('--- 6. Disconnected. Test complete. ---');
    process.exit(0);
  } catch (error) {
    console.error('--- FUCK. TEST FAILED. ---');
    console.error(error);
    process.exit(1);
  }
}

// --- RUN THE TEST ---
runTest();
