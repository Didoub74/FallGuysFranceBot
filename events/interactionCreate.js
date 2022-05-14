const { Permissions, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { rulesAcceptedRoleId, minorRoleId, majorRoleId, pcRoleId, ps4RoleId, menRoleId, womenRoleId, TWITCH_CLIENT_ID, TWITCH_APP_ACCESS_TOKEN } = require('../config.json');

const { QueryType, QueueRepeatMode } = require('discord-player');
const player = require('../client/player.js');
const igdb = require('igdb-api-node').default;
const axios = require('axios');
const client = require('../index');
const discordModals = require('discord-modals');
const { Modal, TextInputComponent, showModal } = require('discord-modals');
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
									{ name: '🔢 Places', value: 'Changez le nombre de place de ce salon.', inline:true },
									// { name: '📝 Transférer', value: 'Transférer le rôle de chef de salon à un autre membre.', inline:true },
									{ name: '🖊 Renommer', value: 'Changer le nom du salon vocal', inline:true })
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
						interaction.editReply({ embeds: [embed], ephemeral:true });
					}
				}
				else {
					const embed = new MessageEmbed()
						.setTitle('Erreur')
						.setColor('RED')
						.setDescription('Vous devez être dans un salon vocal pour tenter de le gérer.')
						.setFooter({ text: 'Fall Guys France', iconURL: client.user.avatarURL() })
						.setTimestamp();
					interaction.editReply({ embeds: [embed], ephemeral:true });
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
					interaction.editReply({ embeds: [embed], ephemeral:true });
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
			let commandFind = false;
			if (interaction.commandName === 'admin') {
				if (interaction.options.getSubcommand() === 'ban') {
					commandFind = true;
					if (interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
						const member = interaction.options.getMember('membre');
						const motif = interaction.options.getString('motif');
						try {
							await member.send('Tu as été bannis de ' + member.guild.name + ' par ' + interaction.member.user.tag + '.');
							await member.ban({ reason: '' + motif + '' });
						}
						catch (error) {
							console.error('Impossible d\'effectuer le ban correctement: ', error);
						}
						interaction.editReply({ content: 'J\'ai banni ' + member.user.tag + ' suite à la demande de ' + interaction.member.user.tag });
					}
					else {
						interaction.editReply({
							content: 'Tu ne possèdes pas la permissions d\'effectuer cette action !',
							ephemeral: true,
						});
					}
				}
				if (interaction.options.getSubcommand() === 'kick') {
					commandFind = true;
					if (interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
						const member = interaction.options.getMember('membre');
						const motif = interaction.options.getString('motif');
						if (member.user.tag !== interaction.member.user.tag) {
							try {
								await member.send('Tu as été expulsé de ' + member.guild.name + ' par ' + interaction.member.user.tag + '.');
								await member.kick({ reason: '' + motif + '' });
							}
							catch (error) {
								console.error('Impossible d\'expulser le membre correctement', error);
							}
							interaction.editReply({ content: 'J\'ai expulsé ' + member.user.tag + ' suite à la demande de ' + interaction.member.user.tag });
						}
						else {
							interaction.editReply({ content: 'Tu ne peux pas t\'auto expulser...', ephemeral:true });
						}
					}
					else {
						interaction.editReply({
							content: 'Tu ne possèdes pas la permissions d\'effectuer cette action !',
							ephemeral: true,
						});
					}
				}
				if (interaction.options.getSubcommand() === 'clear') {
					commandFind = true;
					if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
						if (interaction.options.getNumber('nombre') <= 100) {
							await interaction.channel.bulkDelete(interaction.options.getNumber('nombre'));
							await interaction.editReply({
								content: `J'ai supprimé ${interaction.options.getNumber('nombre')} message(s) avec succès.`,
								ephemeral: true,
							});
						}
						else {
							interaction.editReply({
								content: 'Je ne peux pas supprimer plus de 100 messages d\'un seul coups. Merci de réessayer avec un nombre inférieur ou égal à 100.',
								ephemeral: true,
							});
						}
					}
					else {
						interaction.editReply({
							content: 'Tu ne possèdes pas la permissions d\'effectuer cette action !',
							ephemeral: true,
						});
					}
				}
			}
			if (interaction.commandName === 'musique') {
				if (interaction.options.getSubcommand() === 'play') {
					commandFind = true;
					const songTitle = interaction.options.getString('nom');
					if (!interaction.member.voice.channel) {
						interaction.editReply({
							content: 'Merci de rejoindre un salon vocal avant.',
						});
					}
					const actully_queue = player.getQueue(interaction.guildId);
					if (actully_queue?.playing) {
						await actully_queue.skip();
					}
					const searchResult = await player.search(songTitle, {
						requestedBy: interaction.user,
						searchEngine: QueryType.AUTO,
					});

					const queue = await player.createQueue(interaction.guild, {
						metadata: interaction.channel,
					});

					await queue.connect(interaction.member.voice.channel);

					interaction.editReply({ content: `Je joue désormais ${songTitle}` });

					searchResult.playlist
						? queue.addTracks(searchResult.tracks)
						: queue.addTrack(searchResult.tracks[0]);

					if (!queue.playing) await queue.play();
				}
				if (interaction.options.getSubcommand() === 'pause') {
					commandFind = true;
					const queue = player.getQueue(interaction.guildId);
					queue.setPaused(true);
					interaction.editReply({ content: 'La chanson à bien été mise en pause !' });
				}
				if (interaction.options.getSubcommand() === 'resume') {
					commandFind = true;
					const queue = player.getQueue(interaction.guildId);
					queue.setPaused(false);
					interaction.editReply({ content: 'La chanson à bien été reprise !' });
				}
				if (interaction.options.getSubcommand() === 'paroles') {
					commandFind = true;

					const title = interaction.options.getString('titre');
					const sendLyrics = (songTitle) => {
						return createResponse(songTitle)
							.then((res) => {
								interaction.editReply(res);
							})
							.catch((err) => console.log({ err }));
					};

					if (title) return sendLyrics(title);

					const queue = player.getQueue(interaction.guildId);
					if (!queue?.playing) {
						interaction.editReply({
							content: 'Pas de musique en cours de lecture',
						});
					}

					return sendLyrics(queue.current.title);
				}
				if (interaction.options.getSubcommand() === 'actuelle') {
					commandFind = true;
					const queue = player.getQueue(interaction.guildId);
					if (!queue?.playing) {
						interaction.editReply({
							content: 'Pas de musique est en cours de lecture.',
						});
					}

					const progress = queue.createProgressBar();
					const perc = queue.getPlayerTimestamp();

					interaction.editReply({
						content: '',
						embeds: [
							{
								title: 'Chanson actuelle',
								description: `🎶 | **${queue.current.title}**! (\`${perc.progress}%\`)`,
								fields: [
									{
										name: '\u200b',
										value: progress,
									},
								],
								color: '#BB0B0B',
								footer: {
									text: `Demandée par ${queue.current.requestedBy.tag}`,
								},
							},
						],
					});
				}
				if (interaction.options.getSubcommand() === 'boucle') {
					const queue = player.getQueue(interaction.guildId);
					if (!queue || !queue.playing) return void interaction.editReply({ content: '❌ | Pas de chanson est en cours de lecture!' });
					const loopMode = interaction.options.get('mode').value;
					const success = queue.setRepeatMode(loopMode);
					const mode = loopMode === QueueRepeatMode.TRACK ? '🔂' : loopMode === QueueRepeatMode.QUEUE ? '🔁' : '▶';
					return void interaction.editReply({ content: success ? `${mode} | Mode boucle mis à jours!` : '❌ | Impossible de mettre à jours le mode boucle!' });
				}
				if (interaction.options.getSubcommand() === 'volume') {
					const volumePercentage = interaction.options.getInteger('pourcentage');
					const queue = player.getQueue(interaction.guildId);
					if (!queue?.playing) {
						return interaction.editReply({
							content: 'Pas de musique en cours de lecture',
						});
					}

					if (!volumePercentage) {
						return interaction.editReply({
							content: `Le volume actuel est de \`${queue.volume}%\``,
						});
					}

					if (volumePercentage < 0 || volumePercentage > 100) {
						return interaction.editReply({
							content: 'Le volume doit être entre 0 et 100',
						});
					}

					queue.setVolume(volumePercentage);

					return interaction.editReply({
						content: `Le volume a été réglé sur \`${volumePercentage}%\``,
					});
				}
			}
			if (interaction.commandName === 'niveau') {
				if (interaction.options.getSubcommand() === 'membre') {
					commandFind = true;
					const membre = interaction.options.getUser('membre');
					let id;
					let name;
					let avatarURL;
					if (membre !== null) {
						id = membre.id;
						avatarURL = membre.displayAvatarURL(false);
						name = membre.username;
					}
					else {
						id = interaction.member.id;
						avatarURL = interaction.member.displayAvatarURL(false);
						name = interaction.member.displayName;
					}
					const db = new sqlite3.Database('userData');

					let xp;
					let level;
					let rank = 1;
					db.each('SELECT * FROM level WHERE userId = ?', {
						1: id,
					}, async (err, row) => {
						xp = row.xp;
						level = row.level;
					});
					await new Promise(resolve => setTimeout(resolve, 1000));
					db.each('SELECT * FROM level WHERE xp > ?', {
						1: xp,
					}, async () => {
						rank++;
					});
					await new Promise(resolve => setTimeout(resolve, 1000));

					const embed = new MessageEmbed()
						.setTitle('Niveau du membre: ' + name)
						.setColor('RANDOM')
						.setThumbnail(avatarURL)
						.addFields(
							{ name: '\u200B', value: `Voiçi les informations sur ${name}.` },
							{ name: 'XP', value: `${xp}`, inline: true },
							{ name: 'Niveau', value: `${level}`, inline: true },
							{ name: 'Classement', value: `${rank}`, inline: true },
						);
					interaction.editReply({ embeds: [embed] });
				}
				if (interaction.options.getSubcommand() === 'classement') {
					commandFind = true;
					const db = new sqlite3.Database('userData');

					const top = [];
					db.each('SELECT * FROM level ORDER BY xp DESC LIMIT 10', async (err, row) => {
						top.push(row.userId);
					});
					await new Promise(resolve => setTimeout(resolve, 100));
					const embed = new MessageEmbed()
						.setTitle('Classement des membres les plus actifs du serveur.')
						.setColor('RANDOM')
						.setThumbnail(interaction.guild.iconURL());
					let rank = 0;
					let name;
					let xp;
					for (const userId of top) {
						rank = rank + 1;
						interaction.guild.members.fetch(userId).then((user) => {
							name = user.user.username;
						});
						db.each('SELECT xp, level FROM level WHERE userId = ?', [ userId ], async (err, row) => {
							xp = row.xp;
							console.log(row);
						});
						await new Promise(resolve => setTimeout(resolve, 100));
						embed.addFields(
							{ name: 'Rangs', value: `N°${rank}`, inline: true },
							{ name: 'Pseudo', value: `${name}`, inline: true },
							{ name: 'XP', value: `${xp}`, inline: true },
						);
					}
					interaction.editReply({ embeds: [embed] });
				}
			}
			if (interaction.commandName === 'jeu') {
				if (interaction.options.getSubcommand('info')) {
					const gameName = interaction.options.getString('nom');
					const response = await igdb()
						.fields(['*'])

						.limit(1)
						.offset(0)

						.where(`search "${gameName}";`)

						.request('/games');

					console.log(response.data);
				}
			}
			if (!commandFind) {
				interaction.editReply({ content: 'La commande demandé n\'existe pas. Si tu pense que ceci est une erreur, envoie un message à Didoub74#3977', ephemeral:true });
			}
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
		interaction.editReply({ content: 'Vous avez obtenu le rôle "' + roleName + '" !', ephemeral: true });
	}
	else {
		interaction.member.roles.remove(roleId);
		interaction.editReply({ content: 'Vous avez perdu le rôle "' + roleName + '" !', ephemeral: true });
	}
}
const getLyrics = (title) =>
	// eslint-disable-next-line no-async-promise-executor
	new Promise(async (ful, rej) => {
		const url = new URL('https://some-random-api.ml/lyrics');
		url.searchParams.append('title', title);

		try {
			const { data } = await axios.get(url.href);
			ful(data);
		}
		catch (error) {
			rej(error);
		}
	});

const substring = (length, value) => {
	const replaced = value.replace(/\n/g, '--');
	const regex = `.{1,${length}}`;
	return replaced
		.match(new RegExp(regex, 'g'))
		.map((line) => line.replace(/--/g, '\n'));
};

const createResponse = async (title) => {
	try {
		const data = await getLyrics(title);

		const embeds = substring(4096, data.lyrics).map((value, index) => {
			const isFirst = index === 0;

			return new MessageEmbed({
				title: isFirst ? `${data.title} - ${data.author}` : null,
				thumbnail: isFirst ? { url: data.thumbnail.genius } : null,
				description: value,
			});
		});

		return { embeds };
	}
	catch (error) {
		return 'Je ne suis pas capable de trouver la chanson que vous avez demandé :(';
	}
};