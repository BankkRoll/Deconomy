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

    await interaction.deferReply({ ephemeral: true });

    try {
      const guildId = interaction.guild.id;
      const settings = guildSettings.ensure(guildId, {});
      const bardToken = settings.bardCookie;

      let bard = new Bard(bardToken, { verbose: true });
      const response = await bard.ask(question);

      const embed = createEmbed({
        title: "Bard's Response",
        description: response,
      });

      await interaction.editReply({
        content: null,
        embeds: [embed],
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: "An error occurred while fetching the response.",
        ephemeral: true,
      });
    }
  }
};
