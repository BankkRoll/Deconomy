// src/commands/ai/bard.js
const { Command } = require("@sapphire/framework");
const Bard = require("../../utils/bard.js");
const config = require("../../../config.json");
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
        .addStringOption((option) =>
          option.setName("image").setDescription("Path to an image to send")
        )
    );
  }

  async chatInputRun(interaction) {
    const question = interaction.options.getString("question");
    const imagePath = interaction.options.getString("image");

    await interaction.deferReply({ ephemeral: true });

    try {
      let bard = new Bard(config.BARD_TOKEN, { verbose: true });
      let askConfig = {};

      if (imagePath) {
        const fs = require("fs");
        askConfig.image = fs.readFileSync(imagePath).buffer;
      }

      const response = await bard.ask(question, askConfig);
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
