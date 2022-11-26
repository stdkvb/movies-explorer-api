const mongoose = require('mongoose');

const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: 'Неверный формат записи email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      minlength: [2, '<2'],
      maxlength: [30, '>30'],
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('user', userSchema);
