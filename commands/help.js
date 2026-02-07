const { 
  SlashCommandBuilder, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('💡 | Muestra la lista de comandos disponibles'),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle('📖 | Comandos del bot')
      .setColor('#5990A8')
      .setDescription('Aquí tienes la lista de comandos disponibles:')
      .addFields(
        { name: '🎊 | entretenimiento', value: 'Comandos de diversión' },
        { name: '🔩 | moderación', value: 'Comandos de staff' },
        { name: '🔎 | utilidad', value: 'Comandos útiles' },
        { name: '📀 | música', value: 'Comandos de música' },
      )
      .setImage('https://i.pinimg.com/736x/6e/42/b0/6e42b0b441db7ff53d8ac0595f03a223.jpg')
      .setFooter({ text: 'Zeph • desarrollada por ♱ - Parra' });

    // BOTONES
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('help_fun')
        .setLabel('🎊 Entretenimiento')
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId('help_mod')
        .setLabel('🔩 Moderación')
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId('help_utils')
        .setLabel('🔎 Utilidad')
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId('help_music')
        .setLabel('📀 Música')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};

