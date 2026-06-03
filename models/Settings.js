const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'global' },
  channels: { type: [String], default: [] },
  disabledCommands: { type: Map, of: [String], default: {} },
}, { versionKey: false });

module.exports = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
