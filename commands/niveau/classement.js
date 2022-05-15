const { MessageEmbed } = require('discord.js');
const sqlite3 = require('sqlite3');
module.exports = {
	haveSubParent: true,
	name: 'membre',
	async execute(interaction) {
		const db = new sqlite3.Database('userData');

		const top = [];
		db.each('SELECT * FROM level ORDER BY xp DESC LIMIT 10', async (err, row) => {
			top.push(row.userId);
		});
		await new Promise(resolve => setTimeout(resolve, 100));
		const embed = new MessageEmbed()
			.setTitle('Classement des membres les plus actifs du serveur.')
			.setColor('RANDOM')
			.setThumbnail(interaction.guild.iconURL());
		let rank = 0;
		let name;
		let xp;
		for (const userId of top) {
			rank = rank + 1;
			interaction.guild.members.fetch(userId).then((user) => {
				name = user.user.username;
			});
			db.each('SELECT xp, level FROM level WHERE userId = ?', [userId], async (err, row) => {
				xp = row.xp;
				console.log(row);
			});
			await new Promise(resolve => setTimeout(resolve, 100));
			embed.addFields(
				{ name: 'Rangs', value: `N°${rank}`, inline: true },
				{ name: 'Pseudo', value: `${name}`, inline: true },
				{ name: 'XP', value: `${xp}`, inline: true },
			);
		}
		await interaction.editReply({ embeds: [embed] });
	},
};