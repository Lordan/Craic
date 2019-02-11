const Discord = require('discord.js');
const util = require('util')
const client = new Discord.Client();
const authToken = process.env.CRAICMEUP_TOKEN;
const prefix = "!";
const whoisTools = require('./commands/whois.js');
const whois = whoisTools.whois;
const joker = require('./commands/joker.js');
const stats = require('./commands/stats.js');
const helpMsg = require('./tools/helper.js').mainHelp;
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

    channel.send(`Welcome to the craic!, ${member}\nYou can learn about our bots functionality by typing !help in this channel.\n\nIMPORTAN: please add your ingame nick by using !iam <ingame nick>, thx!`);
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
		case 'tiles'@
			tileManager(msg, args).catch(console.error);
			break;
		case 'whois':
			whois(msg, args).catch(console.error);
		break;
		case 'iam':
			addNick(msg, args);
		break;
		case 'reverseLookup':
			msg.reply(`this command was removed, please use '!whois <ingame nick>' instead`)
                .catch(console.error);
		break;	
		case 'stats':
			stats.respond(msg, args).catch(console.error);
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
