const util = require('util');
const helpMsg = require('../tools/helper.js').flareHelp;
const inviteLink = require('../tools/texts.js').inviteLink;
const channels = require('../tools/channels.js');
const msgRespond = require('../tools/responder.js').respond;
const defaultCmd = 'announce';
const fileName = "flare";

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
		case 'announce':
			announce(msg).catch(console.error);
			break;
		case 'invite':
			sendInviteLink(msg, subArgs).catch(console.error);
			//announce(msg, subArgs).catch(console.error);
			break;
		default:
            await announce(msg, allArgs).catch(console.error);
	}	
}

async function announce(msg, args) {
	const logHead = `${fileName}.announce() -`;
	const announceChannelName = channels.flares;
	const generalChan = msg.member.guild.channels.find(ch => ch.name == announceChannelName);
	if (!generalChan) {
		console.error(`${logHead} failed to find channel ${announceChannelName}`);
		return;
	}
	let announceMsg = `@here flare up, have fun and hit it hard!`;
	
	if (args) {
		let comment = args.join(' ');
		announceMsg += `\nComment: ${comment}`;
	}
	
	generalChan.send(announceMsg).catch(console.error);
}

async function sendInviteLink(msg, args) {	
	const logHead = `${fileName}.sendInviteLink() -`;
	let response = `${inviteLink}\n\n`;
	if (args) {
		let comment = args.join(' ');
		reesponse += `\n\n: ${comment}`;
	}
	msgRespond(msg, response);
}

exports.respond = respond;