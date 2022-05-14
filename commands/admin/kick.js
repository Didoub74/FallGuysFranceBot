const { Permissions } = require('discord.js');
module.exports = {
	haveSubParent: true,
	name: 'kick',
	async execute(interaction) {
		if (interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
			const member = interaction.options.getMember('membre');
			const motif = interaction.options.getString('motif');
			if (member.user.tag !== interaction.member.user.tag) {
				try {
					await member.send('Tu as été expulsé de ' + member.guild.name + ' par ' + interaction.member.user.tag + '.');
					await member.kick({ reason: '' + motif + '' });
					await interaction.editReply({ content: 'J\'ai expulsé ' + member.user.tag + ' suite à la demande de ' + interaction.member.user.tag });
				}
				catch (error) {
					console.error('Impossible d\'expulser le membre correctement', error);
					await interaction.editReply({ content: 'Impossible d\'expulser le membre correctement' });
				}
			}
			else {
				await interaction.editReply({ content: 'Tu ne peux pas t\'auto expulser...', ephemeral:true });
			}
		}
		else {
			await interaction.editReply({
				content: 'Tu ne possèdes pas la permissions d\'effectuer cette action !',
				ephemeral: true,
			});
		}
	},
};