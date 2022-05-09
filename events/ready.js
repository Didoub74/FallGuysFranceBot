const sqlite3 = require('sqlite3').verbose();
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { welcomeChannelId } = require('../config.json');
module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		/* const rulesEmbed = new MessageEmbed()
			.setTitle('Règlement')
			.setColor('#BB0B0B')
			.setThumbnail('https://pic.onlinewebfonts.com/svg/img_365.png')
			.setDescription('I – Comportement\n' +
				'     -Restez courtois, poli. Vous pouvez être familier, nous ne vous demandons pas d’écrire comme Molière, nous ne sommes pas à L’Élysée\n' +
				'\n' +
				'     -Pas de violence verbale gratuite. Vous pouvez taquiner gentiment sans aller dans l’extrême. Si cela reste dans la bonne humeur et le second degré nous le tolérons. Si le staff ou moi même estimons que cela ne respecte plus la règle, vous risquez un kick ou un ban en fonction de l’humeur de la personne qui s\'occupe de votre cas.\n' +
				'\n' +
				'II – Chat écrit/ vocal\n' +

				'     -Pas de spam, sous peine de bannissement.\n' +
				'\n' +
				'     -Pas de pub sur les différents chats, sous peine d’avertissement puis ban si l’avertissement n’est pas pris en compte.\n' +
				'\n' +

				'III – Profil/Pseudo\n' +

				'     - Ne doit pas être ressemblant/confondu avec celui d’un membre du staff, sous peine d’avertissement puis ban si l’avertissement n’est pas pris en compte.\n' +
				'\n' +
				'     - Ne doit pas contenir de propos racistes, homophobes, sexistes … (genre la photo de profil Hitler on s’en passera) sous peine d’avertissement puis ban si l’avertissement n’est pas pris en compte.\n' +
				'\n' +
				'     -Ne doit pas avoir de caractère pornographique, sous peine d’avertissement puis ban si l’avertissement n’est pas pris en compte.\n' +
				'\n')
			.setImage('https://i.imgur.com/i5Yzi53.jpeg');
		const channel = client.channels.cache.get('968058216338567168');
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('read')
					.setLabel('Règlement lu')
					.setStyle('PRIMARY'),
			);
		channel.send({ embeds: [rulesEmbed], components: [row] });

		const channel = client.channels.cache.get('968058219454955580');

		const chooseRoleEmbed1 = new MessageEmbed()
			.setColor('#177900')
			.setImage('https://www.gamereactor.fr/media/58/fallguyshas_3595863_1200x675.png');
		const chooseRoleEmbed2 = new MessageEmbed()
			.setColor('#177900')
			.setDescription('Quel est votre âge');
		const button1 = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('-18')
					.setLabel('-18 ans')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('+18')
					.setLabel('+18 ans')
					.setStyle('PRIMARY'),
			);
		channel.send({ embeds: [chooseRoleEmbed1, chooseRoleEmbed2], components: [button1] });
		const chooseRoleEmbed3 = new MessageEmbed()
			.setColor('#177900')
			.setDescription('Quel est votre plateforme ?');
		const button2 = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('pc')
					.setLabel('PC')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('ps4')
					.setLabel('PS4')
					.setStyle('PRIMARY'),
			);
		channel.send({ embeds: [chooseRoleEmbed3], components: [button2] });
		const chooseRoleEmbed4 = new MessageEmbed()
			.setColor('#177900')
			.setDescription('Quel est votre sexe ?');
		const button3 = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('men')
					.setLabel('Homme')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('women')
					.setLabel('Femme')
					.setStyle('PRIMARY'),
			);
		channel.send({ embeds: [chooseRoleEmbed4], components: [button3] });

		const channelEmbed = new MessageEmbed()
			.setTitle('Gestion des salons temporaires')
			.setColor('YELLOW')
			.setDescription('Si vous êtes le chef du salon vous pouvez appuyer sur le bouton ci-dessous pour générer le panneau de gestion de votre salon vocal.')
			.setFooter({ text: 'Fall Guys France', iconURL: client.user.avatarURL() });

		const channel = client.channels.cache.get('968058354582847518');

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('manage')
					.setLabel('Gestion du salon')
					.setStyle('SECONDARY'),
			);

		channel.send({ embeds: [channelEmbed], components: [row] }); */
	},
};