// src/commands/economy/buy.js
const { Command } = require("@sapphire/framework");
const { shopItems, userInventory, economyData } = require("../../../db");
const { createEmbed } = require("../../utils/embed");

module.exports = class BuyItemCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "buy",
      description: "Buy an item from the shop using coins.",
    });
  }

  async registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option
            .setName("itemname")
            .setDescription("Name of the item to buy")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("Amount to buy")
            .setRequired(false)
        )
    );
  }

  async chatInputRun(interaction) {
    const guildId = interaction.guild.id;
    const userId = interaction.user.id;
    const itemName = interaction.options.getString("itemname").toLowerCase();
    const amount = interaction.options.getInteger("amount") || 1;

    const guildShop = shopItems.get(guildId);
    const item = guildShop.items[itemName];

    if (!item) {
      const embed = createEmbed({
        description: "❌ This item does not exist in the shop.",
      });
      return interaction.reply({ embeds: [embed] });
    }

    // Check if the item is out of stock or not enough in stock
    if (
      item.amount !== "unlimited" &&
      (item.amount < amount || item.amount === 0)
    ) {
      const embed = createEmbed({
        description: `❌ Not enough of ${itemName} in stock.`,
      });
      return interaction.reply({ embeds: [embed] });
    }

    const guildEconomy = economyData.get(guildId);
    const userBalance = guildEconomy.userBalances[userId]
      ? guildEconomy.userBalances[userId].balance
      : 0;

    const currencySymbol = guildEconomy.currencySymbol;
    const currencyName = guildEconomy.currencyName;

    if (userBalance < item.price * amount) {
      const embed = createEmbed({
        description: `❌ You don't have enough coins to buy this item.`,
      });
      return interaction.reply({ embeds: [embed] });
    }

    // Update balance, inventory, and item stock
    guildEconomy.userBalances[userId].balance -= item.price * amount;
    economyData.set(guildId, guildEconomy);

    if (item.amount !== "unlimited") {
      item.amount -= amount;
      if (item.amount === 0) {
        delete guildShop.items[itemName];
      }
    }
    shopItems.set(guildId, guildShop);

    const userItems = userInventory.get(userId);
    if (!userItems.items[itemName]) {
      userItems.items[itemName] = { quantity: 0 };
    }
    userItems.items[itemName].quantity += amount;
    userInventory.set(userId, userItems);

    this.container.client.emit(
      "economyChange",
      guildId,
      userId,
      "item-bought",
      item.price * amount,
      interaction.user.id,
      "buy",
      itemName,
      amount,
      item.img
    );

    const embed = createEmbed({
      description: `✅ Successfully bought ${amount} ${
        item.name
      }(s) for ${currencySymbol}${item.price * amount} ${currencyName}.`,
      image: item.img,
    });
    await interaction.reply({ embeds: [embed] });
  }
};
