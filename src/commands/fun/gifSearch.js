// commands/gifSearch.js
const { Command } = require("@sapphire/framework");
const { getGifUrl } = require("../../utils/giphy");

module.exports = class extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "gifsearch",
      description: "Search and display a GIF using a keyword.",
    });
  }

  async registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option
            .setName("keyword")
            .setDescription("The keyword to search for")
            .setRequired(true)
        )
    );
  }

  async chatInputRun(interaction) {
    const keyword = interaction.options.getString("keyword");
    const gifUrl = await getGifUrl(keyword);
    if (gifUrl) {
      interaction.reply({ files: [gifUrl] });
    } else {
      interaction.reply("Sorry, no GIFs found for that keyword.");
    }
  }
};
