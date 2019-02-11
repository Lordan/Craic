const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect().then(() => {
	client.query('SELECT * FROM tiles')
	.then((res)  => {
		console.log("Success!" + JSON.stringify(res));
		client.end();
	})
	.catch(e => {
		console.error("Failed! Error: " + e);
		client.end();
	});
})
.catch(console.error);