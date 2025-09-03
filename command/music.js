const { SlashCommandBuilder } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  NoSubscriberBehavior,
} = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const queue = new Map();

module.exports = {
  data: [
    new SlashCommandBuilder()
      .setName('play')
      .setDescription('Putar musik dari YouTube URL')
      .addStringOption(option =>
        option.setName('url').setDescription('Link YouTube').setRequired(true)
      ),
    new SlashCommandBuilder().setName('pause').setDescription('Pause musik'),
    new SlashCommandBuilder().setName('resume').setDescription('Lanjutkan musik'),
    new SlashCommandBuilder().setName('skip').setDescription('Lewati lagu'),
    new SlashCommandBuilder().setName('stop').setDescription('Hentikan musik & kosongkan queue'),
    new SlashCommandBuilder().setName('leave').setDescription('Bot keluar dari voice channel'),
    new SlashCommandBuilder().setName('playlist').setDescription('Lihat daftar antrian lagu'),
  ],

  async execute(interaction) {
    const { commandName, guild, channel, member } = interaction;
    const guildId = guild.id;

    if (commandName === 'play') {
      const url = interaction.options.getString('url');
      if (!ytdl.validateURL(url)) return interaction.reply('❌ URL tidak valid!');

      const voiceChannel = member.voice.channel;
      if (!voiceChannel) return interaction.reply('❌ Masuk voice channel dulu!');

      let serverQueue = queue.get(guildId);

      if (!serverQueue) {
        const connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: guildId,
          adapterCreator: guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer({
          behaviors: { noSubscriber: NoSubscriberBehavior.Pause },
        });

        player.on(AudioPlayerStatus.Idle, () => {
          serverQueue.songs.shift();
          playSong(guildId);
        });

        serverQueue = { songs: [], connection, player, textChannel: channel };
        queue.set(guildId, serverQueue);

        connection.subscribe(player);
      }

      const info = await ytdl.getInfo(url);
      const song = { title: info.videoDetails.title, url: info.videoDetails.video_url };
      serverQueue.songs.push(song);

      await interaction.reply(`✅ Ditambahkan ke playlist: **${song.title}**`);

      if (serverQueue.songs.length === 1) playSong(guildId);
    }

    if (commandName === 'pause') {
      const serverQueue = queue.get(guildId);
      if (!serverQueue) return interaction.reply('❌ Tidak ada musik diputar.');
      serverQueue.player.pause();
      await interaction.reply('⏸️ Musik di-pause.');
    }

    if (commandName === 'resume') {
      const serverQueue = queue.get(guildId);
      if (!serverQueue) return interaction.reply('❌ Tidak ada musik diputar.');
      serverQueue.player.unpause();
      await interaction.reply('▶️ Musik dilanjutkan.');
    }

    if (commandName === 'skip') {
      const serverQueue = queue.get(guildId);
      if (!serverQueue) return interaction.reply('❌ Tidak ada musik diputar.');
      serverQueue.player.stop();
      await interaction.reply('⏭️ Lagu dilewati.');
    }

    if (commandName === 'stop') {
      const serverQueue = queue.get(guildId);
      if (!serverQueue) return interaction.reply('❌ Tidak ada musik diputar.');
      serverQueue.songs = [];
      serverQueue.player.stop();
      await interaction.reply('🛑 Musik dihentikan & playlist dikosongkan.');
    }

    if (commandName === 'leave') {
      const serverQueue = queue.get(guildId);
      if (!serverQueue) return interaction.reply('❌ Bot tidak sedang di voice channel.');
      serverQueue.connection.destroy();
      queue.delete(guildId);
      await interaction.reply('👋 Bot keluar dari voice channel.');
    }

    if (commandName === 'playlist') {
      const serverQueue = queue.get(guildId);
      if (!serverQueue || serverQueue.songs.length === 0) {
        return interaction.reply('📭 Playlist kosong.');
      }
      const list = serverQueue.songs
        .map((s, i) => `${i === 0 ? '▶️' : `${i}.`} ${s.title}`)
        .join('\n');
      await interaction.reply(`🎶 Playlist saat ini:\n${list}`);
    }
  },
};

function playSong(guildId) {
  const serverQueue = queue.get(guildId);
  if (!serverQueue || serverQueue.songs.length === 0) {
    queue.delete(guildId);
    return;
  }

  const song = serverQueue.songs[0];
  try {
    const stream = ytdl(song.url, { filter: 'audioonly', highWaterMark: 1 << 25 });
    const resource = createAudioResource(stream);
    serverQueue.player.play(resource);
    serverQueue.textChannel.send(`🎵 Now playing: **${song.title}**`);
  } catch (err) {
    console.error(err);
    serverQueue.songs.shift();
    playSong(guildId);
  }
}
