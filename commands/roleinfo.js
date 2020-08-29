const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = {
	name: 'roleinfo',
	description: 'Renvoie les information d\'un utilisateur mentionné.',
	execute(client, message, args)
	{
		const role_mention = message.mentions.roles.first();
		const str = role_mention == undefined ? "n'existe pas." : role_mention.name;
		
		const members = role_mention.members.map(m => m.user);
			
		members.forEach(
			m =>
			{
				message.channel.send(m.username, {files: [m.avatarURL()]});
			}
		);
		
		
	}
}