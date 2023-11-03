const { Command } = require("@sapphire/framework");
const { MessageActionRow, MessageButton } = require("discord.js");
const { shopItems, economyData } = require("../../../db");
const { createEmbed } = require("../../utils/embed");

// Utility function to paginate items
function paginate(items, itemsPerPage) {
  const pages = [];
  for (let i = 0; i < items.length; i += itemsPerPage) {
    pages.push(items.slice(i, i + itemsPerPage));
  }
  return pages;
}

module.exports = class ShopCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "shop",
      description: "View the items available for purchase in the shop.",
    });
  }

  async registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName(this.name).setDescription(this.description)
    );
  }

  async chatInputRun(interaction) {
    const guildId = interaction.guild.id;
    const guildEconomy = economyData.get(guildId);
    const currencyName = guildEconomy.currencyName;
    const currencyIcon = guildEconomy.currencySymbol;

    const guildShop = shopItems.get(guildId);
    const items = Object.values(guildShop.items);
    const paginatedItems = paginate(items, 10);

    let pageIndex = 0;

    const fillerPositions = new Set([1, 4, 7, 10, 13, 16]);

    const updateEmbed = (embed, items) => {
      embed.fields = [];
      let itemIndex = 0;
      let totalCount = 0;

      while (itemIndex < items.length) {
        if (fillerPositions.has(totalCount)) {
          embed.addField("\u200B", "\u200B", true);
        } else {
          const item = items[itemIndex];
          let value = `${currencyIcon} ${item.price} ${currencyName}\n`;
          if (item.role) value += `🛡 Role: <@&${item.role}>\n`;
          if (item.amount !== "unlimited")
            value += `🔢 Amount Left: ${item.amount}\n`;
          embed.addField(item.name, value, true);
          itemIndex++;
        }
        totalCount++;
      }
    };

    const buttons = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("previous")
        .setLabel("◀️")
        .setStyle("SECONDARY"),
      new MessageButton()
        .setCustomId("next")
        .setLabel("▶️")
        .setStyle("SECONDARY")
    );

    const embed = createEmbed({ title: "Shop" });
    updateEmbed(embed, paginatedItems[pageIndex]);

    const message = await interaction.reply({
      embeds: [embed],
      components: [buttons],
      fetchReply: true,
    });

    const filter = (i) => {
      i.deferUpdate();
      return i.customId === "previous" || i.customId === "next";
    };

    const collector = message.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", (i) => {
      if (i.customId === "previous") {
        pageIndex = Math.max(pageIndex - 1, 0);
      } else {
        pageIndex = Math.min(pageIndex + 1, paginatedItems.length - 1);
      }
      updateEmbed(embed, paginatedItems[pageIndex]);
      interaction.editReply({ embeds: [embed], components: [buttons] });
    });
  }
};
