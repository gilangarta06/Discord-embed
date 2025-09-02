const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: {
    name: 'embed',
    description: 'Buat embed dan kirim ke channel tertentu.',
    options: [
      {
        name: 'title',
        description: 'Judul dari embed',
        type: 3, 
        required: true,
      },
      {
        name: 'description',
        description: 'Deskripsi dari embed',
        type: 3,
        required: false,
      },
      {
        name: 'color',
        description: 'Warna embed (contoh: #3498db)',
        type: 3,
        required: false,
      },
      {
        name: 'thumbnail',
        description: 'URL thumbnail gambar',
        type: 3,
        required: false,
      },
      {
        name: 'image',
        description: 'URL gambar utama',
        type: 3,
        required: false,
      },
      {
        name: 'author',
        description: 'Nama author',
        type: 3,
        required: false,
      },
      {
        name: 'author_icon',
        description: 'URL icon author',
        type: 3,
        required: false,
      },
      {
        name: 'url',
        description: 'URL untuk embed title',
        type: 3,
        required: false,
      },
      {
        name: 'channel',
        description: 'Channel tujuan untuk mengirim embed',
        type: 7, 
        required: false,
      },
    ],
  },

  async execute(interaction) {
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

      const footerText = `${interaction.user.tag} | ${new Date().toLocaleString()}`;
      const footerIcon = interaction.user.displayAvatarURL({ dynamic: true });

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
        if (!targetChannel.permissionsFor(interaction.client.user).has(PermissionsBitField.Flags.SendMessages)) {
          return interaction.reply({ content: 'Bot tidak memiliki izin untuk mengirim pesan ke channel tersebut!', ephemeral: true });
        }

        await targetChannel.send({ embeds: [embed] });
        await interaction.reply({ content: `Embed berhasil dikirim ke ${targetChannel}!`, ephemeral: true });
      } else {
        await interaction.reply({ embeds: [embed], ephemeral: true });
      }
    } catch (error) {
      console.error('Error handling embed command:', error);
      await interaction.reply({ content: 'Terjadi kesalahan saat memproses command!', ephemeral: true });
    }
  },
};
