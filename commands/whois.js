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

async function whois(msg, args) {
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
	replyMsg = `Nothing found for ${searchParam}`;
	
	if (searchParam == "help" || searchParam == "?") {
		replyMsg = `Usage:\n
			!whois <@user>\n
			!whois <username>\n
			!whois <ingame nick>`;
			respond(msg, replyMsg);
			return;
	}
	
	if (msg.mentions && msg.mentions.users && msg.mentions.users.size > 0) {
		const discordId = msg.mentions.users.firstKey();		
		console.log(`whois() - calling getIngameNickByDiscordId`);
		let result = awaitgetIngameNickByDiscordId(discordId);
		if (result.rowCount > 0) {
				replyMsg = `${searchParam}'s ingame nick is ${res.rows[0].ingame_nick}`;
		}
	} else {
		
		//try to get an username out of the search param
		const parsedParam = parseSearchParam(searchParam);
		console.log(`whois() - calling getIngameNickByUsername`);
		let result = await getIngameNickByUsername(parsedParam);

		if (res.rowCount > 0) {				
			replyMsg = `${searchParam}'s ingame nick is ${res.rows[0].ingame_nick}`;
		} else {
			//we might have a whois with ingame nick as search parameter
			console.log(`whois() - calling getUsernameByIngameNick`);
			result = await getUsernameByIngameNick(parsedParam);
			if (res.rowCount > 0) {				
				replyMsg = `${searchParam}'s username is ${res.rows[0].user_name}`;
			}
		}
	}	 
	respond(msg, replyMsg)
}

function parseSearchParam(param) {
	if (!param.includes(usrPrefix) || !param.includes(usrPostfix)) return param;
	return param.split(usrPrefix)[1].split(usrPostfix)[0];
}

function parseWhoisResult(res, searchParam) {
	//respond with the original parameter
	let replyMsg = `Nothing found for ${searchParam}`;
	if (res.rowCount > 0) {
		replyMsg = `${searchParam}'s ingame nick is ${res.rows[0].ingame_nick}`;
	}
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
	const guildName = msg.guild ? msg.guild.name : 'Craic';
	
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