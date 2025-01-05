require('dotenv').config(); // Load environment variables from .env file
const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, REST, Routes, PermissionsBitField } = require('discord.js');

// TOKEN DAN CLIENT ID dari .env
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Command Definition
const commands = [
  new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Buat embed dan kirim ke channel tertentu.')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Judul dari embed')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('description')
        .setDescription('Deskripsi dari embed')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('color')
        .setDescription('Warna embed (contoh: #3498db)')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('thumbnail')
        .setDescription('URL thumbnail gambar')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('image')
        .setDescription('URL gambar utama')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('author')
        .setDescription('Nama author')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('author_icon')
        .setDescription('URL icon author')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('url')
        .setDescription('URL untuk embed title')
        .setRequired(false)
    )
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel tujuan untuk mengirim embed')
        .setRequired(false)
    )
].map(command => command.toJSON());

// Register Commands
const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands },
    );
    console.log('Commands registered!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
})();

// Bot Ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Command Handler
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'embed') {
    try {
      const title = interaction.options.getString('title');
      const description = interaction.options.getString('description');
      const color = interaction.options.getString('color') || '#3498db';
      const thumbnail = interaction.options.getString('thumbnail');
      const image = interaction.options.getString('image');
      const author = interaction.options.getString('author');
      const authorIcon = interaction.options.getString('author_icon');
      const url = interaction.options.getString('url');
      const targetChannel = interaction.options.getChannel('channel');

      // Mendapatkan nama pembuat dan avatar URL
      const footerText = `${interaction.user.tag} | ${new Date().toLocaleString()}`;
      const footerIcon = interaction.user.displayAvatarURL({ dynamic: true });

      // Membuat embed
      const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(color)
        .setDescription(description)
        .setFooter({ text: footerText, iconURL: footerIcon })
        .setURL(url);

      if (thumbnail) embed.setThumbnail(thumbnail);
      if (image) embed.setImage(image);
      if (author) embed.setAuthor({ name: author, iconURL: authorIcon });

      if (targetChannel) {
        // Pastikan bot memiliki izin untuk mengirim pesan ke channel
        if (!targetChannel.permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages)) {
          return interaction.reply({ content: 'Bot tidak memiliki izin untuk mengirim pesan ke channel tersebut!', ephemeral: true });
        }

        // Kirim embed ke channel yang dipilih
        await targetChannel.send({ embeds: [embed] });
        await interaction.reply({ content: `Embed berhasil dikirim ke ${targetChannel}!`, ephemeral: true });
      } else {
        // Jika tidak ada channel yang dipilih, kirim embed di tempat command dipanggil
        await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Error handling embed command:', error);
      await interaction.reply({ content: 'Terjadi kesalahan saat memproses command!', ephemeral: true });
    }
  }
});

// Login Bot
client.login(TOKEN);