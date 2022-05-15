const { MessageEmbed } = require('discord.js');
const sqlite3 = require('sqlite3');
module.exports = {
	haveSubParent: true,
	name: 'membre',
	async execute(interaction) {
		const membre = interaction.options.getUser('membre');
		let id;
		let name;
		let avatarURL;
		if (membre !== null) {
			id = membre.id;
			avatarURL = membre.displayAvatarURL(false);
			name = membre.username;
		}
		else {
			id = interaction.member.id;
			avatarURL = interaction.member.displayAvatarURL(false);
			name = interaction.member.displayName;
		}
		const db = new sqlite3.Database('userData');

		let xp;
		let level;
		let rank = 1;
		db.each('SELECT * FROM level WHERE userId = ?', {
			1: id,
		}, async (err, row) => {
			xp = row.xp;
			level = row.level;
		});
		await new Promise(resolve => setTimeout(resolve, 1000));
		db.each('SELECT * FROM level WHERE xp > ?', {
			1: xp,
		}, async () => {
			rank++;
		});
		await new Promise(resolve => setTimeout(resolve, 1000));

		const embed = new MessageEmbed()
			.setTitle('Niveau du membre: ' + name)
			.setColor('RANDOM')
			.setThumbnail(avatarURL)
			.addFields(
				{ name: '\u200B', value: `Voiçi les informations sur ${name}.` },
				{ name: 'XP', value: `${xp}`, inline: true },
				{ name: 'Niveau', value: `${level}`, inline: true },
				{ name: 'Classement', value: `${rank}`, inline: true },
			);
		await interaction.editReply({ embeds: [embed] });
	},
};