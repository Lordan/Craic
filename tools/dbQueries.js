exports.userQueries = {
	'getIngameNickByUsername' 	: 'SELECT u.ingame_nick FROM users AS u WHERE u.user_name = $1',
	'getIngameNickByDiscordId'	: 'SELECT u.ingame_nick FROM users AS u WHERE u.discord_id = $1',
	'getUsernameByIngameNick'	: 'SELECT u.user_name FROM users AS u WHERE u.ingame_nick = $1',
	'setIngameNick'				: 'INSERT INTO users (discord_id, user_name, ingame_nick, guild) VALUES ($1, $2, $3, $4) ON CONFLICT (discord_id) DO UPDATE SET ingame_nick = EXCLUDED.ingame_nick'
}

