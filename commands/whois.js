const dataHandler = require('./tools/dataHandler.js');
const setIngameNick = dataHandler.setIngameNick;
const nicksFile = './data/nicks.json'
const usrPrefix = '@';
const usrPostfix = '#';
const respond = require('./responder.js').respond;

function whois(msg, args) {
	if (msg === null) return;
	var replyMsg = '';
	if (args === null || !(args instanceof Array) || args.length == 0) {
		console.error("whois(): args check failed, is Array: " + (args instanceof Array) + " length: " + args.length);
		replyMsg = `No user provided for whois. Usage !whois <user>, you called with ${args}`;
		respond(msg, replyMsg);
		return;
	}
	var userArg = args[0];
	if (userArg.startsWith(usrPrefix)) {
		userArg = userArg.substring(
			userArg.lastIndexOf(usrPrefix) + 1, 
			userArg.lastIndexOf(usrPostfix)
		);	
	}
	jsonfile.readFile(nicksFile)
		.then(nicks => {
			if (nicks.hasOwnProperty(userArg)) {
				replyMsg = `${userArg}'s ingame nick is ${nicks[userArg]}`;
			}
			else {
				//respond with the original parameter
				replyMsg = `No ingame nick found for ${args[0]}`;
			}
			respond(msg, replyMsg);
			return;
		})
		.catch(console.error); 	
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
			replyMsg = `Added ${nick} as ingame nick for user ${user}`;
			respond(msg, replyMsg);
			return;
		})
		.catch(console.error);
}

exports.whois = whois;
exports.addNick = addNick;
exports.reverseLookup = reverseLookup;