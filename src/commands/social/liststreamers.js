// src/commands/social/liststreamers.js
const { Command } = require("@sapphire/framework");
const { streamerData } = require("../../../db");
const { createEmbed } = require("../../utils/embed");

module.exports = class ListCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "liststreamers",
      description: "List all tracked streamers.",
    });
  }

  async registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName(this.name).setDescription(this.description)
    );
  }

  async chatInputRun(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const guildId = interaction.guild.id;
    const streamers = streamerData.ensure(guildId, { streamers: [] }).streamers;

    if (streamers.length === 0) {
      const embed = createEmbed({
        description: "No streamers are being tracked currently.",
      });
      return interaction.followUp({ embeds: [embed] });
    }

    const embed = createEmbed({
      title: "Tracked Streamers",
      description: streamers
        .map(
          (streamer, index) =>
            `${index + 1}. **${streamer.name}** on **${
              streamer.platform
            }** (Notifications in <#${streamer.channel}>)`
        )
        .join("\n"),
    });
    await interaction.followUp({ embeds: [embed] });
  }
};
