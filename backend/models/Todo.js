const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  // We use a custom 'id' field to sync easily with the frontend's optimistic UUIDs
  id: { type: String, required: true, unique: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now }
});

module.exports = mongoose.model('Todo', TodoSchema);