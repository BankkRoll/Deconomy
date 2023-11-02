// src/commands/economy/balance.js
const { Command } = require("@sapphire/framework");
const { economyData } = require("../../../db");
const { createEmbed } = require("../../utils/embed");

module.exports = class BalanceCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "balance",
      description: "Display the coin balance for yourself or another user.",
    });
  }

  async registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to check balance for")
            .setRequired(false)
        )
    );
  }

  async chatInputRun(interaction) {
    const guildId = interaction.guild.id;
    const guildEconomy = economyData.get(guildId);

    const currencySymbol = guildEconomy.currencySymbol;
    const currencyName = guildEconomy.currencyName;

    let userId = interaction.user.id;
    let displayUser = interaction.user;

    const user = interaction.options.getUser("user");
    if (user) {
      userId = user.id;
      displayUser = user;
    }

    const userBalance = guildEconomy.userBalances[userId]
      ? guildEconomy.userBalances[userId].balance
      : 0;

    // Find the user's rank by sorting all users by their balance
    const sortedUsers = Object.keys(guildEconomy.userBalances)
      .map((id) => ({
        userId: id,
        balance: guildEconomy.userBalances[id].balance,
      }))
      .sort((a, b) => b.balance - a.balance);

    const userRank =
      sortedUsers.findIndex((user) => user.userId === userId) + 1;

    const embed = createEmbed({
      title: `Balance for ${displayUser.username}`,
      description: `Balance: ${currencySymbol}${userBalance} ${currencyName}\nLeaderboard Rank: ${userRank}`,
    });

    await interaction.reply({ embeds: [embed] });
  }
};
