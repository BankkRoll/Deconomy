// src/commands/ai/bard.js
const { Command } = require("@sapphire/framework");
const Bard = require("../../utils/bard.js");
const { guildSettings } = require("../../../db");
const { createEmbed } = require("../../utils/embed");

module.exports = class BardCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "bard",
      description: "Interacts with Bard to answer questions.",
    });
  }

  async registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option
            .setName("question")
            .setDescription("Question to ask Bard")
            .setRequired(true)
        )
    );
  }

  async chatInputRun(interaction) {
    const question = interaction.options.getString("question");

    await interaction.deferReply();

    try {
      const guildId = interaction.guild.id;
      const settings = guildSettings.ensure(guildId);
      const bardToken = settings.bardCookie;

      let bard = new Bard(bardToken, { verbose: true });
      const response = await bard.ask(question);

      // Split response into chunks of 2048 characters (Discord embed description limit)
      const chunks = [];
      for (let i = 0; i < response.length; i += 2048) {
        chunks.push(response.slice(i, i + 2048));
      }

      // Send multiple messages if the response is too long
      for (let i = 0; i < chunks.length; i++) {
        const embed = createEmbed({
          title: i === 0 ? `Question: ${question}` : `Continuation...`,
          description: chunks[i],
        });

        await interaction.followUp({
          content: null,
          embeds: [embed],
        });
      }
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: "An error occurred while fetching the response.",
        ephemeral: true,
      });
    }
  }
};
