const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect().then(() => {
	client.query('CREATE TABLE users(id SERIAL PRIMARY KEY, discord_id VARCHAR(20) UNIQUE, user_name VARCHAR(40) not null, ingame_nick VARCHAR(40), guild VARCHAR(40))')
	.then(()  => {
		console.log("Success!");
		client.end();
	})
	.catch(e => {
		console.error("Failed!");
		client.end();
	});
})
.catch(console.error);

