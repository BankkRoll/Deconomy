// src/commands/admin/setcoins.js
const { Command } = require("@sapphire/framework");
const { economyData } = require("../../../db");
const { createEmbed } = require("../../utils/embed");
const confirm = require("../../utils/confirm");

module.exports = class SetCoinsCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "setcoins",
      description: "Set a user's coin balance to a specific value.",
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
            .setDescription("The user to interact with")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount to set for the user")
            .setRequired(true)
        )
    );
  }

  async chatInputRun(interaction) {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      const embed = createEmbed({
        description: "❌ You don't have permission to use this command.",
      });
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const guildId = interaction.guild.id;
    const guildEconomy = economyData.get(guildId);
    const currencyName = guildEconomy.currencyName;

    const user = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("amount");

    const confirmed = await confirm(
      interaction,
      `Are you sure you want to set ${user.username}'s ${currencyName} balance to ${amount}?`
    );
    if (!confirmed) {
      const embed = createEmbed({
        description: "Operation cancelled.",
      });
      return interaction.followUp({ embeds: [embed] });
    }

    if (!guildEconomy.userBalances[user.id]) {
      guildEconomy.userBalances[user.id] = {
        balance: 0,
        lastDaily: null,
        transactions: [],
      };
    }

    guildEconomy.userBalances[user.id].balance = amount;
    economyData.set(guildId, guildEconomy);

    this.container.client.emit(
      "economyChange",
      guildId,
      user.id,
      "set",
      amount,
      interaction.user.id,
      "setcoins"
    );

    const embed = createEmbed({
      description: `Successfully set ${user.username}'s ${currencyName} balance to ${amount}.`,
    });
    await interaction.followUp({ embeds: [embed] });
  }
};
