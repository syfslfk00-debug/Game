const Inventory = require('./models/Inventory.js');

// MongoDB-backed replacement for the previous inventory.json file storage.

function mapToObject(items) {
  if (!items) return {};
  if (items instanceof Map) return Object.fromEntries(items.entries());
  return { ...items };
}

async function addItem(userId, item) {
  await Inventory.updateOne(
    { userId },
    { $inc: { [`items.${item}`]: 1 }, $setOnInsert: { userId } },
    { upsert: true }
  );
}

async function getItems(userId) {
  const row = await Inventory.findOne({ userId }).lean();
  return mapToObject(row?.items);
}

async function useItem(userId, item) {
  const inv = await Inventory.findOne({ userId });
  const current = inv?.items?.get(item) || 0;
  if (!inv || current <= 0) return false;

  if (current === 1) {
    inv.items.delete(item);
  } else {
    inv.items.set(item, current - 1);
  }

  await inv.save();
  return true;
}

async function hasItem(userId, item) {
  const inv = await getItems(userId);
  return (inv[item] || 0) > 0;
}

async function resetAll() {
  await Inventory.deleteMany({});
}

module.exports = { addItem, getItems, useItem, hasItem, resetAll };
