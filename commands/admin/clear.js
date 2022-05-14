const { Permissions } = require('discord.js');
module.exports = {
	haveSubParent: true,
	name: 'clear',
	async execute(interaction) {
		if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
			if (interaction.options.getNumber('nombre') <= 100) {
				await interaction.channel.bulkDelete(interaction.options.getNumber('nombre') + 1, true)
					.then(messages => interaction.channel.send(`J'ai supprimé ${messages.size - 1} message(s) avec succès.`));
			}
			else {
				await interaction.editReply({
					content: 'Je ne peux pas supprimer plus de 100 messages d\'un seul coups. Merci de réessayer avec un nombre inférieur ou égal à 100.',
					ephemeral: true,
				});
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