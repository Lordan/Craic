const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect().then(() => {
	client.query('CREATE TABLE stats(id SERIAL PRIMARY KEY, user_id  INT not null, walkers_killed INT, humans_defeated INT, missions_played INT, missions_completed, shots_fired INT, stash_collected INT, total_power_heroes INT, total_power_weapons INT, cards_collected INT, survivors_rescued INT, reported TIMESTAMP)');
		.then(()  => {
		console.log("Success!");
		client.end();
	})
	.catch(e => {
		console.error("Failed! Error: " + e);
		client.end();
	});
})
.catch(console.error);
  
