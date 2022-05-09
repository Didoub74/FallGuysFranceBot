const { createVocalChannelId } = require('../config.json');
const { Permissions } = require('discord.js');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('userData');
module.exports = {
	name: 'voiceStateUpdate',
	async execute(oldState, newState) {
		await new Promise(resolve => setTimeout(resolve, 100));
		if ((oldState.member.voice.channel !== null)) {
			if (oldState.member.voice.channel.id === createVocalChannelId) {
				if (oldState.guild.available) {
					const member = oldState.member;
					const channelParent = oldState.member.voice.channel.parent;
					const channelPosition = oldState.member.voice.channel.position + 1;
					let newChannelId;
					await new Promise(resolve => setTimeout(resolve, 100));
					oldState.guild.channels.create('🎓 ❱  ' + member.displayName,
						{
							type: 'GUILD_VOICE',
							userLimit: 4,
							position: channelPosition,
							parent: channelParent,
							permissionOverwrites: [
								{
									id: member.id,
									allow: [Permissions.FLAGS.MANAGE_CHANNELS],
								},
							],
							reason: `Création de salon à la demande de ${member.user.tag}`,
						}).then(async channel => {
						await oldState.member.voice.setChannel(channel);
						newChannelId = channel.id;
					});
					await new Promise(resolve => setTimeout(resolve, 1000));
					db.run('INSERT INTO vocalChannel VALUES (?, ?)', {
						1: newChannelId,
						2: oldState.member.id,
					});
				}
			}
		}
		if (newState.channelId === null) {
			const oldChannel = oldState.channel;
			await new Promise(resolve => setTimeout(resolve, 100));
			if (oldState.channel !== null) {
				const membersCount = oldChannel.members.size;
				let exist;
				if (membersCount === 0) {
					await db.each('SELECT * FROM vocalChannel WHERE id = ?', [oldChannel.id], () => {
						// console.log('Membre existant');
						exist = true;
					});
					await new Promise(resolve => setTimeout(resolve, 100));
					if (exist) {
						db.run('DELETE FROM vocalChannel WHERE id = ?', [oldChannel.id]);
						oldChannel.delete('Salon de membre temporaire');
						console.log('Channel deleted');
					}
					else {
						console.log('Not a good channel to delete');
					}
				}
			}
		}
	},
};