// src/commands/admin/addcoins.js
const { Command } = require("@sapphire/framework");
const { economyData } = require("../../../db");
const { createEmbed } = require("../../utils/embed");
const confirm = require("../../utils/confirm");

module.exports = class AddCoinsCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "addcoins",
      description: "Add a specific amount of coins to a user's account.",
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
            .setDescription("The user to add coins to")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("Amount of coins to add")
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
      return interaction.followUp({ embeds: [embed] });
    }

    const guildId = interaction.guild.id;
    const guildEconomy = economyData.get(guildId);
    const currencyName = guildEconomy.currencyName;

    const user = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("amount");

    const confirmed = await confirm(
      interaction,
      `Are you sure you want to add ${amount} ${currencyName} to ${user.username}?`
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

    guildEconomy.userBalances[user.id].balance += amount;
    economyData.set(guildId, guildEconomy);

    this.container.client.emit(
      "economyChange",
      guildId,
      user.id,
      "add",
      amount,
      interaction.user.id,
      "addcoins"
    );

    const embed = createEmbed({
      description: `Successfully added ${amount} ${currencyName} to ${user.username}.`,
    });
    await interaction.followUp({ embeds: [embed] });
  }
};
