const { SlashCommandBuilder, Embedbuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("💡 | Muestra información basica del bot y la lista de comandos basicos disponibles para usar"),
  async execute(interaction, client) {
    const color = 0x4d82bc;
    const embed = new Embedbuilder()
      .setTitle("Lista de Comandos")
      .setDescription("Aquí tienes la lista de comandos disponibles:\n\n- `/ping`: Muestra la latencia del bot\n- `/help`: Muestra esta información de ayuda\n\n¡Espero que te sean útiles!");
    await interaction.reply({ embeds: [embed.setColor(color)] });
  }
};