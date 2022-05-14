const { Permissions } = require('discord.js');
module.exports = {
	haveSubParent: true,
	name: 'ban',
	async execute(interaction) {
		if (interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
			const member = interaction.options.getMember('membre');
			const motif = interaction.options.getString('motif');
			if (member.user.tag !== interaction.member.user.tag) {
				try {
					await member.send('Tu as été bannis de ' + member.guild.name + ' par ' + interaction.member.user.tag + '.');
					await member.ban({ reason: '' + motif + '' });
					await interaction.editReply({ content: 'J\'ai banni ' + member.user.tag + ' suite à la demande de ' + interaction.member.user.tag });
				}
				catch (error) {
					console.error('Impossible d\'effectuer le ban correctement: ', error);
					await interaction.editReply({ content: 'Impossible de bannir le membre correctement' });

				}
			}
			else {
				await interaction.editReply({ content: 'Tu ne peux pas t\'auto bannir...', ephemeral:true });
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