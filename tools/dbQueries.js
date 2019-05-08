exports.userQueries = {
	'getIngameNickByUsername' 	: 	'SELECT u.ingame_nick FROM users AS u WHERE u.user_name = $1',
	'getIngameNickByDiscordId'	: 	'SELECT u.ingame_nick FROM users AS u WHERE u.discord_id = $1',
	'getUsernameByIngameNick'	: 	'SELECT u.user_name FROM users AS u WHERE u.ingame_nick = $1',
	'getUsernameByUserId'		: 	'SELECT u.user_name FROM users AS u WHERE u.id = $1',
	'getUserIdByDiscordId'		:	'SELECT u.id FROM users AS u WHERE u.discord_id = $1',
	'setIngameNick'				: 	'INSERT INTO users (discord_id, user_name, ingame_nick, guild) VALUES ($1, $2, $3, $4) ON CONFLICT (discord_id) DO UPDATE SET ingame_nick = EXCLUDED.ingame_nick',
	'getAllUsers'				:	'SELECT u.user_name, u.ingame_nick FROM users AS u',
	'getAllActiveUsers'			:	'SELECT u.user_name, u.ingame_nick FROM users AS u WHERE active = true',
	'setActivity'				:	'UPDATE users SET active = $2 WHERE user_name = $1'
}

exports.statsQueries = {
	'setMinimumStats'			: 	'INSERT INTO stats (user_id, walkers_killed, missions_played, survivors_rescued, reported) VALUES ($1, $2, $3, $4, NOW())'
}

exports.tileQueries = {
	'setTile'					:	'INSERT INTO tiles (user_id, tile, reported) VALUES ($1, $2, NOW())',
	'getTile'					:	'SELECT t.user_id FROM tiles AS t WHERE t.tile = $1',
	'getAllTiles'				:	'SELECT t.user_id, t.tile FROM tiles AS t',
	'clearTile'					:	'DELETE FROM tiles WHERE tiles.user_id = $1 AND tiles.tile = $2',
	'clearAllTiles'				:	'DELETE FROM tiles'
}

