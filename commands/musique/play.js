const player = require('../../client/player');
const { QueryType } = require('discord-player');
module.exports = {
	haveSubParent: true,
	name: 'play',
	async execute(interaction) {
		const songTitle = interaction.options.getString('nom');
		if (!interaction.member.voice.channel) {
			await interaction.editReply({
				content: 'Merci de rejoindre un salon vocal avant.',
			});
		}
		const actually_queue = player.getQueue(interaction.guildId);
		if (actually_queue?.playing) {
			actually_queue.skip();
		}
		const searchResult = await player.search(songTitle, {
			requestedBy: interaction.user,
			searchEngine: QueryType.AUTO,
		});

		const queue = await player.createQueue(interaction.guild, {
			metadata: interaction.channel,
		});

		await queue.connect(interaction.member.voice.channel);

		await interaction.editReply({ content: `Je joue désormais ${songTitle}` });

		searchResult.playlist
			? queue.addTracks(searchResult.tracks)
			: queue.addTrack(searchResult.tracks[0]);

		if (!queue.playing) await queue.play();
	},
};