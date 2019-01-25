const oneLiner = require('one-liner-joke');
const defaultExcludeTags = {'exclude_tags': ['racist']};

function makeRandomJoke(msg, tag, excludeTags) {
	if (msg === null) return;
	excludeTags = excludeTags || defaultExcludeTags;
	
	let replyMsg = '';
	if ((Math.floor(Math.random() * 10) > 7)) {
		const guild = msg.guild === null ? thisGuild : msg.guild;
		replyMsg = `a joke? We don't do jokes here in ${guild}, ${msg.author.username}. Just go and kill some Z's you effing twat!`;
		msg.reply(replyMsg).catch(console.error);
		return;
	}
	
	//do we have a valid tag?
	if ((typeof tag === 'string' || tag instanceof String) && tag != '') {
		replyMsg = getRandomJokeWithTag(tag, excludeTags);
		msg.reply(replyMsg).catch(console.error);
		return;
	} 
	
	//just a normal, random joke
	replyMsg = getRandomJoke(tag, excludeTags);
	msg.reply(replyMsg).catch(console.error);
	return;

}

function getRandomJoke(excludeTags) {
	return oneLiner.getRandomJoke(excludeTags).body;
}

function getRandomJokeWithTag(tag, excludeTags) {
	return oneLiner.getRandomJokeWithTag(tag, excludeTags).body;
}

exports.makeAJoke = makeRandomJoke;