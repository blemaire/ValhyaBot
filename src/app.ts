// @ts-ignore
import { Client, Collection, ClientApplication, TextChannel, Message, GuildMember } from 'discord.js';
// import path from 'path';
// import fs from 'fs';
import { IConfig } from './config';
import * as commands from './commands';
import { ICommand } from './commands/command';

export class App {
    private commands = new Collection<string, ICommand>();

    constructor(private config: IConfig) { };

    public start() {
        const client = new Client();

        for (const Command of Object.values(commands)) {
            const com = new Command(client);
            this.commands.set(com.command, com);
        }

        client
            .on('message', (message) => {
                this.runCommand(message);
            })
            .on('ready', () => {
                client.user?.setStatus("online");
                client.user?.setActivity(this.config.PREFIX, { type: 'LISTENING' });
            })
            .login(this.config.TOKEN)
            ;
    }

    private runCommand(message: Message): void {
        if (!message.content.startsWith(this.config.PREFIX) || message.author.bot) {
            return;
        }

        const [command, ...args] = message.content.slice(this.config.PREFIX.length).trim().split(/ /);

        if (!this.commands.has(command)) {
            message.channel.send(`"${command}" n'est pas une commande valide.`);
            return;
        }

        const currentCommand = this.commands.get(command) as ICommand;

        if (!message.member || !this.isAuthorised(message.member, currentCommand)) {
            message.channel.send("Tu n'est pas autorisé a faire ca !");
            return;
        }

        if (!this.isCorrectlyUsed(currentCommand, ...args)) {
            let response = `${message.author.username}, voici comment ca marche: \n`;
            response += `${this.config.PREFIX} ${currentCommand.command} ${currentCommand.usage}`;
            message.channel.send(response);

            return;
        };

        currentCommand.run(message, ...args);
    }

    /**
     * Validate that the command is being used correctly.
     */
    private isCorrectlyUsed(command: ICommand, ...args: string[]): boolean {
        // @ts-ignore:next-line
        return !command.args || (args && args.length > 0);
    }

    /**
     * Validate if the command can be run by the sender.
     */
    protected isAuthorised(member: GuildMember, command: ICommand): boolean {
        return command.roles.length === 0 || command.roles.some(role => member.hasPermission(role));
    }
}
