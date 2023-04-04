const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');

const handleCommand = require('./helpers/command');
const handleSelectMenu = require('./helpers/select-menu');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log('Je suis prêt !');
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) handleCommand(client, interaction);
    if (interaction.isMessageComponent() && interaction.customId === 'ticket_button') {
      // Créer un message intégré pour le ticket
      const ticketEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Ticket de ${interaction.user.tag}`)
        .setDescription('Veuillez expliquer votre demande ici.');

      // Envoyer le message intégré dans le canal actuel
      interaction.channel.send(ticketEmbed)
        .then(msg => {
          // Ajouter une réaction pour fermer le ticket
          msg.react('🔒');
        })
        .catch(error => {
          console.error(error);
          interaction.reply('Une erreur est survenue lors de la création du ticket.');
        });
    }
});

client.login(token);