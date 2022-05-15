const player = require('../../client/player');
module.exports = {
	haveSubParent: true,
	name: 'pause',
	async execute(interaction) {
		const queue = player.getQueue(interaction.guildId);
		if (!queue?.playing) {
			return await interaction.editReply({
				content: 'Pas de musique est en cours de lecture.',
			});
		}
		queue.setPaused(true);
		await interaction.editReply({ content: 'La chanson à bien été mise en pause !' });
	},
};