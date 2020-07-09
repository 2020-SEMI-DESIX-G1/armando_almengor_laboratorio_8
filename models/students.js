const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  nombre: { type: String },
  edad: { type: String },
});

const Students = mongoose.model('Students', schema);

module.exports = Students;