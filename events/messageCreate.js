const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
module.exports = {
	name: 'messageCreate',
	async execute(message) {
		const db = new sqlite3.Database('userData');
		if (!message.author.bot) {
			const rand = Math.round(Math.random() * 10);

			let xp;
			let level;
			db.each('SELECT * FROM level WHERE userId = ?', {
				1: message.author.id,
			}, async (err, row) => {
				xp = row.xp;
				level = row.level;
			});
			await new Promise(resolve => setTimeout(resolve, 1000));
			xp += rand;

			const firstLevelXP = 100;
			let nextLevelRequiredXP;
			// calcul for xp required
			for (let i = 0; i < level; i++) {
				nextLevelRequiredXP = firstLevelXP + firstLevelXP * i + 10 * i;
			}
			if (xp > nextLevelRequiredXP) {
				level++;
				const embed = new Discord.MessageEmbed()
					.setTitle('Nouveau niveau !')
					.setDescription('Bravo, tu es désormais au niveau ' + level + '. Félicitations !')
					.setColor('#ff6100')
					.setImage('https://www.fun-academy.fr/wp-content/uploads/2020/08/Fall-Guys-toutes-les-manches-et-comment-gagner-chaque-type.jpg');
				message.reply({ embeds: [embed] });
			}
			db.run('UPDATE level SET xp = ?, level = ? WHERE userId = ?', [ xp, level, message.author.id ]);
			// console.log('Updated xp for ' + message.author.id + '. Now you have ' + xp + 'xp.');
		}
		else {
			// console.log('Bot message.');
		}
	},
};