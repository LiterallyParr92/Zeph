const { ActivityType, EmbedBuilder } = require('discord.js');

/**
 * Función para establecer la presencia dinámica del bot
 * @param {Client} client - instancia del bot
 * @param {string} [channelId] - opcional, canal donde enviar embed al iniciar
 */
function setPresence(client, channelId) {
    const messages = [
        () => `en ${client.guilds.cache.size} servidor${client.guilds.cache.size !== 1 ? 'es' : ''}`,
        () => 'usa /ping para probarme 🏓',
        () => 'aprendiendo cosas nuevas cada día 😎'
    ];

    // Función para actualizar la presencia
    const updatePresence = () => {
        const index = Math.floor(Math.random() * messages.length);
        const activityMessage = messages[index]();

        client.user.setPresence({
            activities: [
                {
                    name: activityMessage,
                    type: ActivityType.Playing // Cambia a Listening, Watching, Competing si quieres
                }
            ],
            status: 'online'
        });

        console.log(`✅ Presencia actualizada: ${activityMessage}`);
    };

    // Actualizar inmediatamente al iniciar
    updatePresence();

    // Rotar presencia cada 15 segundos
    setInterval(updatePresence, 15000);

    // Opcional: enviar embed al canal especificado con imagen
    if (channelId) {
        const channel = client.channels.cache.get(channelId);
        if (channel) {
            const embed = new EmbedBuilder()
                .setTitle('🤖 Bot Activo')
                .setDescription(`Actualmente en ${client.guilds.cache.size} servidor${client.guilds.cache.size !== 1 ? 'es' : ''}`)
                .setImage('https://i.imgur.com/tuImagen.png') // Reemplaza con tu URL
                .setColor(0x00ff00)
                .setTimestamp()
                .setFooter({ text: `Conectado como ${client.user.tag}`, iconURL: client.user.displayAvatarURL() });

            channel.send({ embeds: [embed] });
        }
    }
}

module.exports = { setPresence };
const { ActivityType, EmbedBuilder } = require('discord.js');

/**
 * Función para establecer la presencia dinámica del bot
 * @param {Client} client - instancia del bot
 * @param {string} [channelId] - opcional, canal donde enviar embed al iniciar
 */
function setPresence(client, channelId) {
    const messages = [
        () => `en ${client.guilds.cache.size} servidor${client.guilds.cache.size !== 1 ? 'es' : ''}`,
        () => 'usa /ping para probarme 🏓',
        () => 'aprendiendo cosas nuevas cada día 😎'
    ];

    // Función para actualizar la presencia
    const updatePresence = () => {
        const index = Math.floor(Math.random() * messages.length);
        const activityMessage = messages[index]();

        client.user.setPresence({
            activities: [
                {
                    name: activityMessage,
                    type: ActivityType.Playing // Cambia a Listening, Watching, Competing si quieres
                }
            ],
            status: 'online'
        });

        console.log(`✅ Presencia actualizada: ${activityMessage}`);
    };

    // Actualizar inmediatamente al iniciar
    updatePresence();

    // Rotar presencia cada 15 segundos
    setInterval(updatePresence, 15000);

    // Opcional: enviar embed al canal especificado con imagen
    if (channelId) {
        const channel = client.channels.cache.get(channelId);
        if (channel) {
            const embed = new EmbedBuilder()
                .setTitle('🤖 Bot Activo')
                .setDescription(`Actualmente en ${client.guilds.cache.size} servidor${client.guilds.cache.size !== 1 ? 'es' : ''}`)
                .setImage('https://i.imgur.com/tuImagen.png') // Reemplaza con tu URL
                .setColor(0x00ff00)
                .setTimestamp()
                .setFooter({ text: `Conectado como ${client.user.tag}`, iconURL: client.user.displayAvatarURL() });

            channel.send({ embeds: [embed] });
        }
    }
}

module.exports = { setPresence };

