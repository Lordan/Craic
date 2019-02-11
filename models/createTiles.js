const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect().then(() => {
	client.query('CREATE TABLE tiles(id SERIAL PRIMARY KEY, user_id  INT not null, tile INT, reported TIMESTAMP)')
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
  
