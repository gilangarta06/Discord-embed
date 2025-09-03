require('dotenv').config();

const { Client, GatewayIntentBits, REST, Routes, Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates, // 🔑 penting buat fitur musik
  ],
});

client.commands = new Collection();

// load semua file command di folder ./command
const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, 'command')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const commandModule = require(path.join(__dirname, 'command', file));

  // kalau command export array (kayak music.js), iterasi satu2
  if (Array.isArray(commandModule.data)) {
    for (const cmd of commandModule.data) {
      client.commands.set(cmd.name, { ...commandModule, data: cmd });
      commands.push(cmd);
    }
  } else {
    client.commands.set(commandModule.data.name, commandModule);
    commands.push(commandModule.data);
  }
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('Commands registered!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
})();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error('Error executing command:', error);
    await interaction.reply({ content: 'Terjadi kesalahan saat menjalankan command!', ephemeral: true });
  }
});

client.login(TOKEN);
