const {
	Permissions,
	MessageEmbed,
	MessageActionRow,
	MessageButton,
	MessageSelectMenu,
} = require('discord.js');
const {
	rulesAcceptedRoleId,
	minorRoleId,
	majorRoleId,
	pcRoleId,
	ps4RoleId,
	menRoleId,
	womenRoleId,
} = require('../config.json');

const igdb = require('igdb-api-node').default;
const client = require('../index');
const discordModals = require('discord-modals');
const { Modal, TextInputComponent, showModal } = require('discord-modals');
const fs = require('fs');
const path = require('path');
discordModals(client);
const sqlite3 = require('sqlite3').verbose();
module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (interaction.isButton()) {
			if (interaction.customId === 'read') {
				checkIfOwned(interaction, rulesAcceptedRoleId, 'Règlement Accepté');
			}
			if (interaction.customId === '-18') {
				checkIfOwned(interaction, minorRoleId, '-18 ans');
			}
			if (interaction.customId === '+18') {
				checkIfOwned(interaction, majorRoleId, '+18 ans');
			}
			if (interaction.customId === 'pc') {
				checkIfOwned(interaction, pcRoleId, 'PC');
			}
			if (interaction.customId === 'ps4') {
				checkIfOwned(interaction, ps4RoleId, 'PS4');
			}
			if (interaction.customId === 'men') {
				checkIfOwned(interaction, menRoleId, 'Homme');
			}
			if (interaction.customId === 'women') {
				checkIfOwned(interaction, womenRoleId, 'Femme');
			}
			if (interaction.customId === 'manage') {
				if (interaction.member.voice.channel !== null) {
					const db = new sqlite3.Database('userData');

					let exist;
					let channelOwnerId;
					await db.each('SELECT * FROM vocalChannel WHERE id = ?', [interaction.member.voice.channel.id], (err, row) => {
						exist = true;
						channelOwnerId = row.ownerId;

					});
					await new Promise(resolve => setTimeout(resolve, 100));
					if (exist) {
						if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS) || interaction.member.id === channelOwnerId) {
							const embed = new MessageEmbed()
								.setTitle('Gestion du salon ' + interaction.member.voice.channel.name)
								.setDescription(`Vous dirigez le salon <#${interaction.member.voice.channel.id}>.\nVous pouvez gérer ce salon à l'aide des boutons ci-dessous.`)
								.addFields(
									{
										name: '🔢 Places',
										value: 'Changez le nombre de place de ce salon.',
										inline: true,
									},
									// { name: '📝 Transférer', value: 'Transférer le rôle de chef de salon à un autre membre.', inline:true },
									{ name: '🖊 Renommer', value: 'Changer le nom du salon vocal', inline: true })
								.setFooter({ text: 'Fall Guys France', iconURL: client.user.avatarURL() })
								.setTimestamp();
							const row = new MessageActionRow()
								.addComponents(
									new MessageButton()
										.setCustomId('place')
										.setLabel('🔢 Places')
										.setStyle('SECONDARY'),
								)
								.addComponents(
									new MessageButton()
										.setCustomId('rename')
										.setLabel('🖊 Renommer')
										.setStyle('SECONDARY'),
								);
							interaction.editReply({ embeds: [embed], components: [row], ephemeral: true });
						}
						else {
							const embed = new MessageEmbed()
								.setTitle('Erreur')
								.setColor('RED')
								.setDescription(`Le salon <#${interaction.member.voice.channel.id}> ne t'appartient pas et tu ne possèdes pas les permissions de le modifier.`)
								.setFooter({ text: 'Fall Guys France', iconURL: client.user.avatarURL() })
								.setTimestamp();
							interaction.editReply({ embeds: [embed], ephemeral: true });
						}
					}
					else {
						const embed = new MessageEmbed()
							.setTitle('Erreur')
							.setColor('RED')
							.setDescription(`Le salon <#${interaction.member.voice.channel.id}> n'est pas un salon temporaire créé par moi !`)
							.setFooter({ text: 'Fall Guys France', iconURL: client.user.avatarURL() })
							.setTimestamp();
						interaction.editReply({ embeds: [embed], ephemeral: true });
					}
				}
				else {
					const embed = new MessageEmbed()
						.setTitle('Erreur')
						.setColor('RED')
						.setDescription('Vous devez être dans un salon vocal pour tenter de le gérer.')
						.setFooter({ text: 'Fall Guys France', iconURL: client.user.avatarURL() })
						.setTimestamp();
					interaction.editReply({ embeds: [embed], ephemeral: true });
				}
			}
			if (interaction.customId === 'rename') {
				const modal = new Modal()
					.setCustomId('renameModal')
					.setTitle('Renommez votre salon.')
					.addComponents(
						new TextInputComponent()
							.setCustomId('renameModalText')
							.setLabel('Écrivez le nouveau nom de votre salon.')
							.setStyle('SHORT')
							.setMinLength(4)
							.setMaxLength(20)
							.setPlaceholder('Nom du salon')
							.setRequired(true),
					);
				await showModal(modal, {
					client: client,
					interaction: interaction,
				});
			}
			if (interaction.customId === 'place') {
				if (interaction.member.voice.channel !== null) {
					const embed = new MessageEmbed()
						.setTitle('Nombre de places du salon')
						.setColor('BLUE')
						.setDescription(`Choisissez le nombre de place de ce salon: <#${interaction.member.voice.channel.id}>.`)
						.setFooter({ text: 'Fall Guys France', iconURL: client.user.avatarURL() })
						.setTimestamp();
					const row = new MessageActionRow()
						.addComponents(
							new MessageSelectMenu()
								.setCustomId('placeSelectMenu')
								.addOptions({ label: '2 Places', value: '2places', emoji: '2️⃣' })
								.addOptions({ label: '3 Places', value: '3places', emoji: '3️⃣' })
								.addOptions({ label: '4 Places', value: '4places', emoji: '4️⃣' }),
						);
					interaction.editReply({ embeds: [embed], components: [row], ephemeral: true });
				}
				else {
					const embed = new MessageEmbed()
						.setTitle('Erreur')
						.setColor('RED')
						.setDescription('Vous devez être dans un salon vocal pour tenter de le gérer.')
						.setFooter({ text: 'Fall Guys France', iconURL: client.user.avatarURL() })
						.setTimestamp();
					interaction.editReply({ embeds: [embed], ephemeral: true });
				}
			}
			/* if (interaction.customId === 'transfer') {
				if (interaction.member.voice.channel !== null) {
					if (interaction.member.voice.channel.members.size > 1) {
						const db = new sqlite3.Database('userData');
						const row = new MessageActionRow()
							.addComponents(
								new MessageSelectMenu()
									.setCustomId('placeSelectMenu')
									.addOptions({ label: '2 Places', value: '2places', emoji: '2️⃣' })
									.addOptions({ label: '3 Places', value: '3places', emoji: '3️⃣' })
									.addOptions({ label: '4 Places', value: '4places', emoji: '4️⃣' }),
							);
						/*db.run('UPDATE vocalChannel SET ownerId = ? WHERE id = ?', {
                            1:
                        })
					}else{
						const embed = new MessageEmbed()
							.setTitle('Erreur')
							.setColor('RED')
							.setDescription('Vous devez être plus de 1 dans le salon pour transférer le rôle de chef du salon.')
							.setFooter({ text: 'Fall Guys France', iconURL: client.user.avatarURL() })
							.setTimestamp();
						interaction.editReply({ embeds: [embed], ephemeral:true });
					}
				}else {
					const embed = new MessageEmbed()
						.setTitle('Erreur')
						.setColor('RED')
						.setDescription('Vous devez être dans un salon vocal pour tenter de le gérer.')
						.setFooter({ text: 'Fall Guys France', iconURL: client.user.avatarURL() })
						.setTimestamp();
					interaction.editReply({ embeds: [embed], ephemeral:true });
				}
			} */
		}
		if (interaction.isCommand()) {
			await interaction.reply('⏳ Merci de patienter quelque secondes... ⏳');

			readDir('commands', async function(err, results) {
				if (err) throw err;
				for (const result of results) {
					const command = require(`${result}`);
					if (command.finished === 'no') {
						return await interaction.editReply({ content: 'Commande en développement' });
					}
					if (command.haveSubParent) {
						if (interaction.options.getSubcommand() === command.name) {
							command.execute(interaction);
							console.log('Handler Used !');
						}
					}

				}
			});
		}
		if (interaction.isSelectMenu()) {

			if (interaction.customId === 'placeSelectMenu') {
				if (interaction.values[0] === '2places') {
					if (interaction.member.voice.channel !== null) {
						interaction.member.voice.channel.setUserLimit(2);

						const embed = new MessageEmbed()
							.setTitle('Succès')
							.setColor('GREEN')
							.setDescription('J\'ai bien réglé le nombre de places sur 2')
							.setFooter({ text: 'Fall Guys France', iconURL: client.user.avatarURL() })
							.setTimestamp();
						interaction.editReply({ embeds: [embed], ephemeral: true });
					}
					else {
						const embed = new MessageEmbed()
							.setTitle('Erreur')
							.setColor('RED')
							.setDescription('Vous devez être dans un salon vocal pour tenter de le gérer.')
							.setFooter({ text: 'Fall Guys France', iconURL: client.user.avatarURL() })
							.setTimestamp();
						interaction.editReply({ embeds: [embed], ephemeral: true });
					}
				}
				if (interaction.values[0] === '3places') {
					if (interaction.member.voice.channel !== null) {
						interaction.member.voice.channel.setUserLimit(3);

						const embed = new MessageEmbed()
							.setTitle('Succès')
							.setColor('GREEN')
							.setDescription('J\'ai bien réglé le nombre de places sur 3')
							.setFooter({ text: 'Fall Guys France', iconURL: client.user.avatarURL() })
							.setTimestamp();
						interaction.editReply({ embeds: [embed], ephemeral: true });
					}
					else {
						const embed = new MessageEmbed()
							.setTitle('Erreur')
							.setColor('RED')
							.setDescription('Vous devez être dans un salon vocal pour tenter de le gérer.')
							.setFooter({ text: 'Fall Guys France', iconURL: client.user.avatarURL() })
							.setTimestamp();
						interaction.editReply({ embeds: [embed], ephemeral: true });
					}
				}
				if (interaction.values[0] === '4places') {
					if (interaction.member.voice.channel !== null) {
						interaction.member.voice.channel.setUserLimit(4);

						const embed = new MessageEmbed()
							.setTitle('Succès')
							.setColor('GREEN')
							.setDescription('J\'ai bien réglé le nombre de places sur 4')
							.setFooter({ text: 'Fall Guys France', iconURL: client.user.avatarURL() })
							.setTimestamp();
						interaction.editReply({ embeds: [embed], ephemeral: true });
					}
					else {
						const embed = new MessageEmbed()
							.setTitle('Erreur')
							.setColor('RED')
							.setDescription('Vous devez être dans un salon vocal pour tenter de le gérer.')
							.setFooter({ text: 'Fall Guys France', iconURL: client.user.avatarURL() })
							.setTimestamp();
						interaction.editReply({ embeds: [embed], ephemeral: true });
					}
				}

			}
		}
	},
};

function checkIfOwned(interaction, roleId, roleName) {
	if (!interaction.member.roles.cache.some(role => role.id === roleId)) {
		interaction.member.roles.add(roleId);
		interaction.reply({ content: 'Vous avez obtenu le rôle "' + roleName + '" !', ephemeral: true });
	}
	else {
		interaction.member.roles.remove(roleId);
		interaction.reply({ content: 'Vous avez perdu le rôle "' + roleName + '" !', ephemeral: true });
	}
}


function readDir(dir, done) {
	let results = [];
	fs.readdir(dir, function(err, list) {
		if (err) return done(err);
		let i = 0;
		(function next() {
			let file = list[i++];
			if (!file) return done(null, results);
			file = path.resolve(dir, file);
			fs.stat(file, function(err, stat) {
				if (stat && stat.isDirectory()) {
					readDir(file, function(err, res) {
						results = results.concat(res);
						next();
					});
				}
				else {
					results.push(file);
					next();
				}
			});
		})();
	});
	return results;
}
