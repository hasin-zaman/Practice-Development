const mongoose = require('mongoose');

const giftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  recipient: {
    type: String,
    required: true,
    trim: true
  },
  recipientBirthday: {
    type: Date,
    default: null
  },
  occasion: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    min: 0
  },
  type: {
    type: String,
    enum: ['given', 'received'],
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gift', giftSchema);