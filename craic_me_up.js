const Discord = require('discord.js');
const util = require('util')
const client = new Discord.Client();
const authToken = process.env.CRAICMEUP_TOKEN;
const prefix = "!";
const whoisTools = require('./commands/whois');
const whois = whoisTools.whois;
const addNick = whoisTools.addNick;
const reverseLookup = whoisTools.reverseLookup;
const thisGuild = "Craic";

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// event listener for new members
client.on('guildMemberAdd', member => {
    
    const channel = member.guild.channels.find(ch => ch.name === 'welcome');

    // channel wasn't found on this server
    if (!channel) return;

    channel.send(`Welcome to the craic!, ${member}\nYou can learn about our bots functionality by typing !help in this channel.`);
});

client.on('message', msg => {
  var content = msg.content;
  var author = msg.author;
  
    if (!content.startsWith(prefix) || author.bot) return;
	if (!isGuildMember(msg)) {
		msg.reply("This bot is only for guild members!");
		return;
	}
    
    var args = content.substring(1).split(' ');
    var cmd = args[0];

    args = args.splice(1);
	console.log(`Command ${cmd} received, message.guild: ${msg.guild}, args: ${JSON.stringify(args)}`);
	const guild = msg.guild === null ? thisGuild : msg.guild;
    switch(cmd.toLowerCase()) {
        case 'ping':
            msg.reply(`Pong from ${guild}`);
            break;
        case 'joke':
            msg.reply(`A joke? We don't do jokes here in ${guild}, ${author.username}. Just go and kill some Z's you effing twat!`)
                .catch(console.error);
        break;
        case 'weather':
            msg.reply(`Bloody brilliant indeed, somewhere on this lovely planet at least.`)
                .catch(console.error);
        break;
        case 'shutup':
            msg.react('🤐')
                .catch(console.error);
        break;
		case 'whois':
			whois(msg, args);
		break;
		case 'iam':
			addNick(msg, args);
		break;
		case 'reverseLookup':
			msg.reply(`This command was removed, please use '!whois <ingame nick>' instead`)
                .catch(console.error);
		break;		
		case 'help':
			msg.reply(`Thanks for asking!\n\n
			'!whois': tries to find the ingame nick for a given user or the user for a given ingame nick.\n
			'!iam': sets a given ingame nick for your user\n
			...more to come`)
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
            msg.reply(`No effing clue what you're talking about, ${author.username}. What you mean by '${cmd}'?`)
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
