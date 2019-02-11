const db = require('../db')
const userQueries = require('./dbQueries.js').userQueries;
const statsQueries = require('./dbQueries.js').statsQueries;
const tileQueries = require('./dbQueries.js').tileQueries;

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

function getUsernameByUserId(userId) {
	console.log(`getUsernameByUserId() - received ${userId}`);
	let promise = new Promise((resolve, reject) => {
		if (userId === null || userId.isNaN) reject('No user id given');
		const query = {
			text : userQueries.getUsernameByUserId,
			values: [userId]
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

function setMinimumStats(userId, kills, missions, survivors) {
	console.log(`setMinimumStats() - received [${userId}, ${kills}, ${missions}, ${survivors}] `);
	let promise = new Promise((resolve, reject) => {
		if (userId === null) reject('No user id given');
		if (kills === null) reject('No number of kills given');
		if (missions === null) reject('No number of missions given');
		if (survivors === null) reject('No number of survivors given');
		const query = {
			text : statsQueries.setMinimumStats,
			values: [userId, kills, missions, survivors]
		};
		executeQuery(resolve, reject, query);		
	});
	
	return promise;
}

function setTile(userId, tileNumber) {
	console.log(`setTile() - received [${userId}, ${tileNumber}] `);
	let promise = new Promise((resolve, reject) => {
		if (userId === null) reject('No user id given');
		if (tileNumber === null) reject('No tile number given');
		const query = {
			text : tileQueries.setTile,
			values: [userId, tileNumber]
		};
		executeQuery(resolve, reject, query);		
	});
	
	return promise;
}

function clearTile(userId, tileNumber) {
	console.log(`clearTile() - received [${userId}, ${tileNumber}] `);
	let promise = new Promise((resolve, reject) => {
		if (userId === null) reject('No user id given');
		if (tileNumber === null) reject('No tile number given');
		const query = {
			text : tileQueries.clearTile,
			values: [userId, tileNumber]
		};
		executeQuery(resolve, reject, query);		
	});
	
	return promise;
}

function getTile(tileNumber) {
	console.log(`getTile() - received [${tileNumber}] `);
	let promise = new Promise((resolve, reject) => {
		if (tileNumber === null) reject('No tile number given');
		const query = {
			text : tileQueries.getTile,
			values: [tileNumber]
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
exports.getUsernameByUserId = getUsernameByUserId;
exports.setIngameNick = setIngameNick;
exports.setMinimumStats = setMinimumStats;
exports.setTile = setTile;
exports.clearTile = clearTile;
exports.getTile = getTile;