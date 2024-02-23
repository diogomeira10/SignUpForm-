const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  token: {
    type: String,
    required: true
  }
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
