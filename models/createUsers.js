const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect().then(() => {
	const query = client.query('CREATE TABLE users(id SERIAL PRIMARY KEY, discord_id VARCHAR(20) UNIQUE, user_name VARCHAR(40) not null, ingame_nick VARCHAR(40), guild VARCHAR(40))'); 
	query.on('end', () => { client.end(); });
})
.catch(console.error);

