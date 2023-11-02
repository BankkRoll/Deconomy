# Economy Discord Bot

![imageedit_4_5545101709](https://github.com/BankkRoll/Deconomy/assets/106103625/9fc23ad3-71bc-44e9-b888-6c9ed6a4ab98)

## Overview

This Discord bot is built using the Sapphire Framework and is designed to provide a range of functionalities including administration tasks, an economy system, and some fun interactive features. The bot is structured to adhere to best coding practices, ensuring it is functionally robust, maintainable, and scalable.

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

1. `gifSearch`: Searches for a GIF based on a keyword.
2. `gifText`: Converts text to a GIF.

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
│     ├── confirm.js              # Utility for confirmation dialogs
│     ├── embed.js                # Utility for creating embeds
│     └── giphy.js                # Utility for interacting with the Giphy API
```
