// src/commands/admin/setup.js
const { Command } = require("@sapphire/framework");
const { guildSettings, economyData } = require("../../../db");
const { createEmbed } = require("../../utils/embed");

module.exports = class SetupCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "setup",
      description: "Initialize the bot for first-time use on the server.",
    });
  }

  async registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName(this.name).setDescription(this.description)
    );
  }

  async chatInputRun(interaction) {
    // Check for ADMINISTRATOR permissions
    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      const embed = createEmbed({
        description: "❌ You don't have permission to use this command.",
      });
      return interaction.reply({ embeds: [embed] });
    }

    const guildId = interaction.guild.id;

    // Logs Channel
    const logsEmbed = createEmbed({
      title: "Logs Channel Configuration",
      description: "Let's start by setting up a logs channel.",
      fields: [
        {
          name: "Description",
          value:
            "The logs channel will be used to record important events in your server, such as moderation actions.",
        },
        {
          name: "Example",
          value:
            "To set a logs channel, you just need to mention it. Like this: `#logs`",
        },
      ],
    });
    await interaction.reply({ embeds: [logsEmbed] });
    const logsChannel = await interaction.channel.awaitMessages({
      filter: (m) => m.mentions.channels.size > 0,
      max: 1,
      time: 60000,
      errors: ["time"],
    });
    const logsChannelId = logsChannel.first().mentions.channels.first().id;
    guildSettings.set(guildId, logsChannelId, "logsChannel");

    // Mod Roles
    const rolesEmbed = createEmbed({
      title: "Moderator Roles Configuration",
      description: "Now let's designate some moderator roles.",
      fields: [
        {
          name: "Description",
          value:
            "Moderator roles are roles that will have special permissions for using certain bot commands.",
        },
        {
          name: "Example",
          value:
            "To set moderator roles, just mention them all in a single message. Like this: `@Moderator @Admin`",
        },
      ],
    });
    await interaction.followUp({ embeds: [rolesEmbed] });
    const roles = await interaction.channel.awaitMessages({
      filter: (m) => m.mentions.roles.size > 0,
      max: 1,
      time: 60000,
      errors: ["time"],
    });
    const rolesIds = roles.first().mentions.roles.map((role) => role.id);
    guildSettings.set(guildId, rolesIds, "modRoles");

    // Currency Symbol
    const currencyEmbed = createEmbed({
      title: "Currency Symbol Configuration",
      description:
        "Finally, let's set a currency symbol for the server economy.",
      fields: [
        {
          name: "Description",
          value:
            "The currency symbol is a symbol or abbreviation that will represent the server economy currency.",
        },
        {
          name: "Example",
          value:
            "Just send a message with the symbol you want to use. Like this: `$`",
        },
      ],
    });
    await interaction.followUp({ embeds: [currencyEmbed] });
    const currencySymbol = await interaction.channel.awaitMessages({
      filter: (m) => m.author.id === interaction.user.id,
      max: 1,
      time: 60000,
      errors: ["time"],
    });
    const symbol = currencySymbol.first().content;
    economyData.set(guildId, symbol, "currencySymbol");

    // Currency Name
    const currencyNameEmbed = createEmbed({
      title: "Currency Name Configuration",
      description: "Let's set a name for the currency in this server.",
      fields: [
        {
          name: "Description",
          value:
            "The currency name is a name or abbreviation that will represent the server economy currency.",
        },
        {
          name: "Example",
          value:
            "Just send a message with the name you want to use. Like this: `Coins`",
        },
      ],
    });
    await interaction.followUp({ embeds: [currencyNameEmbed] });
    const currencyName = await interaction.channel.awaitMessages({
      filter: (m) => m.author.id === interaction.user.id,
      max: 1,
      time: 60000,
      errors: ["time"],
    });
    const name = currencyName.first().content;
    economyData.set(guildId, name, "currencyName");

    // Daily Coins Amount
    const dailyAmountEmbed = createEmbed({
      title: "Daily Coins Amount Configuration",
      description:
        "How many coins should a user receive for the daily command?",
      fields: [
        {
          name: "Example",
          value: "For example, to set it to 10 coins, just send `10`.",
        },
      ],
    });
    await interaction.followUp({ embeds: [dailyAmountEmbed] });
    const dailyAmount = await interaction.channel.awaitMessages({
      filter: (m) => !isNaN(m.content),
      max: 1,
      time: 60000,
      errors: ["time"],
    });
    economyData.set(
      guildId,
      parseInt(dailyAmount.first().content),
      "dailyAmount"
    );

    // Weekly Coins Amount
    const weeklyAmountEmbed = createEmbed({
      title: "Weekly Coins Amount Configuration",
      description:
        "How many coins should a user receive for the weekly command?",
      fields: [
        {
          name: "Example",
          value: "For example, to set it to 100 coins, just send `100`.",
        },
      ],
    });
    await interaction.followUp({ embeds: [weeklyAmountEmbed] });
    const weeklyAmount = await interaction.channel.awaitMessages({
      filter: (m) => !isNaN(m.content),
      max: 1,
      time: 60000,
      errors: ["time"],
    });
    economyData.set(
      guildId,
      parseInt(weeklyAmount.first().content),
      "weeklyAmount"
    );

    // Work Min Amount
    const workMinEmbed = createEmbed({
      title: "Work Min Amount Configuration",
      description:
        "What's the minimum amount of coins a user can earn from the /work command?",
      fields: [
        {
          name: "Example",
          value: "For example, to set it to 10 coins, just send `10`.",
        },
      ],
    });
    await interaction.followUp({ embeds: [workMinEmbed] });
    const workMin = await interaction.channel.awaitMessages({
      filter: (m) => !isNaN(m.content),
      max: 1,
      time: 60000,
      errors: ["time"],
    });
    economyData.set(guildId, parseInt(workMin.first().content), "workMin");

    // Work Max Amount
    const workMaxEmbed = createEmbed({
      title: "Work Max Amount Configuration",
      description:
        "What's the maximum amount of coins a user can earn from the /work command?",
      fields: [
        {
          name: "Example",
          value: "For example, to set it to 50 coins, just send `50`.",
        },
      ],
    });
    await interaction.followUp({ embeds: [workMaxEmbed] });
    const workMax = await interaction.channel.awaitMessages({
      filter: (m) => !isNaN(m.content),
      max: 1,
      time: 60000,
      errors: ["time"],
    });
    economyData.set(guildId, parseInt(workMax.first().content), "workMax");

    // Final Embed
    const finalEmbed = createEmbed({
      title: "Configuration Complete",
      description: "All settings have been successfully configured.",
      timestamp: true,
      fields: [
        {
          name: "What Now?",
          value: "You can now start using the bot with the new settings!",
        },
      ],
    });
    await interaction.followUp({ embeds: [finalEmbed] });
  }
};
