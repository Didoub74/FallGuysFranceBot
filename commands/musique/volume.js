const player = require('../../client/player');
module.exports = {
	haveSubParent: true,
	name: 'volume',
	async execute(interaction) {

		const volumePercentage = interaction.options.getInteger('pourcentage');
		const queue = player.getQueue(interaction.guildId);
		if (!queue?.playing) {
			return interaction.editReply({
				content: 'Pas de musique en cours de lecture',
			});
		}

		if (!volumePercentage) {
			return interaction.editReply({
				content: `Le volume actuel est de \`${queue.volume}%\``,
			});
		}

		if (volumePercentage < 0 || volumePercentage > 100) {
			return interaction.editReply({
				content: 'Le volume doit être entre 0 et 100',
			});
		}

		queue.setVolume(volumePercentage);

		return interaction.editReply({
			content: `Le volume a été réglé sur \`${volumePercentage}%\``,
		});

	},
};