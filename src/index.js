// src/index.js
require("sapphire-plugin-modal-commands/register");
const { SapphireClient } = require("@sapphire/framework");
const config = require("../config.json");
const streamAlerts = require("./utils/streamAlerts");

const activities = [
  { text: "in {servers} servers to building", type: "LISTENING" },
  { text: "{users} users build their economy", type: "WATCHING" },
  { text: "use `/help` for more info", type: "WATCHING" },
];

const client = new SapphireClient({
  intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"],
});

client.once("ready", () => {
  console.log("Bot is online!");
  streamAlerts.init(client);

  let activityIndex = 0;

  setInterval(() => {
    let totalUsers = 0;
    client.guilds.cache.each((guild) => {
      totalUsers += guild.memberCount;
    });

    const serverCount = client.guilds.cache.size;

    const activity = activities[activityIndex];
    let formattedText = activity.text
      .replace("{users}", totalUsers)
      .replace("{servers}", serverCount);

    client.user.setActivity(formattedText, { type: activity.type });

    activityIndex = (activityIndex + 1) % activities.length;
  }, 30000);
});

client.login(config.token);
