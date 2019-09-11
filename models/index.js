const mongoose = require('mongoose');


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/jwt-token-demo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

module.exports.User = require('./User')