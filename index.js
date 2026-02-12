require("dotenv").config();

const {
  Client,
  Collection,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// ======================
// MONGO
// ======================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🧠 MongoDB conectado"))
  .catch(e => console.log("Mongo error:", e));

// ======================
// CLIENTE
// ======================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ======================
// LOADER
// ======================
client.commands = new Collection();
client.categories = new Set();

const commandsPath = path.join(__dirname, "commands");

for (const folder of fs.readdirSync(commandsPath)) {
  const folderPath = path.join(commandsPath, folder);
  if (!fs.statSync(folderPath).isDirectory()) continue;

  const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".js"));
  if (!files.length) continue;

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    try {
      const command = require(filePath);
      if (!command?.data?.name) continue;

      command.category = folder;
      client.categories.add(folder);

      client.commands.set(command.data.name, command);
      console.log(`✅ ${folder}/${command.data.name}`);
    } catch (e) {
      console.log(`❌ ${folder}/${file}`);
      console.error(e);
    }
  }
}

console.log("📂 Categorías:", [...client.categories]);
console.log("🤖 Comandos:", client.commands.size);

// ======================
// READY
// ======================
client.once("ready", () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

// ======================
// ROLES MOD
// ======================
const MOD_ROLES = ["Admin", "Moderator", "Owner"];

// ======================
// INTERACCIONES
// ======================
client.on("interactionCreate", async interaction => {

  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (e) {
    console.error(e);
    if (!interaction.replied) {
      interaction.reply({ content: "❌ Error", ephemeral: true });
    }
  }
});

client.login(process.env.TOKEN);
