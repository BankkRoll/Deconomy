// src/commands/economy/leaderboard.js
const { Command } = require("@sapphire/framework");
const { MessageActionRow, MessageButton } = require("discord.js");
const { economyData } = require("../../../db");
const { createEmbed } = require("../../utils/embed");

// Utility function to paginate leaderboard
function paginate(items, itemsPerPage) {
  const pages = [];
  for (let i = 0; i < items.length; i += itemsPerPage) {
    pages.push(items.slice(i, i + itemsPerPage));
  }
  return pages;
}

module.exports = class LeaderboardCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "leaderboard",
      description: "Show the top users sorted by coin balance.",
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

    const sortedUsers = Object.keys(guildEconomy.userBalances)
      .map((userId) => {
        return {
          userId,
          balance: guildEconomy.userBalances[userId].balance,
        };
      })
      .sort((a, b) => b.balance - a.balance);

    const paginatedUsers = paginate(sortedUsers, 20);
    let pageIndex = 0;

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

    const updateLeaderboard = (embed, users) => {
      const leaderboardText = users
        .map(
          (user, index) =>
            `${index + 1}. <@${user.userId}>: ${
              user.balance
            } ${currencyIcon} ${currencyName}`
        )
        .join("\n");
      embed.setDescription(`Top Earners:\n${leaderboardText}`);
    };

    const embed = createEmbed({ title: `Leaderboard` });
    updateLeaderboard(embed, paginatedUsers[pageIndex]);

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
        pageIndex = Math.min(pageIndex + 1, paginatedUsers.length - 1);
      }
      updateLeaderboard(embed, paginatedUsers[pageIndex]);
      interaction.editReply({ embeds: [embed], components: [buttons] });
    });
  }
};
