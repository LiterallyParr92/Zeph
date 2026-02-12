const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("📖 Menú de ayuda"),

  async execute(interaction) {
    const commandsPath = path.join(__dirname);
    const folders = fs.readdirSync(commandsPath).filter(f =>
      fs.statSync(path.join(commandsPath, f)).isDirectory()
    );

    if (!folders.length) return interaction.reply("No hay categorías.");

    // Crear opciones del menú
    const options = folders.map(folder => ({
      label: folder.toUpperCase(),
      description: `Comandos de ${folder}`,
      value: folder
    }));

    const menu = new StringSelectMenuBuilder()
      .setCustomId("help_menu")
      .setPlaceholder("Selecciona una categoría")
      .addOptions(options);

    const embed = new EmbedBuilder()
      .setTitle("📖 Menú de Ayuda")
      .setColor("#2f3136")
      .setDescription(`Selecciona una categoría abajo.\n\n📂 Categorías detectadas: **${folders.length}**`)
      .setFooter({ text: "Zeph • Help System" });

    await interaction.reply({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(menu)]
    });
  }
};

// =====================
// MENU HANDLER
// =====================
module.exports.handleMenu = async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  if (interaction.customId !== "help_menu") return;

  const category = interaction.values[0];
  const categoryPath = path.join(__dirname, category);

  const files = fs.readdirSync(categoryPath).filter(f => f.endsWith(".js"));
  if (!files.length)
    return interaction.update({ content: "❌ No hay comandos aquí.", components: [] });

  const commands = [];

  for (const file of files) {
    const cmd = require(path.join(categoryPath, file));
    if (cmd?.data?.name) {
      commands.push(cmd);
    }
  }

  // PAGINACIÓN
  const chunk = 5;
  const pages = [];
  for (let i = 0; i < commands.length; i += chunk)
    pages.push(commands.slice(i, i + chunk));

  let page = 0;

  const buildEmbed = () =>
    new EmbedBuilder()
      .setTitle(`📂 ${category} | Página ${page + 1}/${pages.length}`)
      .setColor("#2f3136")
      .setDescription(
        pages[page].map(c => `**/${c.data.name}** — ${c.data.description}`).join("\n")
      );

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("help_prev").setEmoji("⬅️").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("help_next").setEmoji("➡️").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("help_delete").setEmoji("🗑️").setStyle(ButtonStyle.Danger)
  );

  // Guardar estado en memoria
  interaction.client.helpState = { pages, page, category };

  await interaction.update({ embeds: [buildEmbed()], components: [row] });
};

// =====================
// BUTTONS HANDLER
// =====================
module.exports.handleButtons = async (interaction) => {
  const state = interaction.client.helpState;
  if (!state) return;

  if (interaction.customId === "help_next") {
    state.page = (state.page + 1) % state.pages.length;
  }

  if (interaction.customId === "help_prev") {
    state.page = (state.page - 1 + state.pages.length) % state.pages.length;
  }

  if (interaction.customId === "help_delete") {
    return interaction.message.delete().catch(() => {});
  }

  const embed = new EmbedBuilder()
    .setTitle(`📂 ${state.category} | Página ${state.page + 1}/${state.pages.length}`)
    .setColor("#2f3136")
    .setDescription(
      state.pages[state.page].map(c => `**/${c.data.name}** — ${c.data.description}`).join("\n")
    );

  await interaction.update({ embeds: [embed] });
};
