const player = require('../../client/player');
const { MessageEmbed } = require('discord.js');

const Genius = require('genius-lyrics');
const Client = new Genius.Client();

module.exports = {
	haveSubParent: true,
	name: 'paroles',
	async execute(interaction) {
		const title = interaction.options.getString('titre');
		const sendLyrics = (songTitle) => {
			return search(songTitle)
				.then(async (res) => {
					await interaction.editReply({ content: 'Votre demande à été effectué.' });
					await interaction.editReply(res);
				})
				.catch((err) => console.log({ err }));
		};

		if (title) return sendLyrics(title);

		const queue = player.getQueue(interaction.guildId);
		if (!queue?.playing) {
			return await interaction.editReply({
				content: 'Pas de musique en cours de lecture',
			});
		}

		return sendLyrics(queue.current.title);
	},
};
const substring = (length, value) => {
	const replaced = value.replace(/\n/g, '--');
	const regex = `.{1,${length}}`;
	return replaced
		.match(new RegExp(regex, 'g'))
		.map((line) => line.replace(/--/g, '\n'));
};
async function search(name) {
	const searches = await Client.songs.search(`${name}`);

	const firstSong = searches[0];
	const lyrics = await firstSong.lyrics();
	const embeds = substring(4096, lyrics).map((lyric) => {
		return new MessageEmbed()
			.setTitle(`${firstSong.title}`)
			.setThumbnail(`${firstSong.thumbnail}\``)
			.setDescription(lyric);
	});
	return { embeds };
}