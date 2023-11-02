// src/utils/streamAlerts.js
const { streamerData } = require("../../db");
const { createEmbed } = require("./embed");
const config = require("../../config.json");

const liveStreamers = new Set();

module.exports = {
  init: (client) => {
    setInterval(() => checkStreamers(client), 60 * 1000); // poll every 60 seconds
  },
};

async function checkStreamers(client) {
  if (client.guilds.cache.size === 0) return;

  for (const [guildId, guild] of client.guilds.cache) {
    const streamers = streamerData.ensure(guildId, { streamers: [] }).streamers;

    for (const streamer of streamers) {
      const isLive = await checkIfLive(streamer);
      const liveStreamKey = `${guildId}-${streamer.name}-${streamer.platform}`;

      if (isLive && !liveStreamers.has(liveStreamKey)) {
        liveStreamers.add(liveStreamKey);

        const channelID = streamer.channel.replace(/[<#>]/g, "");
        const channel = client.channels.cache.get(channelID);
        if (!channel) continue;

        const embed = createEmbed({
          title: streamer.title,
          description: `${streamer.description}\nCheck out the live stream on [${streamer.platform}](${streamer.url}).`,
          color: config.color,
          image: streamer.imageUrl,
        });

        await channel.send({ embeds: [embed] });
      } else if (!isLive) {
        liveStreamers.delete(liveStreamKey);
      }
    }
  }
}

async function checkIfLive(streamer) {
  const platformCheckers = {
    twitch: checkTwitchLive,
    youtube: checkYouTubeLive,
    rumble: checkRumbleLive,
    // kick: checkKickLive,
    // tiktok: checkTikTokLive,
  };

  const checker = platformCheckers[streamer.platform.toLowerCase()];
  return checker ? checker(streamer) : false;
}

async function checkYouTubeLive(streamer) {
  try {
    const response = await fetch(
      `https://www.youtube.com/channel/${streamer.userId}`
    );
    const sourceCode = await response.text();
    const isLive = sourceCode.includes('"text":"LIVE"');

    if (isLive) {
      streamer.title = sourceCode.match(/"label":"([^"]+) by/)[1];
      streamer.description = streamer.title;
      const imageUrlRegex =
        /"url":"(https:\/\/i\.ytimg\.com\/[^"]+)",(?:[^}]*"width":336)/;
      const imageUrlMatch = sourceCode.match(imageUrlRegex);
      streamer.imageUrl = imageUrlMatch
        ? imageUrlMatch[1]
        : sourceCode.match(/"url":"([^"]+)"(?:[^}]*"width":68)/)[1];
      streamer.url = `https://www.youtube.com/channel/${streamer.userId}`;
    }

    return isLive;
  } catch {
    return false;
  }
}

async function checkTwitchLive(streamer) {
  try {
    const response = await fetch(`https://twitch.tv/${streamer.name}`);
    const sourceCode = await response.text();
    const isLive = sourceCode.includes('"isLiveBroadcast":true');

    if (isLive) {
      streamer.title = sourceCode.match(
        /<meta property="og:title" content="([^"]+)"\/>/
      )[1];
      streamer.description = sourceCode.match(
        /<meta property="og:description" content="([^"]+)"\/>/
      )[1];
      streamer.url = sourceCode.match(
        /<meta property="og:url" content="([^"]+)"\/>/
      )[1];
      const imageUrlRegex = /"thumbnailUrl":\["[^"]+","([^"]+320x180\.jpg)"/;
      const imageUrlMatch = sourceCode.match(imageUrlRegex);
      streamer.imageUrl = imageUrlMatch
        ? imageUrlMatch[1]
        : sourceCode.match(
            /<meta name="twitter:image" content="([^"]+)"\/>/
          )[1];
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

async function checkRumbleLive(streamer) {
  try {
    const response = await fetch(`https://rumble.com/c/${streamer.name}`);
    const sourceCode = await response.text();

    // Check for elements that indicate a live stream
    const isLive = sourceCode.includes(
      '<span class="video-item--live" data-value="LIVE"></span>'
    );

    if (isLive) {
      const titleMatch = sourceCode.match(
        /<h3 class=video-item--title>(.*?)<\/h3>/
      );
      const imageUrlMatch = sourceCode.match(
        /<img class="video-item--img" src=(https:\/\/[^ ]+\.jpg) /
      );
      const viewerCountMatch = sourceCode.match(
        /<span class="video-item--watching">(\d+) watching<\/span>/
      );

      streamer.title = titleMatch ? titleMatch[1] : "Live Stream";
      streamer.description = streamer.title;
      streamer.imageUrl = imageUrlMatch ? imageUrlMatch[1] : "";
      streamer.url = `https://rumble.com/c/${streamer.name}`;
      streamer.viewerCount = viewerCountMatch
        ? parseInt(viewerCountMatch[1])
        : 0;
    }

    return isLive;
  } catch {
    return false;
  }
}

async function checkKickLive(streamer) {
  // TODO: Implement API call to check if Kick streamer is live
}

async function checkTikTokLive(streamer) {
  // TODO: Implement API call to check if TikTok streamer is live
}
