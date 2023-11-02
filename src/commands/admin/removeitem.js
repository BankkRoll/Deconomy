// src/commands/admin/removeitem.js
const { Command } = require("@sapphire/framework");
const { shopItems } = require("../../../db");
const { createEmbed } = require("../../utils/embed");
const confirm = require("../../utils/confirm");

module.exports = class RemoveItemCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "removeitem",
      description: "Remove an item from the shop using its identifier.",
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
            .setDescription("Name of the item to remove")
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
    const name = interaction.options.getString("name").toLowerCase();
    const guildShop = shopItems.get(guildId);

    if (!guildShop.items.hasOwnProperty(name)) {
      const embed = createEmbed({
        description: `❌ Item ${name} does not exist in the shop.`,
      });
      return interaction.followUp({ embeds: [embed] });
    }

    const confirmed = await confirm(
      interaction,
      `Are you sure you want to remove the item ${name} from the shop?`
    );
    if (!confirmed) {
      const embed = createEmbed({
        description: "Operation cancelled.",
      });
      return interaction.followUp({ embeds: [embed] });
    }

    const item = guildShop.items[name];
    const itemImage = item.img;

    delete guildShop.items[name];
    shopItems.set(guildId, guildShop);

    this.container.client.emit(
      "economyChange",
      guildId,
      "shop",
      "item-removed",
      null,
      interaction.user.id,
      "removeitem",
      name,
      1,
      itemImage
    );

    const embed = createEmbed({
      title: "Item Removed",
      description: `Successfully removed ${name} from the shop.`,
      image: itemImage,
    });
    await interaction.followUp({ embeds: [embed] });
  }
};
