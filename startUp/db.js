const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/SabbathSchool';
const options = { useNewUrlParser: true, useUnifiedTopology: true };

module.exports = function() {
  mongoose.connect(url, options)
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));
}