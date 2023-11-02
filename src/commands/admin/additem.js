// src/commands/admin/additem.js
const { Command } = require("@sapphire/framework");
const { shopItems, economyData } = require("../../../db"); // Added economyData for currency name
const { createEmbed } = require("../../utils/embed");
const confirm = require("../../utils/confirm"); // Import the confirm utility

module.exports = class AddItemCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "additem",
      description: "Add a new item into the shop with specified attributes.",
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
            .setDescription("Name of the item")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("desc")
            .setDescription("Description of the item")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("price")
            .setDescription("Price of the item")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("img")
            .setDescription("Image URL for the item")
            .setRequired(false)
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Role to be assigned when bought")
            .setRequired(false)
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("Maximum amount that can be bought")
            .setRequired(false)
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
    const desc = interaction.options.getString("desc");
    const price = interaction.options.getInteger("price");
    const img = interaction.options.getString("img");
    const role = interaction.options.getRole("role");
    const amount = interaction.options.getInteger("amount");

    const guildShop = shopItems.get(guildId);
    const guildEconomy = economyData.get(guildId);
    const currencyName = guildEconomy.currencyName;

    if (guildShop.items.hasOwnProperty(name)) {
      const embed = createEmbed({
        description: `❌ An item with the name "${name}" already exists.`,
      });
      return interaction.followUp({ embeds: [embed] });
    }

    const confirmed = await confirm(
      interaction,
      `Are you sure you want to add the item "${name}" with the price of ${price} ${currencyName}?`
    );
    if (!confirmed) {
      const embed = createEmbed({
        description: "Operation cancelled.",
      });
      return interaction.followUp({ embeds: [embed] });
    }

    const newItem = {
      name,
      desc,
      price,
      img: img || null,
      role: role ? role.id : null,
      amount: amount || "unlimited",
    };

    guildShop.items[name] = newItem;
    shopItems.set(guildId, guildShop);

    this.container.client.emit(
      "economyChange",
      guildId,
      "shop",
      "item-added",
      price,
      interaction.user.id,
      "additem",
      name,
      amount || "unlimited",
      img
    );

    const embed = createEmbed({
      title: "Item Added",
      description: `Successfully added ${name} to the shop for ${price} ${currencyName}.`,
      image: img,
    });
    await interaction.followUp({ embeds: [embed] });
  }
};
