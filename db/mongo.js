const mongoose = require('mongoose');

let connectionPromise = null;

async function connectMongo() {
  if (connectionPromise) return connectionPromise;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('[MongoDB] MONGODB_URI is not defined.');
    process.exit(1);
  }

  connectionPromise = mongoose.connect(uri).then((connection) => {
    console.log('[MongoDB] Connected successfully.');
    return connection;
  }).catch((error) => {
    console.error('[MongoDB] Connection failed:', error);
    process.exit(1);
  });

  return connectionPromise;
}

module.exports = { connectMongo };
