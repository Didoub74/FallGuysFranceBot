const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');
dotenv.config();

const { QueueRepeatMode } = require('discord-player');

const commands = [
	new SlashCommandBuilder()
		.setName('admin')
		.setDescription('Commande pour les hauts gradés.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('ban')
				.setDescription('Bannis un membre de ce serveur')
				.addUserOption(option =>
					option.setName('membre')
						.setDescription('Le membre à bannir')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('motif')
						.setDescription('Le motif du bannissement')
						.setRequired(false)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('kick')
				.setDescription('Expulse un membre de ce serveur.')
				.addUserOption(option =>
					option.setName('membre')
						.setDescription('Le membre à expulser')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('motif')
						.setDescription('Le motif de l\'expulsion')
						.setRequired(false)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('clear')
				.setDescription('Supprimer un nombre donné de message')
				.addNumberOption(option =>
					option.setName('nombre')
						.setDescription('Nombre de message à supprimer')
						.setRequired(true))),
	new SlashCommandBuilder()
		.setName('musique')
		.setDescription('Commande de musique')
		.addSubcommand(subcommand =>
			subcommand
				.setName('play')
				.setDescription('Joue une musique')
				.addStringOption(option =>
					option.setName('nom')
						.setDescription('Le nom de la musique à jouer')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('pause')
				.setDescription('Met en pause la musique.'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('resume')
				.setDescription('Reprend la musique mise en pause.'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('actuelle')
				.setDescription('Affiche la musique actuelle.'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('paroles')
				.setDescription('Montre les paroles de la chanson en cours ou alors de celle demandé.')
				.addStringOption(option =>
					option.setName('titre')
						.setDescription('Le nom de la chanson à retrouver.')
						.setRequired(false)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('volume')
				.setDescription('Permet de régler ou de vérifier le volume de la chanson courante.')
				.addIntegerOption(option =>
					option.setName('pourcentage')
						.setDescription('Le pourcentage de volume')
						.setRequired(false)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('boucle')
				.setDescription('Active le mode boucle des chansons')
				.addIntegerOption(option =>
					option.setName('mode')
						.setDescription('Mode pour la boucle')
						.setRequired(true)
						.addChoices({
							name: 'Off',
							value: QueueRepeatMode.OFF,
						})
						.addChoices({
							name: 'Chanson',
							value: QueueRepeatMode.TRACK,
						}))),
	new SlashCommandBuilder()
		.setName('niveau')
		.setDescription('Commande de niveau')
		.addSubcommand(subcommand =>
			subcommand
				.setName('membre')
				.setDescription('Indique son niveau personnel ou alors celui d\'un membre.')
				.addUserOption(option =>
					option.setName('membre')
						.setDescription('Le membre auquel vous voulez savoir le niveau.')
						.setRequired(false)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('classement')
				.setDescription('Indique le top 10 des membres de ce serveur.')),
	new SlashCommandBuilder()
		.setName('jeu')
		.setDescription('Commande d\'information sur les jeux')
		.addSubcommand(subcommand =>
			subcommand
				.setName('info')
				.setDescription('Indique les informations sur un jeu recherché.')
				.addStringOption(option =>
					option.setName('nom')
						.setDescription('Le nom du jeu que vous recherchez.')
						.setRequired(true))),

]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env['token']);

rest.put(Routes.applicationGuildCommands(process.env['clientId'], process.env['guildId']), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);