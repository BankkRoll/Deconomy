// src/listeners/economyListener.js
const { Listener } = require("@sapphire/framework");
const { guildSettings } = require("../../db");
const { createEmbed } = require("../utils/embed");

module.exports = class EconomyListener extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      event: "economyChange",
    });
  }

  async run(
    guildId,
    userId,
    changeType,
    amount,
    executedBy,
    commandUsed,
    itemName = null,
    itemAmount = null
  ) {
    const logsChannelId = guildSettings.get(guildId, "logsChannel");
    const logsChannel = this.container.client.channels.cache.get(logsChannelId);
    const userMention = `<@${userId}>`;
    const executedByMention = `<@${executedBy}>`;

    const fields = [
      { name: "Executor", value: executedByMention, inline: true },
      { name: "Action", value: changeType, inline: true },
      {
        name: "Amount",
        value: amount ? amount.toString() : "N/A",
        inline: true,
      }, // Null check here
      { name: "Recipient", value: userMention, inline: true },
      { name: "Command", value: `\`${commandUsed}\``, inline: true },
    ];

    if (itemName && itemAmount) {
      fields.push(
        { name: "Item", value: itemName, inline: true },
        {
          name: "Item Amount",
          value: itemAmount ? itemAmount.toString() : "N/A",
          inline: true,
        } // Null check here
      );
    }

    const embed = createEmbed({
      title: "Economy Log",
      timestamp: true,
      fields: fields,
    });

    logsChannel.send({ embeds: [embed] });
  }
};
