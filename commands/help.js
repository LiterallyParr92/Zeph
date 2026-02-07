const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('💡 | Muestra el menú de ayuda'),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle('📖 Menú de ayuda')
      .setColor('#2b2d31')
      .setDescription('Selecciona una categoría en el menú desplegable 👇')
      .setFooter({ text: 'Zeph • desarrollada por ♱ - Parra' });

    const menu = new StringSelectMenuBuilder()
      .setCustomId('help_menu')
      .setPlaceholder('📂 Selecciona una categoría')
      .addOptions([
        {
          label: '🎊 Entretenimiento',
          description: 'Comandos de Entretenimiento',
          value: 'fun',
        },
        {
          label: '🔩 Moderación',
          description: 'Comandos de moderación',
          value: 'mod',
        },
        {
          label: '🔎 Utilidad',
          description: 'Comandos útiles',
          value: 'utils',
        },
        {
          label: '📀 Música',
          description: 'Comandos de música',
          value: 'music',
        },
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};


