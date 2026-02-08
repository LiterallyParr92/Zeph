const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  Collection
} = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("💡| Abre el menú de ayuda"),

  async execute(interaction) {
    // 📂 Contar categorías y comandos
    const commandsPath = path.join(__dirname);
    const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

    const totalCommands = files.length;
    const totalCategories = 4;

    // 📖 Embed principal
    const embed = new EmbedBuilder()
      .setTitle("📖 | Menú de ayuda")
      .setColor("#2f3136")
      .setDescription(`Tengo **${totalCategories} categorías** y **${totalCommands} comandos** disponibles.\n\nSelecciona una categoria abajo y según la categoria se mostraran comandos relacionados y sus descripciones.\n\n🎊 | **Entretenimiento**\ncomandos de entretenimiento\n🔩 | **Moderación**\ncomandos de moderación\n🔎 | **Utilidad**\ncomandos útiles\n🎵 | **Música**\ncomandos musicales`)
      .setTimestamp()
      .setFooter({ text: "Zeph • desarrollada por ♱ - Parra" });
    

    // 📂 Select Menu
    const menu = new StringSelectMenuBuilder()
      .setCustomId("help_menu")
      .setPlaceholder("Selecciona una categoría")
      .addOptions([
        {
          label: "🎊 Entretenimiento",
          description: "Comandos de entretenimiento",
          value: "fun",
        },
        {
          label: "🔩 Moderación",
          description: "Comandos de moderación",
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
      .setEmoji("🗑️");

    // Crear dos ActionRows (uno para el menú, otro para el botón)
    const menuRow = new ActionRowBuilder().addComponents(menu);
    const buttonRow = new ActionRowBuilder().addComponents(deleteButton);

    await interaction.reply({ 
      embeds: [embed], 
      components: [menuRow, buttonRow] 
    });
  }
};

// Manejar la interacción del menú desplegable
module.exports.handleMenuInteraction = async (interaction) => {
  if (!interaction.isStringSelectMenu() || interaction.customId !== "help_menu") return;

  const selectedCategory = interaction.values[0];
  
  // Definir las rutas de las carpetas de comandos
  const basePath = path.join(__dirname, '..'); // Ajustar ruta según estructura de carpetas
  const categoryPath = path.join(basePath, selectedCategory);
  
  // Mapear nombres de categorías para mostrar
  const categoryNames = {
    "fun": "🎊 Entretenimiento",
    "mod": "🔩 Moderación", 
    "utils": "🔎 Utilidad",
    "music": "🎵 Música"
  };
  
  const categoryColors = {
    "fun": "#FF69B4", // Rosa
    "mod": "#FF0000", // Rojo
    "utils": "#00FF00", // Verde
    "music": "#9B59B6" // Púrpura
  };
  
  // Obtener los archivos de comandos de la categoría seleccionada
  let commandFiles = [];
  let commandsInfo = "";
  
  try {
    commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));
    
    // Leer cada comando para obtener su información
    for (const file of commandFiles) {
      try {
        const commandPath = path.join(categoryPath, file);
        const command = require(commandPath);
        
        // Extraer nombre y descripción del comando
        const commandName = command.data?.name || file.replace('.js', '');
        const commandDescription = command.data?.description || "Sin descripción disponible";
        
        commandsInfo += `**/${commandName}** - ${commandDescription}\n`;
      } catch (error) {
        console.error(`Error al leer el comando ${file}:`, error);
        commandsInfo += `**${file.replace('.js', '')}** - Error al cargar el comando\n`;
      }
    }
  } catch (error) {
    console.error(`Error al leer la carpeta ${categoryPath}:`, error);
    commandsInfo = "❌ No se pudieron cargar los comandos de esta categoría.";
  }
  
  // Crear embed para la categoría seleccionada
  const categoryEmbed = new EmbedBuilder()
    .setTitle(`${categoryNames[selectedCategory] || selectedCategory} | Comandos`)
    .setColor(categoryColors[selectedCategory] || "#2f3136")
    .setDescription(commandsInfo || "No hay comandos en esta categoría.")
    .setFooter({ text: `${commandFiles.length} comandos disponibles` })
    .setTimestamp();
  
  // Crear botón para volver al menú principal
  const backButton = new ButtonBuilder()
    .setCustomId("help_back")
    .setLabel("Volver al menú principal")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("⬅️");
  
  const backRow = new ActionRowBuilder().addComponents(backButton);
  
  await interaction.update({ 
    embeds: [categoryEmbed], 
    components: [backRow] 
  });
};

// Manejar el botón de volver
module.exports.handleBackButton = async (interaction) => {
  if (!interaction.isButton() || interaction.customId !== "help_back") return;

  // Volver a mostrar el menú principal (podrías recargar el comando original aquí)
  const embed = new EmbedBuilder()
    .setTitle("📖 | Menú de ayuda")
    .setColor("#2f3136")
    .setDescription("Selecciona una categoría para ver sus comandos.\n\n🎊 | **Entretenimiento**\ncomandos de entretenimiento\n🔩 | **Moderación**\ncomandos de moderación\n🔎 | **Utilidad**\ncomandos útiles\n🎵 | **Música**\ncomandos musicales")
    .setTimestamp()
    .setFooter({ text: "Zeph • desarrollada por ♱ - Parra" });
  
  const menu = new StringSelectMenuBuilder()
    .setCustomId("help_menu")
    .setPlaceholder("Selecciona una categoría")
    .addOptions([
      {
        label: "🎊 Entretenimiento",
        description: "Comandos de entretenimiento",
        value: "fun",
      },
      {
        label: "🔩 Moderación",
        description: "Comandos de moderación",
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
  
  const deleteButton = new ButtonBuilder()
    .setCustomId("delete_help_msg")
    .setStyle(ButtonStyle.Danger)
    .setEmoji("🗑️");
  
  const menuRow = new ActionRowBuilder().addComponents(menu);
  const buttonRow = new ActionRowBuilder().addComponents(deleteButton);
  
  await interaction.update({ 
    embeds: [embed], 
    components: [menuRow, buttonRow] 
  });
};

// Manejar el botón de eliminar
module.exports.handleDeleteButton = async (interaction) => {
  if (!interaction.isButton() || interaction.customId !== "delete_help_msg") return;
  
  await interaction.message.delete();
};
