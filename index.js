require("dotenv").config();
require("./deploy-commands.js");

const mongoose = require("mongoose");
const { Client, Collection, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");

// ======================
// MONGODB
// ======================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🧠 MongoDB conectado"))
  .catch(err => console.log("Mongo error:", err));

// ======================
// CLIENTE
// ======================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ================================
// 🔥 COMMAND LOADER PRO
// ================================

client.commands = new Collection();
client.categories = new Set();

const commandsPath = path.join(__dirname, "commands");

// leer carpetas
const commandFolders = fs.readdirSync(commandsPath).filter(folder =>
  fs.statSync(path.join(commandsPath, folder)).isDirectory()
);

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith(".js"));

  if (!commandFiles.length) {
    console.log(`⚠️ Carpeta vacía ignorada: ${folder}`);
    continue;
  }

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);

    try {
      const command = require(filePath);

      if (!command?.data?.name) {
        console.log(`⚠️ Ignorado (no slash command): ${folder}/${file}`);
        continue;
      }

      command.category = command.category || folder;
      client.categories.add(command.category);

      client.commands.set(command.data.name, command);
      console.log(`✅ [${folder.toUpperCase()}] ${command.data.name}`);

    } catch (err) {
      console.log(`❌ Error en ${folder}/${file}`);
      console.error(err);
    }
  }
}

client.categories = [...client.categories];
console.log(`📂 Categorías: ${client.categories.join(", ")}`);
console.log(`🤖 Total comandos: ${client.commands.size}`);

// ======================
// COMANDOS
// ======================
client.commands = new Collection();
client.categories = [];

// Cargar carpetas de comandos
const commandFolders = fs.readdirSync("./commands").filter(f =>
  fs.statSync(`./commands/${f}`).isDirectory()
);

for (const folder of commandFolders) {
  const files = fs.readdirSync(`./commands/${folder}`).filter(f => f.endsWith(".js"));

  for (const file of files) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.data.name, command);
  }
}

// Autodetectar categorías
client.categories = [...new Set(client.commands.map(cmd => cmd.category))];

// ======================
// READY
// ======================
client.once("ready", () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
  console.log("📂 Categorías detectadas:", client.categories);
});

// ======================
// ROLES MOD
// ======================
const MOD_ROLES = ["Admin", "Moderator", "Owner"];

// ======================
// INTERACCIONES
// ======================
client.on("interactionCreate", async (interaction) => {

  // ======================
  // HELP MENU SELECT
  // ======================
  if (interaction.isStringSelectMenu() && interaction.customId === "help_menu") {
    const category = interaction.values[0];

    let commands = client.commands.filter(c => c.category === category);

    // 🔐 Filtrar comandos solo mods
    const memberRoles = interaction.member.roles.cache.map(r => r.name);
    const isMod = MOD_ROLES.some(r => memberRoles.includes(r));
    commands = commands.filter(c => !c.modOnly || isMod);

    if (!commands.size) {
      return interaction.update({ content: "❌ No hay comandos en esta categoría.", components: [] });
    }

    // 📄 PAGINACIÓN
    const chunkSize = 5;
    const pages = [];
    const cmdArray = commands.toJSON();

    for (let i = 0; i < cmdArray.length; i += chunkSize) {
      pages.push(cmdArray.slice(i, i + chunkSize));
    }

    let page = 0;

    const buildEmbed = () =>
      new EmbedBuilder()
        .setTitle(`📂 ${category} | Página ${page + 1}/${pages.length}`)
        .setColor("#2f3136")
        .setDescription(
          pages[page].map(c => `**/${c.data.name}** — ${c.data.description}`).join("\n")
        );

    client.helpState = { pages, page, category };

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("help_prev").setLabel("⬅").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("help_next").setLabel("➡").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("help_delete").setEmoji("🗑️").setStyle(ButtonStyle.Danger)
    );

    return interaction.update({ embeds: [buildEmbed()], components: [row] });
  }

  // ======================
  // PAGINA SIGUIENTE
  // ======================
  if (interaction.isButton() && interaction.customId === "help_next") {
    const state = client.helpState;
    if (!state) return;

    state.page = (state.page + 1) % state.pages.length;

    const embed = new EmbedBuilder()
      .setTitle(`📂 ${state.category} | Página ${state.page + 1}/${state.pages.length}`)
      .setColor("#2f3136")
      .setDescription(state.pages[state.page].map(c => `**/${c.data.name}** — ${c.data.description}`).join("\n"));

    return interaction.update({ embeds: [embed] });
  }

  // ======================
  // PAGINA ANTERIOR
  // ======================
  if (interaction.isButton() && interaction.customId === "help_prev") {
    const state = client.helpState;
    if (!state) return;

    state.page = (state.page - 1 + state.pages.length) % state.pages.length;

    const embed = new EmbedBuilder()
      .setTitle(`📂 ${state.category} | Página ${state.page + 1}/${state.pages.length}`)
      .setColor("#2f3136")
      .setDescription(state.pages[state.page].map(c => `**/${c.data.name}** — ${c.data.description}`).join("\n"));

    return interaction.update({ embeds: [embed] });
  }

  // ======================
  // BORRAR HELP
  // ======================
  if (interaction.isButton() && interaction.customId === "help_delete") {
    return interaction.message.delete().catch(() => {});
  }

  // ======================
  // SLASH COMMANDS
  // ======================
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (err) {
    console.error("❌ Error comando:", err);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: "❌ Error ejecutando comando", ephemeral: true });
    }
  }
});

// ======================
// LOGIN
// ======================
client.once("ready", () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

client.login(process.env.TOKEN);

