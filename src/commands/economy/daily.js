// src/commands/economy/daily.js
const { Command } = require("@sapphire/framework");
const { economyData } = require("../../../db");
const { createEmbed } = require("../../utils/embed");
const moment = require("moment");

module.exports = class DailyCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "daily",
      description: "Claim your daily bonus of coins.",
    });
  }

  async registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName(this.name).setDescription(this.description)
    );
  }

  async chatInputRun(interaction) {
    const guildId = interaction.guild.id;
    const userId = interaction.user.id;

    const guildEconomy = economyData.get(guildId);
    const dailyAmount = guildEconomy.dailyAmount;
    const currencySymbol = guildEconomy.currencySymbol;
    const currencyName = guildEconomy.currencyName;
    const now = moment().unix();
    const lastDaily = guildEconomy.userBalances[userId]?.lastDaily || 0;
    const timeSinceLastDaily = now - lastDaily;
    const oneDay = 86400;

    if (timeSinceLastDaily < oneDay) {
      const timeLeft = moment
        .duration(oneDay - timeSinceLastDaily, "seconds")
        .humanize();
      const embed = createEmbed({
        description: `You can claim your next daily reward in ${timeLeft}.`,
      });
      return interaction.reply({ embeds: [embed] });
    }

    guildEconomy.userBalances[userId] = guildEconomy.userBalances[userId] || {};
    guildEconomy.userBalances[userId].balance =
      (guildEconomy.userBalances[userId].balance || 0) + dailyAmount;
    guildEconomy.userBalances[userId].lastDaily = now;

    economyData.set(guildId, guildEconomy);

    const embed = createEmbed({
      description: `You've claimed your daily ${dailyAmount}${currencySymbol} ${currencyName}.`,
    });
    await interaction.reply({ embeds: [embed] });
  }
};
