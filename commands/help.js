const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("💡 | Muestra información básica del bot"),

  async execute(interaction) {
    const color = 0x4d82bc;

    const embed = new EmbedBuilder()
      .setTitle("📌 Lista de Comandos")
      .setDescription(`
**Comandos disponibles:**

🏓 /ping → Muestra la latencia   

      `)
      .setColor(color);

    await interaction.reply({ embeds: [embed] });
  },
};
