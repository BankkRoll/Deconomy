// src/commands/economy/weekly.js
const { Command } = require("@sapphire/framework");
const { economyData } = require("../../../db");
const { createEmbed } = require("../../utils/embed");
const moment = require("moment");

module.exports = class WeeklyCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "weekly",
      description: "Claim your weekly bonus of coins.",
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
    const weeklyAmount = guildEconomy.weeklyAmount;
    const currencySymbol = guildEconomy.currencySymbol;
    const currencyName = guildEconomy.currencyName;

    const now = moment().unix();
    const lastWeekly = guildEconomy.userBalances[userId]?.lastWeekly || 0;
    const timeSinceLastWeekly = now - lastWeekly;
    const oneWeek = 604800;

    if (timeSinceLastWeekly < oneWeek) {
      const timeLeft = moment
        .duration(oneWeek - timeSinceLastWeekly, "seconds")
        .humanize();
      const embed = createEmbed({
        description: `You can claim your next weekly reward in ${timeLeft}.`,
      });
      return interaction.reply({ embeds: [embed] });
    }

    guildEconomy.userBalances[userId] = guildEconomy.userBalances[userId] || {};
    guildEconomy.userBalances[userId].balance =
      (guildEconomy.userBalances[userId].balance || 0) + weeklyAmount;
    guildEconomy.userBalances[userId].lastWeekly = now;

    economyData.set(guildId, guildEconomy);

    const embed = createEmbed({
      description: `You've claimed your weekly ${weeklyAmount}${currencySymbol} ${currencyName}.`,
    });
    await interaction.reply({ embeds: [embed] });
  }
};
