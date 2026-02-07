const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Muestra la latencia del bot"),

  async execute(interaction, client) {
    const latency = Date.now() - interaction.createdTimestamp;
    const websocket = client.ws.ping;

    const embed = new EmbedBuilder()
      .setTitle("🏓 Pong!")
      .setColor("#5865F2")
      .addFields(
        { name: "🤖 Latencia", value: `${latency} ms`, inline: true },
        { name: "🌐 WebSocket", value: `${websocket} ms`, inline: true }
      )
      .setTimestamp();

    // RESPONDER SOLO UNA VEZ
    await interaction.reply({ embeds: [embed] });
  }
};





