const player = require('../../client/player');
const { QueueRepeatMode } = require('discord-player');
module.exports = {
	haveSubParent: true,
	name: 'boucle',
	async execute(interaction) {
		const queue = player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) return void await interaction.editReply({ content: '❌ | Pas de chanson est en cours de lecture!' });
		const loopMode = interaction.options.get('mode').value;
		const success = queue.setRepeatMode(loopMode);
		const mode = loopMode === QueueRepeatMode.TRACK ? '🔂' : loopMode === QueueRepeatMode.QUEUE ? '🔁' : '▶';
		return void await interaction.editReply({ content: success ? `${mode} | Mode boucle mis à jours!` : '❌ | Impossible de mettre à jours le mode boucle!' });
	},
};