const util = require('util')
const dataHandler = require('../tools/dataHandler.js');
const getUserIdByDiscordId = dataHandler.getUserIdByDiscordId;
const getUsernameByUserId = dataHandler.getUsernameByUserId;
const setTile = dataHandler.setTile;
const clearTile = dataHandler.clearTile;
const getTile = dataHandler.getTile;
const msgRespond = require('../tools/responder.js').respond;
const helpMsg = require('../tools/helper.js').tilesHelp;

async function respond(msg, args) {
	if (msg === null) return;
	let replyMsg = '';
	
	if (args === null || !(args instanceof Array) || args.length == 0) {
		console.log(`Member: ${util.inspect(msg.member)}`);
		msgRespond(msg, `No action provided\n${helpMsg}`);
		return;
	}
	const subCmd = args[0];
	const subArgs = args.splice(1);
	
	switch(subCmd.toLowerCase()) {
        case 'help':
		case '?':
            msgRespond(msg, helpMsg);
            break;
        case 'set':
            let response = await setTileClaim(msg.author.id, subArgs)
			.then(res => {
				msgRespond(msg, response)
			});
        break;
		case 'get':
            await getTileClaim(msg.author.id, subArgs)
			.then(res => {
				msgRespond(msg, `stats successfully added`);
			});
        break;
		case 'clear':
            await clearTileClaim(msg.author.id, subArgs)
			.then(res => {
				msgRespond(msg, `stats successfully added`);
			});
        break;
		default:
            msgRespond(msg, `Unknown option\n${helpMsg}`);
	}			
}

async function setTileClaim(discordId, args) {
	
	if (!args || args.length < 1) {
		console.error(`setTileClaim() - missing argument, ${args}`);
		return Promise.reject(new Error('Insufficient number of arguments'));
	}

	let userId = await getUserId(discordId);
		
	const tileNumber = args[0]; 
	
	let insertResult = await setTile(userId, tileNumber);
	if (insertResult.rowCount == 0) {
			console.error(`setTileClaim() - failed to set tile claim, ${util.inspect(insertResult)}`);
			return Promise.reject(new Error('Failed to set tile claim'));
	}
	return `tile ${tileNumber} successfully claimed`;
}

async function clearTileClaim(discordId, args) {
	
	if (!args || args.length < 1) {
		console.error(`clearTileClaim() - missing argument, ${args}`);
		return Promise.reject(new Error('Insufficient number of arguments'));
	}

	let userId = await getUserId(discordId);
		
	const tileNumber = args[0]; 
	
	let clearClaimResult = await clearTile(userId, tileNumber);
	if (clearClaimResult.rowCount == 0) {
			console.error(`clearTileClaim() - failed to clear tile claim, ${util.inspect(clearClaimResult)}`);
			return Promise.reject(new Error('Failed to clear tile claim'));
	}
	return `tile ${tileNumber} successfully cleared`;
}

async function getTileClaim(discordId, args) {
	
	if (!args || args.length < 1) {
		console.error(`getTileClaim() - missing argument, ${args}`);
		return Promise.reject(new Error('Insufficient number of arguments'));
	}
		
	const tileNumber = args[0]; 
	
	let tileClaimResult = await getTile(tileNumber);
	if (tileClaimResult.rowCount == 0 || !tileClaimResult.rows[0].user_id) {
			return `No claim found for tile ${tileNumber}`;
	}
	const userId = tileClaimResult.rows[0].user_id;
	const userName  = await getUserName(userId);
	return `tile ${tileNumber} is already claimed by claimed ${userName}`;
}

async function getUserId(discordId) {
	let result = await getUserIdByDiscordId(discordId);
	
	if (result.rowCount == 0 || !result.rows[0].id) {
			console.error(`getUserId() - user not found, ${util.inspect(result)}`);
			return Promise.reject(new Error('User not found'));
	}
	
	return result.rows[0].id;	
}

async function getUserName(userId) {
	let result = await getUsernameByUserId(userId);
	
	if (result.rowCount == 0 || !result.rows[0].user_name) {
			console.error(`getUserName() - user not found, ${util.inspect(result)}`);
			return Promise.reject(new Error('User not found'));
	}
	
	return result.rows[0].user_name;	
}

exports.respond = respond;