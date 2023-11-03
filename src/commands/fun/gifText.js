// commands/gifText.js
const { Command } = require("@sapphire/framework");
const { getCustomTexts } = require("../../utils/giphy");

module.exports = class extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "giftext",
      description: "Generate a GIF from text input.",
    });
  }

  async registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option
            .setName("text")
            .setDescription("The text to animate")
            .setRequired(true)
        )
    );
  }

  async chatInputRun(interaction) {
    await interaction.deferReply({ ephemeral: false });

    const text = interaction.options.getString("text");
    const variations = 10;

    try {
      const gifUrls = await getCustomTexts(text, variations);

      if (gifUrls.length > 0) {
        await interaction.editReply({ files: gifUrls });
      } else {
        await interaction.editReply(
          "Sorry, no animated text could be generated."
        );
      }
    } catch (error) {
      console.error("Error fetching GIFs:", error);
      await interaction.editReply(
        "An error occurred while fetching animated text."
      );
    }
  }
};
