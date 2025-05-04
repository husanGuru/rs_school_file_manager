import { stat } from "fs/promises";
import { COMMANDS } from "./commands.js";

export function isValidCommand(cmd) {
    let cmdValue = cmd.split(' ')[0];
    let cmdArg = cmd.split(' ')[1];
    return COMMANDS.includes(cmdValue)
        && (cmdValue === 'up' || cmdValue === 'ls' || cmdArg);
}

export async function isDirectory(path) {
    return (await stat(path)).isDirectory();
}

export async function isPathExists(f) {
    try {
        await stat(f);
        return true;
    } catch {
        return false;
    }
}