const Settings = require('./models/Settings.js');

// MongoDB-backed replacement for the previous settings.json file storage.

const SETTINGS_KEY = 'global';

async function getSettings() {
  const settings = await Settings.findOneAndUpdate(
    { key: SETTINGS_KEY },
    { $setOnInsert: { key: SETTINGS_KEY, channels: [], disabledCommands: {} } },
    { upsert: true, new: true }
  ).lean();

  if (!settings.channels) settings.channels = [];
  if (!settings.disabledCommands) settings.disabledCommands = {};
  return settings;
}

function mapToObject(value) {
  if (!value) return {};
  if (value instanceof Map) return Object.fromEntries(value.entries());
  return { ...value };
}

const isChannelAllowed = async (id) => {
  const settings = await getSettings();
  return settings.channels.includes(id);
};

const getAllowedChannels = async () => {
  const settings = await getSettings();
  return settings.channels;
};

const addChannel = async (id) => {
  await Settings.updateOne(
    { key: SETTINGS_KEY },
    { $addToSet: { channels: id }, $setOnInsert: { key: SETTINGS_KEY, disabledCommands: {} } },
    { upsert: true }
  );
};

const removeChannel = async (id) => {
  await Settings.updateOne(
    { key: SETTINGS_KEY },
    { $pull: { channels: id }, $setOnInsert: { key: SETTINGS_KEY, disabledCommands: {} } },
    { upsert: true }
  );
};

const isCommandDisabled = async (channelId, cmd) => {
  const settings = await getSettings();
  const disabledCommands = mapToObject(settings.disabledCommands);
  return (disabledCommands[channelId] || []).includes(cmd);
};

const disableCommand = async (channelId, cmd) => {
  await Settings.updateOne(
    { key: SETTINGS_KEY },
    { $addToSet: { [`disabledCommands.${channelId}`]: cmd }, $setOnInsert: { key: SETTINGS_KEY, channels: [] } },
    { upsert: true }
  );
};

const enableCommand = async (channelId, cmd) => {
  await Settings.updateOne(
    { key: SETTINGS_KEY },
    { $pull: { [`disabledCommands.${channelId}`]: cmd }, $setOnInsert: { key: SETTINGS_KEY, channels: [] } },
    { upsert: true }
  );
};

const getDisabledCommands = async () => {
  const settings = await getSettings();
  return mapToObject(settings.disabledCommands);
};

module.exports = { isChannelAllowed, getAllowedChannels, addChannel, removeChannel, isCommandDisabled, disableCommand, enableCommand, getDisabledCommands };
