const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');
const fs = require('fs');
const path = require('path');

const commandsPath = path.join(__dirname, '../'); // ajusta ruta
const categories = fs.readdirSync(commandsPath);

let totalCommands = 0;

for (const category of categories) {
  const files = fs.readdirSync(`${commandsPath}/${category}`)
    .filter(file => file.endsWith('.js'));
  totalCommands += files.length;
}

const totalCategories = categories.length;


module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('💡 | Muestra el menú de ayuda'),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle('📖 | Menú de ayuda')
      .setColor('#313e59')
      .setDescription(`Tengo **${totalCategories} categorías** y **${totalCommands} comandos** disponibles. Selecciona una categoría para ver sus comandos.`)
      .setFooter({ text: 'Zeph • desarrollada por ♱ - Parra' });

    const menu = new StringSelectMenuBuilder()
      .setCustomId('help_menu')
      .setPlaceholder('Categorías')
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


