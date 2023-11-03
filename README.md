# Economy Discord Bot

![imageedit_4_5545101709](https://github.com/BankkRoll/Deconomy/assets/106103625/9fc23ad3-71bc-44e9-b888-6c9ed6a4ab98)

## Overview

**Deconomy** is a feature-rich Discord bot designed to enhance user engagement in your server by introducing an economy system, fun interactions, and administrative utilities. Built with the Sapphire Framework, it offers a seamless and enjoyable experience.

- **Economy System**: Virtual currency, shop, inventory, and more.
- **Fun Commands**: GIF searches, AI chats, and interactive experiences.
- **Admin Utilities**: Server management made easy.
- **AI Integration**: Chat with Google Bard AI.

> [!IMPORTANT] > **Disclaimer:**
> Please note that the APIs used in this bot are not owned or maintained by us. The usage of these APIs is at your own risk, and we make no guarantees regarding the availability, accuracy, or functionality of these services. If you are the endpoint owner and would like to remove them please open a issue and ill handle it accordingly.

## Installation Instructions

1. **Clone the Repository**:

   ```sh
   git clone https://github.com/BankkRoll/Deconomy.git
   cd Deconomy
   ```

2. **Install Dependencies**:

   ```sh
   npm install
   ```

3. **Configure Settings**:

   - Rename `config.json.example` to `config.json`.
   - Edit `config.json` to add your bot token, prefix, and other settings.

   You need to obtain the cookie session value. Here's how you can get it:

   1. Visit [https://bard.google.com/](https://bard.google.com/).
   2. Open the browser console by pressing F12.
   3. Go to the "Application" tab.
   4. Under "Cookies", find the cookie named `__Secure-1PSID` or `__Secure-3PSID`.
   5. Copy the value of the cookie, which will be your session value. Use as `BARD_TOKEN` in config.

4. **Start the Bot**:
   ```sh
   npm run start
   ```

## Usage

- Use `/help` to get a list of commands.
- Admin commands like `/addcoins`, `/removecoins`, etc., are used for managing the economy system.
- Economy commands such as `/balance`, `/buy`, `/daily`, etc., are used for interacting with the economy system.
- Fun commands like `/gifSearch` and `/gifText` provide entertainment for users.

## Commands

### Admin Commands

1. `addcoins`: Adds coins to a user's account.
2. `additem`: Adds an item to the shop.
3. `info`: Provides bot server setting information.
4. `ping`: Checks the bot's latency.
5. `removecoins`: Removes coins from a user's account.
6. `removeitem`: Removes an item from the shop.
7. `setcoins`: Sets the users coins to the specified amount.
8. `settings`: Updates server settings.
9. `setup`: Initial setup of the bot.

### AI Commands

1. `bard`: Sends a question to Google Bard and returns the response.
2. `startchat`: Starts a chat session with Google Bard.

### Economy Commands

1. `balance`: Checks your balance or another user's balance.
2. `buy`: Buys an item from the shop.
3. `daily`: Claims daily coins.
4. `inventory`: Views your inventory.
5. `leaderboard`: Shows the top users based on their balance.
6. `shop`: Displays available items in the shop.
7. `weekly`: Claims weekly coins.
8. `work`: Earns coins by working.

### Fun Commands

1. `gifsearch`: Searches for a GIF based on a keyword.
2. `giftext`: Converts text to a GIF.

### Streamer Commands

1. `addstreamer`: Adds a streamer to the streamer list.
2. `liststreamers`: Lists all streamers in the list.
3. `removestreamer`: Removes a streamer from the streamer list.

### Utility Commands

1. `help`: Provides information on how to use the bot and its commands.

```sql
├── .sapphirerc.json              # Configuration for the Sapphire Framework
├── config.json.example           # Example or template configuration file example
├── db.js                         # Database setup and connection script
├── src
│  ├── arguments                  # Custom argument types for commands
│  ├── assets                     # Static assets (images, sounds, etc.)
│  ├── commands                   # Bot commands
│  │  ├── admin
│  │  │  ├── addcoins.js          # Command to add coins to a user's account
│  │  │  ├── additem.js           # Command to add an item to the shop
│  │  │  ├── info.js              # Command to display bot server settings information
│  │  │  ├── ping.js              # Command to check bot's latency
│  │  │  ├── removecoins.js       # Command to remove coins from a user's account
│  │  │  ├── removeitem.js        # Command to remove an item from the shop
│  │  │  ├── setcoins.js          # Command to set a user's coin balance to a specified amount
│  │  │  ├── settings.js          # Command to update server settings
│  │  │  └── setup.js             # Command for initial bot setup
│  │  ├── ai
│  │  │  ├── bard.js              # Command to ask bard AI a question
│  │  │  └── startchat.js         # Command to start a live chat with bard AI
│  │  ├── economy
│  │  │  ├── balance.js           # Command to check a user's coin balance
│  │  │  ├── buy.js               # Command to buy an item from the shop
│  │  │  ├── daily.js             # Command to claim daily coins
│  │  │  ├── inventory.js         # Command to view a user's inventory
│  │  │  ├── leaderboard.js       # Command to show top users based on coin balance
│  │  │  ├── shop.js              # Command to display available items in the shop
│  │  │  ├── weekly.js            # Command to claim weekly coins
│  │  │  └── work.js              # Command to earn coins by working
│  │  ├── fun
│  │  │  ├── gifSearch.js         # Command to search for a GIF based on a keyword
│  │  │  └── gifText.js           # Command to convert text to a GIF
│  │  ├── social
│  │  │  ├── addstreamer.js       # Command to add a streamer to the streamer list
│  │  │  ├── liststreamers.js     # Command to list streamers from the streamer list
│  │  │  └── removestreamer.js    # Command to remove a streamer from the streamer list
│  │  └── util
│  │     └── help.js              # Command to display help information
│  ├── index.js                   # Entry point of the bot
│  ├── interaction-handlers       # Handlers for interactions (buttons, selects, etc.)
│  ├── listeners                  # Event listeners
│  │  ├── economyListener.js      # Listener for economy-related events
│  │  └── interactionCreate.js    # Listener for interaction creation events
│  ├── preconditions             # Preconditions for command execution
│  ├── routes                     # Routes for web server/API
│  └── utils
│     ├── bard.js                 # Utility for bard-related events
│     ├── confirm.js              # Utility for confirmation dialogs
│     ├── embed.js                # Utility for creating embeds
│     ├── giphy.js                # Utility for interacting with the Giphy API
│     └── streamAlerts.js         # Utility for interacting with the stream alerts
```

## License

This project is licensed under the MIT License. For more details, see the [LICENSE](./LICENSE) file in the repository.
