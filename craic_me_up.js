const Discord = require('discord.js');
const client = new Discord.Client();
const authToken = process.env.CRAICMEUP_TOKEN;
const prefix = "!";
const whois = require('./commands/whois').whois;
const iam = require('./commands/whois').add;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// event listener for new members
client.on('guildMemberAdd', member => {
    
    const channel = member.guild.channels.find(ch => ch.name === 'welcome');

    // channel wasn't found on this server
    if (!channel) return;

    channel.send(`Welcome to the craic!, ${member}`);
});

client.on('message', msg => {
  var content = msg.content;
  var author = msg.author;
  
    if (!content.startsWith(prefix) || author.bot) return;
    
    var args = content.substring(1).split(' ');
    var cmd = args[0];

    args = args.splice(1);
    switch(cmd) {
        case 'ping':
            msg.reply('Pong!');
            break;
        case 'joke':
            msg.reply("A joke? Fuck off " + author.username + " and kill some Z's you fucking twat!")
                .catch(console.error);
        break;
        case 'weather':
            msg.reply("Bloody brilliant indeed, somewhere on this lovely planet at least.")
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
			iam(msg, args);
		break;
        default:
            msg.reply("No effing clue what you're talking about, " + author.username + ". What you mean by '" + cmd + "'?")
                .catch(console.error);
        }
});

console.log('Diving in now...');
client.login(authToken);
