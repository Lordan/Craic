const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect().then(() => {
	client.query('ALTER TABLE users ADD COLUMN active BOOLEAN NOT NULL DEFAULT TRUE')
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