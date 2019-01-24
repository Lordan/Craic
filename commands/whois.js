const util = require('util')
const dataHandler = require('../tools/dataHandler.js');
const setIngameNick = dataHandler.setIngameNick;
const getIngameNickByDiscordId = dataHandler.getIngameNickByDiscordId;
const getIngameNickByUsername = dataHandler.getIngameNickByUsername;
const getUsernameByIngameNick = dataHandler.getUsernameByIngameNick;
const nicksFile = '../data/nicks.json'
const usrPrefix = '@';
const usrPostfix = '#';
const respond = require('../tools/responder.js').respond;

function whois(msg, args) {
	if (msg === null) return;
	let replyMsg = '';
	
	if (args === null || !(args instanceof Array) || args.length == 0) {
		console.error("whois(): args check failed, is Array: " + (args instanceof Array) + " length: " + args.length);
		replyMsg = `No user provided for whois. Usage !whois <user>, you called with ${args}`;
		respond(msg, replyMsg);
		return;
	}
	
	console.log(`whois() - received ${args}`);
	
	const searchParam = args[0];
	
	if (searchParam == "help" || searchParam == "?") {
		replyMsg = `Usage:\n
			!whois <@user>\n
			!whois <username>\n
			!whois <ingame nick>`;
			respond(msg, replyMsg);
			return;
	}
	
	if (msg.mentions && msg.mentions.users && msg.mentions.users.length < 1) {
		const discordId = msg.mentions.users.firstKey();		
		console.log(`whois() - calling getIngameNickByDiscordId`);
		getIngameNickByDiscordId(discordId).then(res => {
			replyMsg = parseWhoisResult(res, searchParam);	
			respond(msg, replyMsg);
		})
		.catch(e => {
			console.error(e);
			replyMsg = `Failed to retrieve ingame nick, error logged`;
		});
	} else {
		
		console.log(`whois() - calling getIngameNickByUsername`);
		getIngameNickByUsername(searchParam).then(res => {
			//we might have a whois with ingame nick as search parameter
			let finalResult = res;
			if (res.rowCount == 0) {				
				console.log(`whois() - calling getUsernameByIngameNick`);
				getUsernameByIngameNick(searchParam).then(res => {
					finalResult = res;
					replyMsg = parseWhoisResult(finalResult, searchParam);	
					respond(msg, replyMsg)
				})
				.catch(console.error);
			}
			replyMsg = parseWhoisResult(finalResult, searchParam);	
			respond(msg, replyMsg);
		})
		.catch(e => {
			console.error(e);
			replyMsg = `Failed to retrieve ingame nick, error logged`;
		});
	}	 	
}

function parseWhoisResult(res, searchParam) {
	console.log(`parseWhoisResult() - received ${util.inspect(res)} and search param ${searchParam}`);
	//respond with the original parameter
	let replyMsg = `Nothing found for ${searchParam}`;
	if (res.rowCount > 0) {
		replyMsg = `${searchParam}'s ingame nick is ${res.rows[0].ingame_nick}`;
	}
	console.log(`parseWhoisResult() - returning ${replyMsg}`);
	return replyMsg;		
}

function addNick(msg, args) {
	if (msg === null || msg.author === null) return;
	let replyMsg = '';
	if (args === null || !(args instanceof Array) || args.length == 0) {
		console.error("addNick(): args check failed, is Array: " + (args instanceof Array) + " length: " + args.length);
		replyMsg = `No ingame nick provided to add to list. Usage !iam <ingame nick>, you called with ${args}`;
		respond(msg, replyMsg);
		return;
	}
	let ingameNick = args[0];	
	console.log(`addNick() - received ${ingameNick}`);
	if (ingameNick == "help" || ingameNick == "?") {
		replyMsg = `Usage:\n
			!iam <ingame nick>`;
			respond(msg, replyMsg);
			return;
	}
	
	const username = msg.author.username;
	const discordId = msg.author.id;
	const guildName = msg.guild.name || 'Craic';
	
	setIngameNick(discordId, username, ingameNick, guildName)
		.then(res => {
			if (res.rowCount == 0) {
				replyMsg = `No ingame nick added`;
			}
			console.log(`Ingame nick added, result set: ${util.inspect(res)}`);
			replyMsg = `Added ${ingameNick} as ingame nick for user ${username}`;
			respond(msg, replyMsg);
			return;
		})
		.catch(console.error);
}

exports.whois = whois;
exports.addNick = addNick;