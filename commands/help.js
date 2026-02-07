const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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
        { name: '🎊 | entretenimiento', value: 'Muestra la lista de los comandos de entretenimiento' },
        { name: '🔩 | moderación', value: 'Muestra la lista de los comandos de moderación' },
        { name: '🔎 | utilidad', value: 'Muestra la lista de los comandos de utilidad' },
        { name: '📀 | música', value: 'Muestra la lista de los comandos de música' },
      )
      .setThumbnail('https://media.discordapp.net/attachments/1439871609782665288/1469786578921455790/ed32c2cd88b3172fdb0c83ec4e79fe10.jpg?ex=6988eceb&is=69879b6b&hm=219f46e416bea5f4be471689e94c0b38a81c401ce88e04984deaf0726dbe58d4&=&format=webp&width=800&height=800')
      .setFooter({ text: 'Zeph • desarrollada por ♱ - Parra' });

    await interaction.reply({ embeds: [embed] });
  }
};
