import { Client, Message, PermissionResolvable } from "discord.js";

/* class decorator */
export function staticImplements<T>() {
    return <U extends T>(constructor: U) => { constructor };
}

export interface ICommand {
    args: boolean;
    client: Client;
    command: string;
    description: string;
    usage: string;
    roles: PermissionResolvable[];
    run(message: Message, ...args: string[]): void;
}

export abstract class BaseCommand implements Partial<ICommand> {
    constructor(public client: Client) {}
}