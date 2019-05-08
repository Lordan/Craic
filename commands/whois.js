const util = require('util')
const dataHandler = require('../tools/dataHandler.js');
const helpMsg = require('../tools/helper.js').whoisHelp;
const setIngameNick = dataHandler.setIngameNick;
const getIngameNickByDiscordId = dataHandler.getIngameNickByDiscordId;
const getIngameNickByUsername = dataHandler.getIngameNickByUsername;
const getUsernameByIngameNick = dataHandler.getUsernameByIngameNick;
const getAllActiveUsers = dataHandler.getAllActiveUsers;
const setActivity = dataHandler.setActivity;
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
		respond(msg, helpMsg);
		return;
	}
	
	if (searchParam== "all") {
		await showAllUsers()
				.then(res => {
				msgRespond(msg, res)
			});
	}
	
	if (msg.mentions && msg.mentions.users && msg.mentions.users.size > 0) {
		const discordId = msg.mentions.users.firstKey();	
		const username = msg.mentions.users.first().username;		
		console.log(`whois() - calling getIngameNickByDiscordId`);
		let result = await getIngameNickByDiscordId(discordId);
		if (result.rowCount > 0) {
				replyMsg = `${username}'s ingame nick is ${result.rows[0].ingame_nick}`;
		}
	} else {
		
		//try to get an username out of the search param
		const parsedParam = parseSearchParam(searchParam);
		console.log(`whois() - calling getIngameNickByUsername`);
		let result = await getIngameNickByUsername(parsedParam);
		if (result.rowCount > 0) {				
			replyMsg = `${searchParam}'s ingame nick is ${result.rows[0].ingame_nick}`;
		} else {
			//we might have a whois with ingame nick as search parameter
			console.log(`whois() - calling getUsernameByIngameNick`);
			result = await getUsernameByIngameNick(parsedParam);
			if (result.rowCount > 0) {				
				replyMsg = `${searchParam}'s username is ${result.rows[0].user_name}`;
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

function changeActivityStatus(active) {
	return function(msg, args) {
		if (msg === null || msg.author === null) return;
		let replyMsg = '';
		if (args === null || !(args instanceof Array) || args.length == 0) {
			console.error("changeActivityStatus(): args check failed, is Array: " + (args instanceof Array) + " length: " + args.length);
			replyMsg = `No user provided to change activity status to ${active}`;
			respond(msg, replyMsg);
			return;
		}
		let userName = args[0];
		
		setActivity(userName, active)
		.then(res => {
			if (res.rowCount == 0) {
				replyMsg = `Failed to set activity for ${userName} to ${active}`;
			}
			console.log(`Activity set, result set: ${util.inspect(res)}`);
			replyMsg = `Set activity to ${active} for user ${userName}`;
			respond(msg, replyMsg);
			return;
		})
		.catch(console.error);
		
	}
}

async function showAllUsers(msg) {
	
	let allUsersResult = await getAllActiveUsers();
	if (allUsersResult.rowCount == 0 || !allUsersResult.rows[0].user_name) {
			return `No users found!`;
	}
	let users = "";
	for (row of allUsersResult.rows) {
		const userName = row.user_name;
		const ingameNick = row.ingame_nick;
		users += `\t${userName} - ingame nick ${ingameNick}\n`;
	}
	
	return `following users are currently registered:\n ${users}`;
}

exports.whois = whois;
exports.addNick = addNick;
exports.setInactive = changeActivityStatus(false);
exports.setActive = changeActivityStatus(true);