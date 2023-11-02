// interaction-handlers/giphyHandler.js
const { GiphyFetch } = require("@giphy/js-fetch-api");
const config = require("../../config.json");

// Initialize Giphy SDK
const gf = new GiphyFetch(config.giphyApiKey);

// Function to get GIF URL based on a keyword search
exports.getGifUrl = async (keyword, limit = 10) => {
  const { data } = await gf.search(keyword, { limit });
  if (data.length === 0) {
    return "";
  }
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex]?.images?.original?.url || "";
};

// Function to get multiple custom animated text URLs
exports.getCustomTexts = async (text, count = 1) => {
  const { data } = await gf.animate(text, { limit: count });
  const urls = data
    .map((item) => item?.images?.original?.url)
    .filter((url) => url);
  return urls;
};
