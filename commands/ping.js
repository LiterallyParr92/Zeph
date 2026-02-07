const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Responde con Pong! 🏓'),
    async execute(interaction, client) {
        const latency = Date.now() - interaction.createdTimestamp;
        const websocket = client.ws.ping;

        // Si usaste deferReply, usamos editReply
        if (interaction.deferred) {
            await interaction.editReply(`Pong! 🏓 Latencia: ${latency}ms. WebSocket: ${websocket}ms`);
        } else {
            await interaction.reply(`Pong! 🏓 Latencia: ${latency}ms. WebSocket: ${websocket}ms`);
        }
    }
};



