const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Responde con Pong! 🏓'),
    async execute(interaction, client) {
        const latency = Date.now() - interaction.createdTimestamp;
        const websocket = client.ws.ping;

        // Determinar color según latencia
        let color;
        if (latency < 100) color = 0x00ff00; // verde
        else if (latency < 200) color = 0xffff00; // amarillo
        else color = 0xff0000; // rojo

        // Crear embed
        const pingEmbed = new EmbedBuilder()
            .setTitle('🏓 Pong!')
            .setColor(color)
            .addFields(
                { name: 'Latencia', value: `${latency}ms`, inline: true },
                { name: 'WebSocket', value: `${websocket}ms`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Comando ejecutado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [pingEmbed] });
    }
};


