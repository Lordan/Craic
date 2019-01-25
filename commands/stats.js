const util = require('util')
const dataHandler = require('../tools/dataHandler.js');
const msgRespond = require('../tools/responder.js').respond;

function respond(msg, args) {
	if (msg === null) return;
	let replyMsg = '';
	
	if (args === null || !(args instanceof Array) || args.length == 0) {
		console.log(`Member: ${util.inspect(msg.member)}`);
		if (msg.member && msg.member.roles) console.log(`Roles: ${util.inspect(msg.member.roles)}`);
		//get the stats from last term
		replyMsg = `normally some stats`;
		console.log(replyMsg);
		msgRespond(msg, replyMsg);
		return;
	}
	const subCmd = args[0];
	const subArgs = args.splice(1);
	
	if (subCmd == "help" || subCmd == "?") {
		replyMsg = `Usage:\n
!stats\n
\tshows the stats of the latest term\n
!stats add <kills> <missions played> <survivors>\n
\tadd the given numbers for the current term and your user.\n 
\te.g. !stats add 123456 23456 3456 for 123456 kills, 23456 missions played and 3456 survivors rescued`;
			respond(msg, replyMsg);
			return;
	}
}

exports.respond = respond;