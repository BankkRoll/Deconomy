// src/commands/social/addstreamer.js
const { Command } = require("@sapphire/framework");
const { streamerData } = require("../../../db");
const { createEmbed } = require("../../utils/embed");

module.exports = class AddStreamerCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "addstreamer",
      description: "Add a streamer to track.",
    });
  }

  async registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option
            .setName("platform")
            .setDescription("The platform of the streamer")
            .setRequired(true)
            .addChoices(
              { name: "YouTube", value: "youtube" },
              { name: "Twitch", value: "twitch" },
              { name: "Kick", value: "kick" },
              { name: "Rumble", value: "rumble" },
              { name: "TikTok", value: "tiktok" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the streamer")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to send notifications to")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("userid")
            .setDescription(
              "The user ID of the YouTube streamer (only for YouTube)"
            )
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
    const platform = interaction.options.getString("platform");
    const name = interaction.options.getString("name");
    const channel = interaction.options.getString("channel");
    const userId = interaction.options.getString("userid");

    if (platform.toLowerCase() === "youtube" && !userId) {
      const embed = createEmbed({
        description: "❌ You must provide a user ID for YouTube streamers.",
      });
      return interaction.followUp({ embeds: [embed] });
    }

    const streamers = streamerData.get(guildId, "streamers", []);
    streamers.push({ name, platform, channel, userId });
    streamerData.set(guildId, streamers, "streamers");

    const embed = createEmbed({
      description: `Successfully added ${name} on ${platform} to the tracking list.`,
    });
    await interaction.followUp({ embeds: [embed] });
  }
};
