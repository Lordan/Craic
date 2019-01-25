const util = require('util')
const dataHandler = require('../tools/dataHandler.js');
const getUserIdByDiscordId = dataHandler.getUserIdByDiscordId;
const setMinimumStats = dataHandler.setMinimumStats;
const msgRespond = require('../tools/responder.js').respond;
const helpMsg = require('../tools/helper.js').statsHelp;

async function respond(msg, args) {
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
	
	switch(subCmd.toLowerCase()) {
        case 'help':
		case '?':
            msgRespond(msg, helpMsg);
            break;
        case 'add':
            await addMimimumStats(msg.author.id, subArgs)
			.then(res => {
				msgRespond(msg, `stats successfully added`)
			});
        break;
		default:
            msgRespond(msg, `Unknown option\n${helpMsg}`);
	}			
}

async function addMimimumStats(discordId, args) {
	
	if (args.length < 3) {
		console.error(`addMimimumStats() - insufficient number of arguments, needed 3 got ${args.length}`);
		return Promise.reject(new Error('Insufficient number of arguments'));
	}

	let result = await getUserIdByDiscordId(discordId);
		
	const kills = args[0]; 
	const missions = args[1];
	const survivors = args[2];
	
	if (result.rowCount == 0) {
			console.error(`addMimimumStats() - user not found, ${util.inspect(result)}`);
			return Promise.reject(new Error('User not found'));
	}
	const userId = result.rows[0].id;	
	let insertResult = await setMinimumStats(userId, kills, missions, survivors);
}

exports.respond = respond;