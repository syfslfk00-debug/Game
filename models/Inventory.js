const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  items: { type: Map, of: Number, default: {} },
}, { versionKey: false });

module.exports = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);
