// Require the necessary discord.js classes
const Discord = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');

// Create a new client instance
const client = new Discord.Client({
	intents: 32767,
});
module.exports = client;

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
		console.log('Event loaded: ' + event.name);
	}
}

['error_handler'].forEach(handler => {
	require(`./handler/${handler}`)(client, Discord)
});

client.login(token);