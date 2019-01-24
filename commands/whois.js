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
	
	const searchParam = args[0];
	
	if (msg.mentions && msg.mentions.users) {
		const discordId = msg.mentions.users.firstKey();
		getIngameNickByDiscordId(discordId).then(res => {
			replyMsg = parseWhoisResult(res);
		})
		.catch(e => {
			console.error(e);
			replyMsg = `Failed to retrieve ingame nick, error logged`;
		});
	} else {
		getIngameNickByUsername(searchParam).then(res => {
			//we might have a whois with ingame nick as search parameter
			let finalResult = res;
			if (res.rowCount == 0) {
				getUsernameByIngameNick(searchParam).then(res => {
					finalResult = res;
				})
				.catch(console.error);
			}
			replyMsg = parseWhoisResult(finalResult);
		})
		.catch(e => {
			console.error(e);
			replyMsg = `Failed to retrieve ingame nick, error logged`;
		});
	}
	
	respond(msg, replyMsg);
	return;		 	
}

function parseWhoisResult(res) {
	//respond with the original parameter
	replyMsg = `Nothing found for ${args[0]}`;
	if (res.rowCount > 0) {
		replyMsg = `${searchParam}'s ingame nick is ${res.rows[0].ingameNick}`;
	}
	return replyMsg;		
}

function reverseLookup(msg, args) {
	if (msg === null) return;
	var replyMsg = '';
	if (args === null || !(args instanceof Array) || args.length == 0) {
		console.error("reverseLookup(): args check failed, is Array: " + (args instanceof Array) + " length: " + args.length);
		replyMsg = `No ingame nick provided for reverse lookup. Usage !reverseLookup <ingame nick>, you called with ${args}`;
		respond(msg, replyMsg);
		return;
	}
	
	var nick = args[0];
	jsonfile.readFile(nicksFile)
		.then(users => {
			replyMsg = `Couldn't find the user for the ingame nick ${nick}`;
			
			for (const user in users) {
				if (users[user]== nick) {
					replyMsg = `Found ${user} for the ingame nick ${nick}`;
					break;
				}
			}		
			respond(msg, replyMsg);
			return;
		})
		.catch(console.error); 	
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
	const username = msg.author.username;
	const discordId = msg.author.id;
	const guildName = msg.guild.name || 'Craic';
	
	setIngameNick(discordId, username, ingameNick, guildName)
		.then(res => {
			console.log(`Ingame nick added, result set: ${util.inspect(res)}`);
			replyMsg = `Added ${ingameNick} as ingame nick for user ${username}`;
			respond(msg, replyMsg);
			return;
		})
		.catch(console.error);
}

exports.whois = whois;
exports.addNick = addNick;
exports.reverseLookup = reverseLookup;