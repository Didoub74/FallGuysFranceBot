const player = require('../../client/player');
module.exports = {
	haveSubParent: true,
	name: 'actuelle',
	async execute(interaction) {
		const queue = player.getQueue(interaction.guildId);
		if (!queue?.playing) {
			await interaction.editReply({
				content: 'Pas de musique est en cours de lecture.',
			});
		}

		const progress = queue.createProgressBar();
		const per = queue.getPlayerTimestamp();

		await interaction.editReply({
			content: '',
			embeds: [
				{
					title: 'Chanson actuelle',
					description: `🎶 | **${queue.current.title}**! (\`${per.progress}%\`)`,
					fields: [
						{
							name: '\u200b',
							value: progress,
						},
					],
					color: '#BB0B0B',
					footer: {
						text: `Demandée par ${queue.current.requestedBy.tag}`,
					},
				},
			],
		});
	},
};