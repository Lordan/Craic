const util = require('util');
const helpMsg = require('../tools/helper.js').flareHelp;
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
			
        break;
		default:
            await announce(msg, allArgs).catch(console.error);
	}	
}

async function announce(msg, args) {
	const logHead = `${fileName}.announce() -`;
	const announceChannelName = 'flares'
	const generalChan = msg.member.guild.channels.find(ch => ch.name == announceChannelName);
	if (!generalChan) {
		console.error(`${logHead} failed to find channel ${announceChannelName}`);
		return;
	}
	let announceMsg = `@here flare up, have fun and hit it hard!`;
	let comment = args.join(' ');
	
	if (args) announceMsg += `\nComment: ${comment}`;
	
	generalChan.send(announceMsg).catch(console.error);
}

exports.respond = respond;