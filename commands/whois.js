function whois(msg, args) {
	if (msg === null) return;
	msg.author.createDM()
		.then((dmChannel) => {
			dmChannel.send(`You called WHOIS with ${args}`)
				.catch(console.error);
		})
		.catch(console.error);
}

function add(msg, args) {
	if (msg === null) return;
	msg.author.createDM()
		.then((dmChannel) => {
			dmChannel.send(`You called IAM with ${args}`)
				.catch(console.error);
		})
		.catch(console.error);
}

exports.whois = whois;
exports.iam = add;