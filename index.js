require('./deploy-commands.js'); // Asegura que los comandos se desplieguen antes de iniciar el bot
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🧠 MongoDB conectado"))
  .catch(err => console.log("Mongo error:", err));
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const { setPresence } = require("./presence/setPresence");
const inactivitySystem = require("./inactivitysystem"); // ⚠️ respeta mayúsculas

// ======================
// CREAR CLIENTE
// ======================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers, // necesario para kick
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ======================
// CARGAR COMANDOS
// ======================
client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// ======================
// EVENTO READY
// ======================
client.once("ready", () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);

  // Presencia dinámica
  setPresence(client, "TU_CANAL_ID");

  // Sistema de inactividad
  inactivitySystem(client);
});

// ======================
// INTERACCIONES
// ======================

// En tu index.js o archivo principal
client.on('interactionCreate', async (interaction) => {
  // Manejar menú desplegable de help
  if (interaction.isStringSelectMenu() && interaction.customId === 'help_menu') {
    const helpCommand = require('./commands/help.js'); // Ajusta la ruta
    return helpCommand.handleMenuInteraction(interaction);
  }
  
  // Manejar botón de volver
  if (interaction.isButton() && interaction.customId === 'help_back') {
    const helpCommand = require('./commands/help.js'); // Ajusta la ruta
    return helpCommand.handleBackButton(interaction);
  }
  
  // Manejar botón de eliminar
  if (interaction.isButton() && interaction.customId === 'delete_help_msg') {
    const helpCommand = require('./commands/help.js'); // Ajusta la ruta
    return helpCommand.handleDeleteButton(interaction);
  }
  
  if (interaction.isButton() && interaction.customId === 'delete_help_msg') {
    await interaction.message.delete().catch(() => {});
  }
  
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error("❌ Error al ejecutar comando:", error);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "❌ Error al ejecutar el comando",
        ephemeral: true
      });
    }
  }
});

// ======================
// LOGIN SEGURO
// ======================
if (!process.env.TOKEN) {
  console.error("❌ ERROR: No se encontró el token.");
  process.exit(1);
}

client.login(process.env.TOKEN);


