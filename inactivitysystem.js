const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "activity.json");
const GUILD_ID = "ID_DE_TU_SERVIDOR";
const DIAS_LIMITE = 30;

// Leer JSON
function loadData() {
  if (!fs.existsSync(FILE)) return {};
  return JSON.parse(fs.readFileSync(FILE));
}

// Guardar JSON
function saveData(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

module.exports = (client) => {

  // Guardar actividad cuando alguien habla
  client.on("messageCreate", (msg) => {
    if (!msg.guild || msg.author.bot) return;

    const data = loadData();
    data[msg.author.id] = Date.now();
    saveData(data);
  });

  // Revisar inactivos cada 24h
  setInterval(async () => {
    const guild = await client.guilds.fetch(GUILD_ID);
    if (!guild) return;

    const data = loadData();
    const limite = Date.now() - DIAS_LIMITE * 24 * 60 * 60 * 1000;

    const members = await guild.members.fetch();

    for (const member of members.values()) {
      if (
        member.user.bot ||
        member.permissions.has("Administrator") ||
        member.id === guild.ownerId
      ) continue;

      const lastMsg = data[member.id];

      if (!lastMsg || lastMsg < limite) {
        try {
          await member.kick("Inactivo por más de 30 días");
          console.log(`🦵 Kick: ${member.user.tag}`);
        } catch (e) {
          console.log(`❌ No se pudo kickear: ${member.user.tag}`);
        }
      }
    }
  }, 24 * 60 * 60 * 1000); // cada 24h
};
