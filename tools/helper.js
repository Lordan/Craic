const helpTexts = {
 'stats'	: 	`Usage:\n!stats\n\tshows the stats of the latest term\n!stats add number_of_kills number_of_missions_played number_of_survivors\n\tadd the given numbers for the current term and your user.\n\te.g. !stats add 123456 23456 3456 for 123456 kills, 23456 missions played and 3456 survivors rescued`,
 'whois'	: 	`Usage:\n!whois @discord_user\n!whois username\n!whois ingame_nick`,
 'tiles'	: 	`Usage:\n!tiles set tile_number\n\tsets the tile with the given tile number for the user.\n\t\tPlease claim a tile only of you are confident that you can finish the tile in time!\n\tExample: !tiles set 14 will set the tile 14 for the user\n!tiles get tile_number\n\tgets the user for the tile with the given tile number if the tile is already claimed, otherwise tells that it is not claimed yet.\n\t!tiles get all will show all currently claimed tiles\n\!tiles clear tile_number\n\tclears the claim for the tile with the given tile number, for example if the tile is finished or the user cannot finish it.`,
 'flare'	:	`Usage:\n!flare\n\tannounces the flare in the general channel mentioning everyone. Any arguments after !flare will used as a comment and get displayed in the announcement\n!flare invite some_comment\n\tannounces the flare in the guild flare channel including the comment you provided and sends a DM to you with the invite link including the comment again`,
 'link'		:	`Usage:\n!link craic\n\tsends a DM with the short link to join Craic.\n!link stats sends a DM with the link to the stats form`,
 'main'		: 	`thanks for asking! Here's what I can do:\n\n'!whois': tries to find the ingame nick for a given user or the user for a given ingame nick.\n'!iam': sets a given ingame nick for your user\n'!flare': announces the flare in the general channel mentioning everyone\n'!tiles': several commands for managing lone wolf tiles so we do not waste energy.\n'!link': provides different links, e.g. short link to join Craic in the game\n'!stats': !NOT IMPLEMENTED YET! shows the most recent stats\n'!beer': Want a beer, I have one for you! (!guinness if you want the good stuff, we also have !cider)\n'!tea': Want a cuppa, sure, why not! (we also have !coffee, !tae and !caife)\n'!joke': Jokes, sure..but..nobody said something about funny..right?\n			...more to come`
 }
 

exports.statsHelp = helpTexts.stats;
exports.whoisHelp = helpTexts.whois;
exports.mainHelp = helpTexts.main;
exports.tilesHelp = helpTexts.tiles;
exports.flareHelp = helpTexts.flare;
exports.linkHelp = helpTexts.link;