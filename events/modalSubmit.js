const { Formatters, MessageEmbed } = require('discord.js');
const client = require('../index');

module.exports = {
	name: 'modalSubmit',
	async execute(modal) {
		const voiceChannel = modal.member.voice.channel;
		if (voiceChannel !== null) {
			const Anwser = modal.getTextInputValue('renameModalText');
			await voiceChannel.setName(Anwser);

			const embed = new MessageEmbed()
				.setTitle('Succès')
				.setColor('GREEN')
				.setDescription('Vous avez changé le nom du salon pour: ' + Anwser + '.')
				.setFooter({ text: 'Fall Guys France', iconURL: client.user.avatarURL() })
				.setTimestamp();

			await modal.deferReply({ ephemeral: true })
			await modal.followUp({ embeds: [embed], ephemeral: true });
		}
		else {
			const embed = new MessageEmbed()
				.setTitle('Erreur')
				.setColor('RED')
				.setDescription('Vous devez être dans un salon vocal pour tenter de le gérer.')
				.setFooter({ text: 'Fall Guys France', iconURL: client.user.avatarURL() })
				.setTimestamp();
			modal.reply({ embeds: [embed], ephemeral:true });
		}
	},
};