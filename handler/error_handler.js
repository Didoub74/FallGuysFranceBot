const Discord = require('discord.js');
const { ownerId, serverId } = require('../config.json');
const client = require('../index');
const fs = require('fs');

module.exports = () => {

	process.on('unhandledRejection1', (reason, p) => {
		console.log('[Anti-crash] -> Une erreur est survenue lors de l\'exécution du bot. Regarder le message envoyé par le bot pour plus d\'information.');
		const embed = new Discord.MessageEmbed()
			.setColor('RED')
			.setTitle('Erreur survenue lors de l\'exécution du bot')
			.setDescription('**Une erreur est survenue lors de l\'exécution du bot!**\n\nERREUR:\n\n```' + reason + '\n\n' + p + '``')
			.setTimestamp()
			.setFooter({ text: 'Système anti-crash' });
		console.log(reason + '\n\n' + p);
		client.guilds.fetch(serverId).then(guild => {
			guild.members.fetch(ownerId).then(user => {
				user.send({ embeds: [embed] });
			});
		});

		const timeElapsed = Date.now();
		const today = new Date(timeElapsed);
		fs.appendFile(`logs/${today.toISOString()}`, `Erreur du bot\n\nDate: ${today.toUTCString()}\n\n` + reason + '\n\n' + p, function(err) {
			if (err) throw err;
			console.log('Fichier créé !');
		});

	});
	process.on('uncaughtException1', (reason, p) => {

		console.log('[Anti-crash] -> Une erreur est survenue lors de l\'exécution du bot. Regarder le message envoyé par le bot pour plus d\'information.');
		const embed = new Discord.MessageEmbed()
			.setColor('RED')
			.setTitle('Erreur survenue lors de l\'exécution du bot')
			.setDescription('**Une erreur est survenue lors de l\'exécution du bot!**\n\nERREUR:\n\n```' + reason + '\n\n' + p + '``')
			.setTimestamp()
			.setFooter({ text: 'Système anti-crash' });
		console.log(reason + '\n\n' + p);
		client.guilds.fetch(serverId).then(guild => {
			guild.members.fetch(ownerId).then(user => {
				user.send({ embeds: [embed] });
			});
		});

		const timeElapsed = Date.now();
		const today = new Date(timeElapsed);
		fs.appendFile(`logs/${today.toISOString()}`, `Erreur du bot\n\nDate: ${today.toUTCString()}\n\n` + reason + '\n\n' + p, function(err) {
			if (err) throw err;
			console.log('Fichier créé !');
		});

	});
	process.on('uncaughtExceptionMonitor1', (reason, p) => {

		console.log('[Anti-crash] -> Une erreur est survenue lors de l\'exécution du bot. Regarder le message envoyé par le bot pour plus d\'information.');
		const embed = new Discord.MessageEmbed()
			.setColor('RED')
			.setTitle('Erreur survenue lors de l\'exécution du bot')
			.setDescription('**Une erreur est survenue lors de l\'exécution du bot!**\n\nERREUR:\n\n```' + reason + '\n\n' + p + '``')
			.setTimestamp()
			.setFooter({ text: 'Système anti-crash' });
		console.log(reason + '\n\n' + p);
		client.guilds.fetch(serverId).then(guild => {
			guild.members.fetch(ownerId).then(user => {
				user.send({ embeds: [embed] });
			});
		});

		const timeElapsed = Date.now();
		const today = new Date(timeElapsed);
		fs.appendFile(`logs/${today.toISOString()}`, `Erreur du bot\n\nDate: ${today.toUTCString()}\n\n` + reason + '\n\n' + p, function(err) {
			if (err) throw err;
			console.log('Fichier créé !');
		});

	});
	process.on('multipleResolves1', (reason, p) => {

		console.log('[Anti-crash] -> Une erreur est survenue lors de l\'exécution du bot. Regarder le message envoyé par le bot pour plus d\'information.');
		const embed = new Discord.MessageEmbed()
			.setColor('RED')
			.setTitle('Erreur survenue lors de l\'exécution du bot')
			.setDescription('**Une erreur est survenue lors de l\'exécution du bot!**\n\nERREUR:\n\n```' + reason + '\n\n' + p + '``')
			.setTimestamp()
			.setFooter({ text: 'Système anti-crash' });
		console.log(reason + '\n\n' + p);
		client.guilds.fetch(serverId).then(guild => {
			guild.members.fetch(ownerId).then(user => {
				user.send({ embeds: [embed] });
			});
		});

	});

};
