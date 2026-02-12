require('./deploy-commands.js');
const mongoose = require("mongoose");
const { Client, Collection } = require("discord.js");
const fs = require("fs");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🧠 MongoDB conectado"))
  .catch(err => console.log("Mongo error:", err));

const client = new Client({ intents: [53608447] });

client.commands = new Collection();

// 🔥 Cargar comandos con carpetas
const folders = fs.readdirSync("./commands");
for (const folder of folders) {
  const files = fs.readdirSync(`./commands/${folder}`).filter(f => f.endsWith(".js"));
  for (const file of files) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.data.name, command);
  }
}

const helpCommand = require("./commands/help.js");

// READY
client.once("ready", () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

// INTERACCIONES
client.on("interactionCreate", async (interaction) => {

  if (interaction.isStringSelectMenu() && interaction.customId === "help_menu") {
    return helpCommand.handleMenuInteraction(interaction);
  }

  if (interaction.isButton() && interaction.customId === "help_back") {
    return helpCommand.handleBackButton(interaction);
  }

  if (interaction.isButton() && interaction.customId === "delete_help_msg") {
    return helpCommand.handleDeleteButton(interaction);
  }

  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (err) {
    console.error(err);
    if (!interaction.replied) {
      interaction.reply({ content: "❌ Error ejecutando comando", ephemeral: true });
    }
  }
});

client.login(process.env.TOKEN);
