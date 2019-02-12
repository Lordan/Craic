const util = require('util');
const helpMsg = require('../tools/helper.js').flareHelp;
const msgRespond = require('../tools/responder.js').respond;
const roleCheck = require('../tools/roles.js').roleCheck;
const defaultCmd = 'announce';
const fileName = "flare";

async function respond(msg, args) {
	const logHead = `${fileName}.${this.name} -`;
	if (msg === null) return;
	let replyMsg = '';
	
	if (args === null || !(args instanceof Array) || args.length == 0) {
		console.log(`${logHead} no args provided, setting it to default sub command`);
		args = [defaultCmd];
	}
	
	const subCmd = args[0];
	const subArgs = args.splice(1);
	
	console.log(`${logHead} received subCmd: ${subCmd}, args: ${subArgs}`);
	
	switch(subCmd.toLowerCase()) {
        case 'help':
		case '?':
            msgRespond(msg, helpMsg);
            break;
		case 'announce':
			await announce(msg).catch(console.error);
        break;
		default:
            msgRespond(msg, `Unknown option\n${helpMsg}`);
	}	
}

async function announce() {
	const logHead = `${fileName}.${this.name} -`;
	const announceChannelName = 'general'
	const generalChan = msg.member.guild.channels.find(ch => ch.name == announceChannelName);
	if (!generalChan) {
		console.error(`${logHead} failed to find channel ${announceChannelName}`);
		return;
	}
	generalChan.send(`@everyone flare up, have fun and hit it hard!`);
}

exports.respond = respond;