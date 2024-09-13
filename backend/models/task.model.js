const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  dueDate: Date,
  category: String
});

module.exports = mongoose.model('Task', TaskSchema);
