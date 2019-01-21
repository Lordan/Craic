const jsonfile = require('jsonfile')
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
		if (msg.guild !== null) {
			replyMsg = `Please do not use the @ prefix for the user to avoid mentioning them. If you want to use <@user> please do so in a DM. Usage !whois <user>, you called with ${args}`;
			respond(msg, replyMsg);
			return;
		}
		//assuming this was a DM
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
				replyMsg = `No ingame nick found for ${userArg}`;
			}
			respond(msg, replyMsg);
			return;
		})
		.catch(console.error) 	
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
		.catch(console.error) 	
}

function addNick(msg, args) {
	if (msg === null) return;
	msg.author.createDM()
		.then((dmChannel) => {
			dmChannel.send(`You called IAM with ${args}`)
				.catch(console.error);
		})
		.catch(console.error);
}

exports.whois = whois;
exports.addNick = addNick;
exports.reverseLookup = reverseLookup;