const { Client } = require('pg');
const userQueries = require('./tools/dbQueries.js').userQueries;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

function getIngameNickByUsername(username) {
	let promise = new Promise((resolve, reject) => {
		if (username === null || username.trim().length < 1) reject('No username given');
		const query = {
			text : userQueries.getIngameNickByUsername,
			values: [username]
		};
		executeQuery(resolve, reject, query);		
	});
	
	return promise;	
}

function getIngameNickByDiscordId(discordId) {
	let promise = new Promise((resolve, reject) => {
		if (discordId === null || discordId.trim().length < 1) reject('No discord id given');
		const query = {
			text : userQueries.getIngameNickByDiscordId,
			values: [discordId]
		};
		executeQuery(resolve, reject, query);		
	});
	
	return promise;	
}

function setIngameNick(discordId, username, ingameNick, guild) {
	let promise = new Promise((resolve, reject) => {
		if (discordId === null || discordId.trim().length < 1) reject('No discord id given');
		if (username === null || username.trim().length < 1) reject('No username given');
		if (ingameNick === null || ingameNick.trim().length < 1) reject('No ingame nick given');
		if (guild === null || guild.trim().length < 1) reject('No guild given');
		const query = {
			text : userQueries.setIngameNick,
			values: [discordId, username, ingameNick, guild]
		};
		executeQuery(resolve, reject, query);		
	});
	
	return promise;
}

function executeQuery(resolve, reject, query) {
	
	client.connect();
	client.query(query)
			.then(res => {
				let resultSet = Object.keys(res).map(val => res[val]);
				client.end();
				resolve(resultSet);
			})
			.catch(e => {
				console.error(e.stack);
				client.end();
				reject('DB query failed');
			});
}

exports.getIngameNickByUsername = getIngameNickByUsername;
exports.getIngameNickByDiscordId = getIngameNickByDiscordId;
exports.setIngameNick = setIngameNick;