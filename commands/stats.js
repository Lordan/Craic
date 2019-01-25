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
}

exports.respond = respond;