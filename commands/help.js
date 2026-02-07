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
    .setDescription("Te muestra el menú de ayuda con mis comandos"),

  async execute(interaction) {
    // 📂 Contar categorías y comandos
    const commandsPath = path.join(__dirname);
    const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

    const totalCommands = files.length;
    const totalCategories = 4; // cambia si tienes más

    // 📖 Embed principal
    const embed = new EmbedBuilder()
      .setTitle("📖 | Menú de ayuda")
      .setColor("#2f3136")
      .setDescription(`Tengo **${totalCategories} categorías** y **${totalCommands} comandos** disponibles.\n\nSelecciona una categoria abajo y según la categoria se mostraran comandos relacionados y sus descripciones.\n\n🎊 | **Entretenimiento**\n🔩 | **Moderación**\n🔎 | **Utilidad**\n🎵 | **Música**`)
      .setImage("https://i.pinimg.com/736x/6e/42/b0/6e42b0b441db7ff53d8ac0595f03a223.jpg")
      .setFooter({ text: "Zeph • desarrollada por ♱ - Parra" })
      .setTimestamp();

    // 📂 Select Menu
    const menu = new StringSelectMenuBuilder()
      .setCustomId("help_menu")
      .setPlaceholder("Selecciona una categoría")
      .addOptions([
        {
          label: "🎊 Entretenimiento",
          description: "Comandos divertidos",
          value: "fun",
        },
        {
          label: "🔩 Moderación",
          description: "Comandos de staff",
          value: "mod",
        },
        {
          label: "🔎 Utilidad",
          description: "Comandos útiles",
          value: "utils",
        },
        {
          label: "🎵 Música",
          description: "Comandos musicales",
          value: "music",
        },
      ]);

    // 🔴 Botón rojo para eliminar
    const deleteButton = new ButtonBuilder()
      .setCustomId("delete_help_msg")
      .setStyle(ButtonStyle.Danger)
      .setEmoji("❌");

    // Crear dos ActionRows (uno para el menú, otro para el botón)
    const menuRow = new ActionRowBuilder().addComponents(menu);
    const buttonRow = new ActionRowBuilder().addComponents(deleteButton);

    await interaction.reply({ 
      embeds: [embed], 
      components: [menuRow, buttonRow] 
    });
  }
};
