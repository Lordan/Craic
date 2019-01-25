const db = require('../db')
const userQueries = require('./dbQueries.js').userQueries;

function getIngameNickByUsername(username) {	
	console.log(`getIngameNickByUsername() - received ${username}`);
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
	console.log(`getIngameNickByDiscordId() - received ${discordId}`);
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

function getUsernameByIngameNick(ingameNick) {
	console.log(`getUsernameByIngameNick() - received ${ingameNick}`);
	let promise = new Promise((resolve, reject) => {
		if (ingameNick === null || ingameNick.trim().length < 1) reject('No ingame nick given');
		const query = {
			text : userQueries.getUsernameByIngameNick,
			values: [ingameNick]
		};
		executeQuery(resolve, reject, query);		
	});	
	return promise;	
}

function getUserIdByDiscordId(discordId) {
	console.log(`getUserIdByDiscordId() - received ${discordId}`);
	let promise = new Promise((resolve, reject) => {
		if (discordId === null || discordId.trim().length < 1) reject('No user id given');
		const query = {
			text : userQueries.getUserIdByDiscordId,
			values: [discordId]
		};
		executeQuery(resolve, reject, query);		
	});	
	return promise;	
}

function setIngameNick(discordId, username, ingameNick, guild) {
	console.log(`setIngameNick() - received [${discordId}, ${username}, ${ingameNick}, ${guild}] `);
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
	db.query(query)
			.then(res => {
				resolve(res);
			})
			.catch(e => {
				console.error(e.stack);
				reject('DB query failed');
			});
}

exports.getIngameNickByUsername = getIngameNickByUsername;
exports.getIngameNickByDiscordId = getIngameNickByDiscordId;
exports.getUsernameByIngameNick = getUsernameByIngameNick;
exports.getUserIdByDiscordId = getUserIdByDiscordId;
exports.setIngameNick = setIngameNick;