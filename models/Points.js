const mongoose = require('mongoose');

const pointsSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  points: { type: Number, default: 0 },
}, { versionKey: false });

module.exports = mongoose.models.Points || mongoose.model('Points', pointsSchema);
