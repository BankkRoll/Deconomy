// src/commands/social/removestreamer.js
const { Command } = require("@sapphire/framework");
const { streamerData } = require("../../../db");
const { createEmbed } = require("../../utils/embed");

module.exports = class RemoveStreamerCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "removestreamer",
      description: "Remove a streamer from tracking.",
    });
  }

  async registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the streamer to remove")
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
    const name = interaction.options.getString("name");

    const streamerList = streamerData.ensure(guildId, {
      streamers: [],
    }).streamers;
    const updatedStreamers = streamerList.filter(
      (streamer) => streamer.name.toLowerCase() !== name.toLowerCase()
    );

    if (updatedStreamers.length === streamerList.length) {
      const embed = createEmbed({
        description: `❌ Streamer ${name} was not found in the tracking list.`,
      });
      return interaction.followUp({ embeds: [embed] });
    }

    streamerData.set(guildId, { streamers: updatedStreamers });

    const embed = createEmbed({
      description: `Successfully removed ${name} from the tracking list.`,
    });
    await interaction.followUp({ embeds: [embed] });
  }
};
