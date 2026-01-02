const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  Routes,
  REST,
  EmbedBuilder
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// ====== CONFIG ======
const TOKEN = process.env.TOKEN; // put token in env
const CLIENT_ID = "1381506626388754432";
const GUILD_ID = "1449760032941146134";
const CITIZEN_ROLE_ID = "1456271995518845100";
// ====================

// Slash commands
const commands = [
  new SlashCommandBuilder()
    .setName("appoint")
    .setDescription("Appoint a staff member")
    .addUserOption(opt =>
      opt.setName("user").setDescription("User").setRequired(true))
    .addStringOption(opt =>
      opt.setName("post").setDescription("Post").setRequired(true)),

  new SlashCommandBuilder()
    .setName("demote")
    .setDescription("Demote a staff member")
    .addUserOption(opt =>
      opt.setName("user").setDescription("User").setRequired(true))
    .addStringOption(opt =>
      opt.setName("old").setDescription("Old post").setRequired(true))
    .addStringOption(opt =>
      opt.setName("new").setDescription("New post").setRequired(true)),

  new SlashCommandBuilder()
    .setName("fire")
    .setDescription("Remove a staff member")
    .addUserOption(opt =>
      opt.setName("user").setDescription("User").setRequired(true))
    .addStringOption(opt =>
      opt.setName("post").setDescription("Post").setRequired(true))
].map(cmd => cmd.toJSON());

// Register commands
const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log("✅ Slash commands registered");
  } catch (err) {
    console.error(err);
  }
})();

// Bot ready
client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

// Interaction handler
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const user = interaction.options.getUser("user");

  // 🔥 FIRE
  if (interaction.commandName === "fire") {
    const post = interaction.options.getString("post");

    const embed = new EmbedBuilder()
      .setTitle("🔥 Staff Update")
      .setColor(0xFF0000)
      .setDescription(`**${user.tag}** has been removed from the position of **${post}** with immediate effect.`)
      .setFooter({ text: "Management" })
      .setTimestamp();

    return interaction.reply({
      content: `<@&${CITIZEN_ROLE_ID}>`,
      embeds: [embed]
    });
  }

  // ⬇️ DEMOTE
  if (interaction.commandName === "demote") {
    const oldPost = interaction.options.getString("old");
    const newPost = interaction.options.getString("new");

    const embed = new EmbedBuilder()
      .setTitle("⬇️ Staff Update")
      .setColor(0xFFA500)
      .setDescription(`**${user.tag}** has been demoted from **${oldPost}** to **${newPost}** with immediate effect.`)
      .setFooter({ text: "Administration" })
      .setTimestamp();

    return interaction.reply({
      content: `<@&${CITIZEN_ROLE_ID}>`,
      embeds: [embed]
    });
  }

  // ✅ APPOINT
  if (interaction.commandName === "appoint") {
    const post = interaction.options.getString("post");

    const embed = new EmbedBuilder()
      .setTitle("📢 Staff Appointment")
      .setColor(0x00FF7F)
      .setDescription(`**${user.tag}** has been appointed as **${post}**.`)
      .setFooter({ text: "Management" })
      .setTimestamp();

    return interaction.reply({
      content: `<@&${CITIZEN_ROLE_ID}>`,
      embeds: [embed]
    });
  }
});

client.login(TOKEN);
