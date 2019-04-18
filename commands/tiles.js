const util = require('util');
const dataHandler = require('../tools/dataHandler.js');
const getUserIdByDiscordId = dataHandler.getUserIdByDiscordId;
const getUsernameByUserId = dataHandler.getUsernameByUserId;
const setTile = dataHandler.setTile;
const clearTile = dataHandler.clearTile;
const clearAllTiles = dataHandler.clearAllTiles;
const getTile = dataHandler.getTile;
const getAllTiles = dataHandler.getAllTiles;
const msgRespond = require('../tools/responder.js').respond;
const helpMsg = require('../tools/helper.js').tilesHelp;
const roleCheck = require('../tools/roles.js').roleCheck;
const fileName = "tiles";

async function respond(msg, args) {
	const logHead = `${fileName}.respond() -`;
	if (msg === null) return;
	let replyMsg = '';
	
	if (args === null || !(args instanceof Array) || args.length == 0) {
		console.log(`${logHead} member: ${util.inspect(msg.member)}`);
		msgRespond(msg, `No action provided\n${helpMsg}`);
		return;
	}
		
	const subCmd = args[0];
	const subArgs = args.splice(1);
	
	console.log(`${logHead} received subCmd: ${subCmd}, args: ${subArgs}`);
	
	switch(subCmd.toLowerCase()) {
        case '--help':
		case '-h':
		case '?':
            msgRespond(msg, helpMsg);
            break;
        case 'set':
            await setTileClaim(msg.author.id, subArgs)
			.then(res => {
				msgRespond(msg, res)
			});
        break;
		case 'get':
			if (subArgs[0] == 'all') {
				await getAllTileClaims()
				.then(res => {
					msg.reply(res)
					.catch(console.error);
				});
			} else {
				await getTileClaim(subArgs)
				.then(res => {
					msg.reply(res)
					.catch(console.error);
				});
			}
        break;
		case 'clear':
            await clearTileClaim(msg.author.id, subArgs)
			.then(res => {
				msgRespond(msg, res);
			});
        break;
		case 'flipped':
			await clearAllTileClaims(msg)
			.then(res => {
				msgRespond(msg, res);
			});
        break;
		default:
			await getAllTileClaims()
				.then(res => {
					msg.reply(res)
					.catch(console.error);
				});
	}			
}

async function setTileClaim(discordId, args) {
	const logHead = `${fileName}.setTileClaim() -`;
	if (!args || args.length < 1) {
		console.error(`${logHead} missing argument, ${args}`);
		return Promise.reject(new Error('Insufficient number of arguments'));
	}

	let userId = await getUserId(discordId);
		
	const tileNumber = args[0]; 
	
	const claimedUserName = await getTileClaimUser(tileNumber);
	if (claimedUserName !== null) {
		return `tile ${tileNumber} already claimed by ${claimedUserName}`;
	}
	
	let insertResult = await setTile(userId, tileNumber);
	if (insertResult.rowCount == 0) {
			console.error(`${logHead} failed to set tile claim, ${util.inspect(insertResult)}`);
			return Promise.reject(new Error('Failed to set tile claim'));
	}
	return `tile ${tileNumber} successfully claimed`;
}

async function clearTileClaim(discordId, args) {
	const logHead = `${fileName}.clearTileClaim() -`;
	if (!args || args.length < 1) {
		console.error(`${logHead} missing argument, ${args}`);
		return Promise.reject(new Error('Insufficient number of arguments'));
	}

	let userId = await getUserId(discordId);
		
	const tileNumber = args[0]; 	
	
	let clearClaimResult = await clearTile(userId, tileNumber);
	if (clearClaimResult.rowCount == 0) {
			console.error(`${logHead} failed to clear tile claim, ${util.inspect(clearClaimResult)}`);
			return Promise.reject(new Error('Failed to clear tile claim'));
	}
	return `tile ${tileNumber} successfully cleared`;
}

async function clearAllTileClaims(msg) {
	const logHead = `${fileName}.clearAllTileClaims() -`;
	if(!roleCheck.isLeader(msg)) {
		return `insufficient priviligies to clear all claims`;
	}	
	
	let clearAllClaimsResult = await clearAllTiles();
	if (clearAllClaimsResult.rowCount == 0) {
			console.error(`${logHead} failed to clear tile claim, ${util.inspect(clearAllClaimsResult)}`);
			return Promise.reject(new Error('Failed to clear tile claim'));
	}
	return `${clearAllClaimsResult.rowCount} claims successfully cleared`;
}


async function getTileClaim(args) {
	const logHead = `${fileName}.getTileClaim() -`;
	if (!args || args.length < 1) {
		console.error(`${logHead} missing argument, ${args}`);
		return Promise.reject(new Error('Insufficient number of arguments'));
	}
		
	const tileNumber = args[0]; 
	
	let tileClaimResult = await getTile(tileNumber);
	if (tileClaimResult.rowCount == 0 || !tileClaimResult.rows[0].user_id) {
			return `No claim found for tile ${tileNumber}`;
	}
	const userId = tileClaimResult.rows[0].user_id;
	const userName  = await getUserName(userId);
	return `tile ${tileNumber} is claimed by ${userName}`;
}

async function getTileClaimUser(tileNumber) {

	let tileClaimResult = await getTile(tileNumber);
	if (tileClaimResult.rowCount == 0 || !tileClaimResult.rows[0].user_id) {
			return null;
	}
	const userId = tileClaimResult.rows[0].user_id;
	const userName  = await getUserName(userId);
	return userName;
}

async function getAllTileClaims() {
	
	let tileClaimResult = await getAllTiles();
	if (tileClaimResult.rowCount == 0 || !tileClaimResult.rows[0].user_id) {
			return `No claims found!`;
	}
	let claims = "";
	for (row of tileClaimResult.rows) {
		const userId = row.user_id;
		const tileNumber = row.tile;
		const userName  = await getUserName(userId);
		claims += `\ttile ${tileNumber} is claimed by ${userName}\n`;
	}
	
	return `following tiles are claimed:\n ${claims}`;
}

async function getUserId(discordId) {
	const logHead = `${fileName}.getUserId() -`;
	let result = await getUserIdByDiscordId(discordId);
	
	if (result.rowCount == 0 || !result.rows[0].id) {
			console.error(`${logHead} user not found, ${util.inspect(result)}`);
			return Promise.reject(new Error('User not found'));
	}
	
	return result.rows[0].id;	
}

async function getUserName(userId) {
	const logHead = `${fileName}.getUserName() -`;
	let result = await getUsernameByUserId(userId);
	
	if (result.rowCount == 0 || !result.rows[0].user_name) {
			console.error(`${logHead} user not found, ${util.inspect(result)}`);
			return Promise.reject(new Error('User not found'));
	}
	
	return result.rows[0].user_name;	
}

exports.respond = respond;