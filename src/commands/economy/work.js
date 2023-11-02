// src/commands/economy/work.js
const { Command } = require("@sapphire/framework");
const { economyData } = require("../../../db");
const { createEmbed } = require("../../utils/embed");

module.exports = class WorkCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "work",
      description: "Perform work to earn random coins.",
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
    const workMin = guildEconomy.workMin;
    const workMax = guildEconomy.workMax;
    const currencySymbol = guildEconomy.currencySymbol;
    const currencyName = guildEconomy.currencyName;

    const earned =
      Math.floor(Math.random() * (workMax - workMin + 1)) + workMin;

    guildEconomy.userBalances[userId] = guildEconomy.userBalances[userId] || {};
    guildEconomy.userBalances[userId].balance =
      (guildEconomy.userBalances[userId].balance || 0) + earned;

    economyData.set(guildId, guildEconomy);

    const embed = createEmbed({
      description: `You worked and earned ${earned}${currencySymbol} ${currencyName}.`,
    });
    await interaction.reply({ embeds: [embed] });
  }
};
