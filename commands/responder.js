function respond(receivedMsg, response) {
	receivedMsg.author.createDM()
		.then((dmChannel) => {
			response = response || 'Something went wrong, please try again!';
			dmChannel.send(response)
				.catch(console.error);
		})
		.catch(console.error);
}

exports.respond = respond;