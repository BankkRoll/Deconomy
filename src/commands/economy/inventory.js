// src/commands/economy/inventory.js
const { Command } = require("@sapphire/framework");
const { userInventory } = require("../../../db");
const { createEmbed } = require("../../utils/embed");

module.exports = class InventoryCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "inventory",
      description: "View the items you currently own.",
    });
  }

  async registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName(this.name).setDescription(this.description)
    );
  }

  async chatInputRun(interaction) {
    const userId = interaction.user.id;

    const inventory = userInventory.get(userId);

    const itemNames = Object.keys(inventory.items);
    const itemDisplay = itemNames
      .map((item) => `${item}: ${inventory.items[item].quantity}`)
      .join("\n");

    const embed = createEmbed({
      description: `Your current inventory:\n${itemDisplay}`,
    });

    await interaction.reply({ embeds: [embed] });
  }
};
