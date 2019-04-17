const util = require('util');
const helpMsg = require('../tools/helper.js').linkHelp;
const inviteLink = require('../tools/texts.js').inviteLink;
const statsLink = require('../tools/texts.js').statsLink;
const msgRespond = require('../tools/responder.js').respond;
const fileName = "link";

async function respond(msg, args) {
	const logHead = `${fileName}.respond() -`;
	if (msg === null) return;
	let replyMsg = '';
	
	if (args === null || !(args instanceof Array) || args.length == 0) {
		console.log(`${logHead} no args provided, setting it to default sub command`);
		args = [defaultCmd];
	}
	
	const allArgs = args.slice(0);
	const subCmd = args[0];
	const subArgs = args.splice(1);
	
	console.log(`${logHead} received subCmd: ${subCmd}, args: ${subArgs}`);
	
	switch(subCmd.toLowerCase()) {
        case '--help':
		case '-h':
		case '?':
            msgRespond(msg, helpMsg);
            break;
		case 'stats':
			sendStatsLink(msg, subArgs).catch(console.error);
			break;
		case 'craic':
			sendInviteLink(msg, subArgs).catch(console.error);
			break;
		default:
            await announce(msg, allArgs).catch(console.error);
	}	
}

async function sendInviteLink(msg, args) {	
	const logHead = `${fileName}.sendInviteLink() -`;
	let response = `${inviteLink}\n\n`;
	if (args) {
		let comment = args.join(' ');
		response += `\n ${comment}\n\n`;
	}
	msgRespond(msg, response);
}

async function sendStatsLink(msg, args) {	
	const logHead = `${fileName}.sendStatsLink() -`;
	let response = `${statsLink}\n\n`;
	if (args) {
		let comment = args.join(' ');
		response += `\n ${comment}\n\n`;
	}
	msgRespond(msg, response);
}

exports.respond = respond;