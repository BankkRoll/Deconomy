// src/commands/admin/settings.js
const { Command } = require("@sapphire/framework");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { guildSettings, economyData } = require("../../../db");
const { createEmbed } = require("../../utils/embed");

module.exports = class SettingsCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "settings",
      description: "Modify bot configurations and settings.",
    });
  }

  async registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName(this.name).setDescription(this.description)
    );
  }

  async chatInputRun(interaction) {
    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      const embed = createEmbed({
        description: "❌ You don't have permission to use this command.",
      });
      return interaction.reply({ embeds: [embed] });
    }

    const menu = new MessageSelectMenu()
      .setCustomId("setting-select")
      .setPlaceholder("Select a setting to update")
      .addOptions([
        { label: "Logs Channel", value: "logsChannel" },
        { label: "Mod Roles", value: "modRoles" },
        { label: "Currency Symbol", value: "currencySymbol" },
        { label: "Currency Name", value: "currencyName" },
        { label: "Daily Coins Amount", value: "dailyAmount" },
        { label: "Weekly Coins Amount", value: "weeklyAmount" },
        { label: "Work Min Amount", value: "workMin" },
        { label: "Work Max Amount", value: "workMax" },
      ]);

    const row = new MessageActionRow().addComponents(menu);

    await interaction.reply({
      content: "Which setting would you like to update?",
      components: [row],
    });

    const guildId = interaction.guild.id;

    const filter = (i) => i.customId === "setting-select";
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (i) => {
      await i.deferUpdate();
      const settingToUpdate = i.values[0];

      if (settingToUpdate === "logsChannel") {
        await interaction.followUp("Please mention the new logs channel.");
        const newLogsChannel = await interaction.channel.awaitMessages({
          max: 1,
          time: 60000,
        });
        if (newLogsChannel.first().mentions.channels.size > 0) {
          const newLogsChannelId = newLogsChannel
            .first()
            .mentions.channels.first().id;
          guildSettings.set(guildId, newLogsChannelId, "logsChannel");
          await interaction.followUp("Logs channel successfully updated.");
        } else {
          await interaction.followUp("Error: Invalid channel mention.");
        }
      } else if (settingToUpdate === "modRoles") {
        await interaction.followUp("Please mention the new moderator roles.");
        const newRoles = await interaction.channel.awaitMessages({
          max: 1,
          time: 60000,
        });
        if (newRoles.first().mentions.roles.size > 0) {
          const newRolesIds = newRoles
            .first()
            .mentions.roles.map((role) => role.id);
          guildSettings.set(guildId, newRolesIds, "modRoles");
          await interaction.followUp("Moderator roles successfully updated.");
        } else {
          await interaction.followUp("Error: Invalid role mention.");
        }
      } else if (settingToUpdate === "currencySymbol") {
        await interaction.followUp("Please provide the new currency symbol.");
        const newSymbol = await interaction.channel.awaitMessages({
          max: 1,
          time: 60000,
        });
        if (newSymbol.first().content) {
          economyData.set(guildId, newSymbol.first().content, "currencySymbol");
          await interaction.followUp("Currency symbol successfully updated.");
        } else {
          await interaction.followUp("Error: Invalid currency symbol.");
        }
      } else if (settingToUpdate === "currencyName") {
        await interaction.followUp("Please provide the new currency name.");
        const newName = await interaction.channel.awaitMessages({
          max: 1,
          time: 60000,
        });
        if (newName.first().content) {
          economyData.set(guildId, newName.first().content, "currencyName");
          await interaction.followUp("Currency name successfully updated.");
        } else {
          await interaction.followUp("Error: Invalid currency name.");
        }
      } else if (settingToUpdate === "dailyAmount") {
        await interaction.followUp(
          "Please provide the new daily coins amount."
        );
        const newDailyAmount = await interaction.channel.awaitMessages({
          max: 1,
          time: 60000,
        });
        if (!isNaN(newDailyAmount.first().content)) {
          economyData.set(
            guildId,
            parseInt(newDailyAmount.first().content),
            "dailyAmount"
          );
          await interaction.followUp(
            "Daily coins amount successfully updated."
          );
        } else {
          await interaction.followUp("Error: Invalid daily coins amount.");
        }
      } else if (settingToUpdate === "weeklyAmount") {
        await interaction.followUp(
          "Please provide the new weekly coins amount."
        );
        const newWeeklyAmount = await interaction.channel.awaitMessages({
          max: 1,
          time: 60000,
        });
        if (!isNaN(newWeeklyAmount.first().content)) {
          economyData.set(
            guildId,
            parseInt(newWeeklyAmount.first().content),
            "weeklyAmount"
          );
          await interaction.followUp(
            "Weekly coins amount successfully updated."
          );
        } else {
          await interaction.followUp("Error: Invalid weekly coins amount.");
        }
      } else if (settingToUpdate === "workMin") {
        await interaction.followUp(
          "Please provide the new minimum work amount."
        );
        const newWorkMin = await interaction.channel.awaitMessages({
          max: 1,
          time: 60000,
        });
        if (!isNaN(newWorkMin.first().content)) {
          economyData.set(
            guildId,
            parseInt(newWorkMin.first().content),
            "workMin"
          );
          await interaction.followUp(
            "Minimum work amount successfully updated."
          );
        } else {
          await interaction.followUp("Error: Invalid minimum work amount.");
        }
      } else if (settingToUpdate === "workMax") {
        await interaction.followUp(
          "Please provide the new maximum work amount."
        );
        const newWorkMax = await interaction.channel.awaitMessages({
          max: 1,
          time: 60000,
        });
        if (!isNaN(newWorkMax.first().content)) {
          economyData.set(
            guildId,
            parseInt(newWorkMax.first().content),
            "workMax"
          );
          await interaction.followUp(
            "Maximum work amount successfully updated."
          );
        } else {
          await interaction.followUp("Error: Invalid maximum work amount.");
        }
      }
    });
  }
};
