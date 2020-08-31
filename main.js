const { Client, Collection } = require('discord.js');
const config = require('./config.json');
const fs = require('fs');

const client = new Client();
client.commands = new Collection();

function loadCommands(dir = __dirname + "/commands/") 
{
    fs.readdirSync(dir).forEach(
        dirs =>
        {
            const commands = fs.readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));

            for (const file of commands)
            {
                const getFileName = require(`${dir}/${dirs}/${file}`);
                
                client.commands.set(getFileName.help.name, getFileName);
                
                console.log(`Commande chargée: ${config.PREFIX}${getFileName.help.name}`);
            }
        }
    );
};

loadCommands();

client.on('message',
    message => 
    {
        if(!message.content.startsWith(config.PREFIX) || message.author.bot) return;
        
        const args = message.content.slice(config.PREFIX.length).split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (!client.commands.has(commandName)) return;
        const command = client.commands.get(commandName);

        if (command.help.args && !args.length)
        {
            let noArgsReply = `Il faut des arguments pour cette commande, ${message.author}`;

            if (command.help.usage)
            {
                noArgsReply += `\nVoici comment utiliser cette commande: \`${config.PREFIX}${command.help.name} ${command.help.usage}\``
            }
            return message.channel.send(noArgsReply);
        }
        command.run(client, message, args);
    }
);
client.on('ready',
    () =>
    {
        console.log(`Logged in as ${client.user.username} !`);
        client.user.setStatus("online");
        client.user.setActivity("Bot en construction !", { type: "STREAMING", url: "https://www.twitch.tv/valhyan" });
    }
);
client.login(config.TOKEN);