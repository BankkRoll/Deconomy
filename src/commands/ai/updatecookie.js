// src/commands/admin/updatecookie.js
const { Command } = require("@sapphire/framework");
const { guildSettings } = require("../../../db");
const { createEmbed } = require("../../utils/embed");
const confirm = require("../../utils/confirm");

module.exports = class UpdateCookieCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "updatecookie",
      description: "Updates the Bard cookie.",
    });
  }

  async registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option
            .setName("cookie")
            .setDescription("New cookie to set")
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
    const newCookie = interaction.options.getString("cookie");

    const confirmed = await confirm(
      interaction,
      `Are you sure you want to update the Bard cookie?`
    );
    if (!confirmed) {
      const embed = createEmbed({
        description: "Operation cancelled.",
      });
      return interaction.followUp({ embeds: [embed] });
    }

    // Update the cookie in the database
    const settings = guildSettings.ensure(guildId);
    settings.bardCookie = newCookie;
    guildSettings.set(guildId, settings);

    const embed = createEmbed({
      description: `Successfully updated Bard cookie.`,
    });
    await interaction.followUp({ embeds: [embed], ephemeral: true });
  }
};
