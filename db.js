// db.js
const Enmap = require("enmap");

/**
 * @type {import("enmap").default}
 * Custom settings for each guild.
 * Includes settings like custom prefix, logs channel, etc.
 */
const guildSettings = new Enmap({
  name: "guildSettings",
  autoEnsure: {
    logsChannel: null,
    adminChannel: null,
    modRoles: [],
    economyEnabled: true,
  },
  ensureProps: true,
});

/**
 * @type {import("enmap").default}
 * Data related to the economy system in each guild.
 * Includes user balances, total economy size, etc.
 */
const economyData = new Enmap({
  name: "economyData",
  autoEnsure: {
    totalEconomySize: 0,
    userBalances: {}, // { userId: { balance, lastDaily, lastWeekly, lastWork, transactions: [] etc. } }
    topEarners: [],
    currencySymbol: "💰",
    currencyName: "Coins",
    dailyAmount: 10,
    weeklyAmount: 100,
    workMin: 10,
    workMax: 50,
  },
  ensureProps: true,
});

/**
 * @type {import("enmap").default}
 * User-specific inventory data.
 * Includes items owned, quantity, etc.
 */
const userInventory = new Enmap({
  name: "userInventory",
  autoEnsure: {
    items: {}, // { itemId: { quantity, equipped } }
  },
  ensureProps: true,
});

/**
 * @type {import("enmap").default}
 * Items that can be bought in each guild's economy system.
 * Includes item price, description, role assinged on buy etc.
 */
const shopItems = new Enmap({
  name: "shopItems",
  autoEnsure: {
    items: {}, // { itemId: { name, price, description, role } }
  },
  ensureProps: true,
});

module.exports = {
  guildSettings,
  economyData,
  userInventory,
  shopItems,
};
