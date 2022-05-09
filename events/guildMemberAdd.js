const Discord = require('discord.js');
const { welcomeChannelId } = require('../config.json');

const sqlite3 = require('sqlite3').verbose();
module.exports = {
	name: 'guildMemberAdd',
	async execute(guildMember) {
		const db = new sqlite3.Database('userData');
		const embed = new Discord.MessageEmbed()
			.setTitle('Nouveau membre !')
			.setColor('#BB0B0B')
			.setThumbnail(guildMember.displayAvatarURL())
			.setDescription('Bienvenue sur ' + guildMember.guild.name + ' ' + guildMember.displayName + '! Tu es le ' + guildMember.guild.memberCount + 'ème membre !')
			.setImage('https://i.imgur.com/i5Yzi53.jpeg');
		const channel = guildMember.client.channels.cache.get(welcomeChannelId);
		channel.send({ embeds: [embed] });

		let exist = false;
		await db.each('SELECT * FROM level WHERE userId = ?', [ guildMember.id ], () => {
			// console.log('Membre existant');
			exist = true;
		});
		await new Promise(resolve => setTimeout(resolve, 1000));
		if (!exist) {
			await db.run('INSERT INTO level VALUES (?, ?, ?)', {
				1: guildMember.id,
				2: 0,
				3: 1,
			});
			console.log('Membre ajouté à la BDD');
		}
		else {
			// console.log('Membre déjà dans la BDD.');
		}
		db.close();
	},
};