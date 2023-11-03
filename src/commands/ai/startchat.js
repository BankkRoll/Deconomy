// src/commands/ai/startchat.js
const { Command } = require("@sapphire/framework");
const Bard = require("../../utils/bard.js");
const { guildSettings } = require("../../../db");
const { createEmbed } = require("../../utils/embed");

module.exports = class StartChatCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "startchat",
      description: "Starts a new conversation with Bard.",
    });
  }

  async registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName(this.name).setDescription(this.description)
    );
  }

  async chatInputRun(interaction) {
    // Send an immediate response
    interaction.reply({
      content: "Initializing a private conversation with Bard...",
      ephemeral: true,
    });

    try {
      const channel = await interaction.guild.channels.create(
        `bard-${interaction.user.username}`,
        {
          type: "GUILD_TEXT",
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: ["VIEW_CHANNEL"],
            },
            {
              id: interaction.user.id,
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
            },
          ],
        }
      );

      // Create and send the detailed embed message
      const embed = createEmbed({
        title: "Private Conversation Initialized",
        description: `Hello ${interaction.user}, your private conversation with Bard has started. Feel free to type your questions here.`,
        fields: [
          {
            name: "Auto-Closure",
            value:
              "This channel will automatically close after 5 minutes without a response.",
            inline: false,
          },
        ],
      });

      await channel.send({ embeds: [embed] });

      const guildId = interaction.guild.id;
      const settings = guildSettings.ensure(guildId, {});
      const bardToken = settings.bardCookie;

      const bard = new Bard(bardToken, { verbose: true });
      const chat = bard.createChat();

      const filter = (m) => m.author.id === interaction.user.id;
      const collector = channel.createMessageCollector({
        filter,
        time: 300000,
      });

      collector.on("collect", async (m) => {
        const response = await chat.ask(m.content);
        const responseEmbed = createEmbed({
          title: "Bard's Response",
          description: response,
        });
        await channel.send({ embeds: [responseEmbed] });
      });

      collector.on("end", async () => {
        await new Promise((resolve) => setTimeout(resolve, 300000));
        channel.send("Your conversation with Bard has ended.");
        channel.delete();
      });

      // Follow up with the channel details
      await interaction.followUp({
        content: `Your private conversation with Bard has started. Check your new channel ${channel}.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.followUp({
        content: "An error occurred while starting the conversation.",
        ephemeral: true,
      });
    }
  }
};
