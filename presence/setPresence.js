const { ActivityType } = require('discord.js');

/**
 * Función para establecer la presencia del bot
 * @param {Client} client - instancia del bot
 */
function setPresence(client) {
    // Construimos el mensaje de actividad
    const serverCount = client.guilds.cache.size; // número de servidores
    const activityMessage = `en ${serverCount} servidor${serverCount !== 1 ? 'es' : ''}`;

    client.user.setPresence({
        activities: [
            {
                name: activityMessage,        // mensaje dinámico
                type: ActivityType.Playing,   // 0 = Jugando
            }
        ],
        status: 'online' // online, idle, dnd, invisible
    });

    console.log(`✅ Presencia del bot establecida: ${activityMessage}`);
}

module.exports = { setPresence };
