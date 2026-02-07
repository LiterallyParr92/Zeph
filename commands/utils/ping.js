const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Muestra la latencia del bot"),

  async execute(interaction, client) {
    const latency = Date.now() - interaction.createdTimestamp;
    const websocket = client.ws.ping;

    // 🎨 Color según latencia
    let color = 0x57F287; // verde
    if (latency >= 200 && latency < 300) color = 0xFEE75C; // amarillo
    if (latency >= 300) color = 0xED4245; // rojo

    const embed = new EmbedBuilder()
      .setTitle("🏓 Pong!")
      .setColor(color)
      .addFields(
        { name: "📡 Latencia", value: `${latency} ms`, inline: true },
        { name: "🌐 WebSocket", value: `${websocket} ms`, inline: true }
      )
      .setFooter({
        text: `Comando ejecutado por ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};






