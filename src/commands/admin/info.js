// src/commands/admin/info.js
const { Command } = require("@sapphire/framework");
const { createEmbed } = require("../../utils/embed");
const {
  guildSettings,
  economyData,
  userInventory,
  shopItems,
} = require("../../../db");

module.exports = class InfoCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "info",
      description: "Retrieve detailed bot configuration and server settings.",
    });
  }

  async registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName(this.name).setDescription(this.description)
    );
  }

  async chatInputRun(interaction) {
    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      const embed = createEmbed({
        description: "❌ You don't have permission to use this command.",
      });
      return interaction.reply({ embeds: [embed] });
    }

    const guildId = interaction.guild.id;
    const settings = guildSettings.get(guildId);
    const economy = economyData.get(guildId);
    const inventory = userInventory.get(guildId);

    const totalUsersWithCoins = Object.keys(economy.userBalances).length;
    let totalCoins = 0;
    for (const userId in economy.userBalances) {
      totalCoins += economy.userBalances[userId].balance;
    }

    const currencyName = economy.currencyName;
    const currencySymbol = economy.currencySymbol;

    const embed = createEmbed({
      title: "Server Information Panel",
      description: "Detailed server info about the bot and its configurations.",
      fields: [
        {
          name: "Server Settings",
          value: `Logs Channel: <#${
            settings.logsChannel
          }>\nMod Roles: ${settings.modRoles
            .map((roleId) => `<@&${roleId}>`)
            .join(", ")}`,
          inline: true,
        },
        {
          name: "Economy Settings",
          value: `Economy Enabled: ${
            settings.economyEnabled ? "Yes" : "No"
          }\nDaily Reward: ${
            economy.dailyAmount
          }${currencySymbol}\nWeekly Reward: ${
            economy.weeklyAmount
          }${currencySymbol}\nWork Reward: ${
            economy.workMin
          }${currencySymbol} - ${economy.workMax}${currencySymbol}`,
          inline: true,
        },
        {
          name: "Economy Data",
          value: `Total Users with ${currencyName}: ${totalUsersWithCoins}\nTotal ${currencyName}: ${currencySymbol}${totalCoins}`,
          inline: true,
        },
        {
          name: "Shop Summary",
          value: `Total Items in Shop: ${
            Object.keys(shopItems.get(guildId).items).length
          }`,
          inline: true,
        },
        {
          name: "Inventory Summary",
          value: `Total Unique Items Owned: ${
            Object.keys(inventory.items).length
          }`,
          inline: true,
        },
      ],
    });

    await interaction.reply({ embeds: [embed] });
  }
};
