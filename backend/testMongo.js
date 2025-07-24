require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Test connection successful!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Test connection failed:', err);
    process.exit(1);
  });
