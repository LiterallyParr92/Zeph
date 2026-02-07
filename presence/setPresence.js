const { ActivityType } = require('discord.js');

/**
 * Función para establecer la presencia del bot
 * @param {Client} client - instancia del bot
 */
function setPresence(client) {
    client.user.setPresence({
        activities: [
            {
                name: "tu servidor de Discord", // mensaje de actividad
                type: ActivityType.Playing,    // Jugando
            }
        ],
        status: 'online' // estados posibles: 'online', 'idle', 'dnd', 'invisible'
    });

    console.log(`✅ Presencia del bot establecida.`);
}

module.exports = { setPresence };
