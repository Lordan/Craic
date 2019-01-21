const jsonfile = require('jsonfile')
const nicksFile = './data/nicks.json'
const usrPrefix = '@';


function whois(msg, args) {
	if (msg === null) return;
	var replyMsg = '';
	if (args === null || !(args instanceof Array) || args.length == 0) {
		console.error("whois(): args check failed, is Array: " + (args instanceof Array) + " length: " + args.length);
		replyMsg = `No user provided for whois. Usage !whois <user>, you called with ${args}`;
		respond(msg, replyMsg);
		return;
	}
	if (args[0].startsWith(usrPrefix) {
		replyMsg = `Please do not use the @ prefix for the user to avoid mentioning them. Usage !whois <user>, you called with ${args}`;
		respond(msg, replyMsg);
		return;
	}
	jsonfile.readFile(nicksFile)
		.then(nicks => {
			var usr = args[0];
			if (nicks.hasOwnProperty(usr)) {
				replyMsg = `${usr}'s ingame nick is ${nicks[usr]}`;
			}
			else {
				replyMsg = `No ingame nick found for ${usr}`;
			}
			respond(msg, replyMsg);
			return;
		})
		.catch(console.error) 	
}

function respond(receivedMsg, response) {
	receivedMsg.author.createDM()
		.then((dmChannel) => {
			response = response || 'Something went wrong, please try again!';
			dmChannel.send(response)
				.catch(console.error);
		})
		.catch(console.error);
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