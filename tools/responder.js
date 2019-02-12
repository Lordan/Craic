function respond(receivedMsg, response) {

	getDM(receivedMsg).then((dmChannel) => {
			response = response || 'Something went wrong, please try again!';
			dmChannel.send(response)
				.catch(console.error);
		})
		.catch(console.error);
}

async function getDM(receivedMsg) {
	let dmChannel = await receivedMsg.author.createDM();
	return dmChannel;
}

exports.respond = respond;
exports.getDM = getDM;