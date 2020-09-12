import { ICommand, BaseCommand } from "../command";
import { Client, Message, Permissions } from "discord.js";

export class DebugCommand extends BaseCommand implements ICommand {
    public command = 'debug';
    public description = `Change l'etat du bot`;
    public usage = '<argument>';
    public args = true;
    public roles = [Permissions.FLAGS.ADMINISTRATOR];

    constructor(public client: Client) {
        super(client);
    }

    public run(message: Message, ...args: string[]): void {
        switch (args[0]) {
            case "setStatus":
                let str = "";

                for (let i = 1; i < args.length; i++) {
                    str += args[i] + " ";
                }

                str = str.substr(0, str.length - 1);

                this.client.user?.setActivity(str);

                message.channel.send(`Je suis maintenant ${str} !`);
                break;

            case "setStream":
                this.client.user?.setActivity(`${this.client.user.presence.activities[0].name}`, { type: "STREAMING", url: args[1] });

                break;

            default:
                message.channel.send("Liste de commandes disponibles: \n- \`setStatus <status>\` \n- \`setStream\`");
                break;
        }
    }
}