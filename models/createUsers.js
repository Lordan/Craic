const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

await client.connect();

const query = client.query(
  'CREATE TABLE users(id SERIAL PRIMARY KEY, discord_id VARCHAR(20) not null, user_name VARCHAR(40) not null, ingame_nick VARCHAR(40), guild VARCHAR940))');
  
query.on('end', () => { client.end(); });