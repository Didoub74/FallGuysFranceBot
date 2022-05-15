const { default: igdb } = require('igdb-api-node');
module.exports = {
	haveSubParent: true,
	name: 'info',
	finished: 'no',
	async execute(interaction) {
		if (interaction.options.getSubcommand('info')) {
			const gameName = interaction.options.getString('nom');
			const response = await igdb()
				.fields(['*'])

				.limit(1)
				.offset(0)

				.search(`${gameName}`)

				.request('/games');

			console.log(response.data);
		}
	},
};