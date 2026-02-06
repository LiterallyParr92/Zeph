const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [53608447]
});

client.once("ready", () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

client.login(process.env.TOKEN);
