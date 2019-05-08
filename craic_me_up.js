const Discord = require('discord.js');
const util = require('util')
const client = new Discord.Client();
const authToken = process.env.CRAICMEUP_TOKEN;
const prefix = "!";
const whoisTools = require('./commands/whois.js');
const whois = whoisTools.whois;
const tile = require('./commands/tiles.js');
const link = require('./commands/link.js');
const flare = require('./commands/flare.js');
const joker = require('./commands/joker.js');
const stats = require('./commands/stats.js');
const helpMsg = require('./tools/helper.js').mainHelp;
const roleCheck = require('./tools/roles.js').roleCheck;
const addNick = whoisTools.addNick;
const reverseLookup = whoisTools.reverseLookup;
const thisGuild = require('./tools/texts.js').mainGuildName;
const channels = require('./tools/channels.js');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// event listener for new members
client.on('guildMemberAdd', member => {
    
    const channel = member.guild.channels.find(ch => ch.name === channels.welcome);
    // channel wasn't found on this server
    if (!channel) return;
    
	channel.send(`Welcome to ${thisGuild}!, ${member}\nYou can learn about our bots functionality by typing !help in this channel.\n\nIMPORTANT: please add your ingame nick by using !iam your_ingame_nick, thx!`);
	
	//notify the leaders/officers of a new member
	const seriousChan = member.guild.channels.find(ch => ch.name === channels.officers);
	if (!seriousChan) return;
	seriousChan.send(`@leaders ${member} joined the welcome channel. Please verify that it is a guild use and add the 'members' role to their account which will add them to the general channel.`);
});

client.on('message', msg => {
  const content = msg.content;
  const author = msg.author;
  
    if (!content.startsWith(prefix) || author.bot) return;
	if (!isGuildMember(msg)) {
		msg.reply("This bot is only for guild members!");
		return;
	}
    
    let args = content.substring(1).split(' ');
    let cmd = args[0];
	
	if (cmd.trim() == "") {
		cmd = args[1];
		args = args.splice(2);
	} else {
		args = args.splice(1);
	}
	console.log(`Command ${cmd} received, message.guild: ${msg.guild}, args: ${util.inspect(args)}`);
    switch(cmd.toLowerCase()) {
        case 'ping':
            msg.reply(`pong from ${thisGuild}`);
            break;
        case 'joke':
            joker.makeAJoke(msg, args[0]);
        break;
        case 'weather':
            msg.reply(`bloody brilliant indeed, somewhere on this lovely planet at least.`)
                .catch(console.error);
        break;
        case 'shutup':
            msg.react('🤐')
                .catch(console.error);
        break;
		case 'flare':
			if(!roleCheck.isMember(msg) && !roleCheck.isLeader(msg)) {
				msg.reply(`flares can only be announced by guild members, sorry.`)
					.catch(console.error);
				break;
			}
			flare.respond(msg, args).catch(console.error);
			break;
		case 'tiles':	
		case 'tile':
			if(!roleCheck.isMember(msg) && !roleCheck.isLeader(msg)) {
				msg.reply(`claims for tiles can only be set by guild members, sorry.`)
					.catch(console.error);
				break;
			}
			tile.respond(msg, args).catch(console.error);
			break;
		case 'whois':
			if(!roleCheck.isMember(msg) && !roleCheck.isLeader(msg)) {
				msg.reply(`whois is only available to guild members, sorry.`)
					.catch(console.error);
				break;
			}
			whois(msg, args).catch(console.error);
			break;
		case 'iam':
			addNick(msg, args);
		break;
		case 'guinness':
		case 'cider':
		case 'beer':
		case 'pint':
			msg.reply(`here you go 🍺\nSláinte!`)
				.then(sent => {
				sent.react('🍻')
                .catch(console.error)
			})
			.catch(console.error);
		break;	
		case 'tea':
		case 'tae':
		case 'caife':
		case 'coffee':
			msg.reply(`careful, hot! ☕`)
				.catch(console.error);
		break;
		case 'link':
			if(!roleCheck.isMember(msg) && !roleCheck.isLeader(msg)) {
				msg.reply(`short link only available to guild members, sorry.`)
					.catch(console.error);
				break;
			}
			link.respond(msg, args).catch(console.error);
			break;			
		case 'help':
			msg.reply(helpMsg)
                .catch(console.error);
		break;
		case 'debug':
			msg.react('👍');
			console.log("Message details: " + util.inspect(msg));			
			console.log("Message.author: " + util.inspect(author));
			console.log("Mentions.users: " + util.inspect(msg.mentions.users));			
			console.log(`All guilds: ${util.inspect(client.guilds)}`);	
			break;
        default:
            msg.reply(`no effing clue what you're talking about, ${author.username}. What you mean by '${cmd}'?`)
                .catch(console.error);
        }
});

function isGuildMember(msg) {
	if (msg.member && (msg.member.guild.name == thisGuild)) return true;
	for (var [guildId, guild] of client.guilds) {
		const member = guild.member(msg.author);
		if (member) {
			console.log(`User ${msg.author.username} is member of ${guild.name}`);
			return true;
		}
	}
	return false;
}

console.log('Diving in now...');
client.login(authToken);
