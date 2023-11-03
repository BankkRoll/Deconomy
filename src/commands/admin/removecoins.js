// src/commands/admin/removecoins.js
const { Command } = require("@sapphire/framework");
const { economyData } = require("../../../db");
const { createEmbed } = require("../../utils/embed");
const confirm = require("../../utils/confirm");

module.exports = class RemoveCoinsCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "removecoins",
      description: "Remove a specific amount of coins from a user's account.",
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
            .setDescription("The user to remove coins from")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("Amount of coins to remove")
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
    const user = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("amount");
    const guildEconomy = economyData.get(guildId);
    const currencyName = guildEconomy.currencyName;

    if (
      !guildEconomy.userBalances[user.id] ||
      guildEconomy.userBalances[user.id].balance < amount
    ) {
      const embed = createEmbed({
        description: `❌ ${user.tag} does not have enough coins to remove.`,
      });
      return interaction.followUp({ embeds: [embed] });
    }

    const confirmed = await confirm(
      interaction,
      `Are you sure you want to remove ${amount} ${currencyName} from ${user.tag}?`
    );
    if (!confirmed) {
      const embed = createEmbed({
        description: "Operation cancelled.",
      });
      return interaction.followUp({ embeds: [embed] });
    }

    guildEconomy.userBalances[user.id].balance -= amount;
    economyData.set(guildId, guildEconomy);

    this.container.client.emit(
      "economyChange",
      guildId,
      user.id,
      "removed",
      amount,
      interaction.user.id,
      "removecoins"
    );

    const embed = createEmbed({
      description: `Successfully removed ${amount} ${currencyName} from ${user.tag}.`,
    });
    await interaction.followUp({ embeds: [embed] });
  }
};
