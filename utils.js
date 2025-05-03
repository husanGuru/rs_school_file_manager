import { styleText } from "util";
import { stat } from "fs/promises";

export const COMMANDS = [
    'up',
    'ls',
    'cd',
    'cat',
    'add',
    'mkdir',
    'rn',
    'cp',
    'mv',
    'rm',
    'os',
    'hash',
    'hash',
    'compress',
    'decompress',
];



export const MESSAGES = {
    prompt: () => console.log(`Enter one of the commands (${COMMANDS.map(cmd => styleText('blue', cmd)).join(', ')})`),
    pwd: () => console.log(`You are currently in ${styleText('green', process.cwd())}`),
    error: (msg = 'Operation failed') => console.log(styleText('red', msg)),
    success: (msg) => console.log(styleText('green', msg)),
    info: (msg) => console.log(styleText('blue', msg)),
    invalidInput: () => console.log(styleText('yellow', 'Invalid input')),


};

export function isValidCommand(cmd) {
    let cmdValue = cmd.split(' ')[0];
    let cmdArg = cmd.split(' ')[1];
    return COMMANDS.includes(cmdValue)
        && (cmdValue !== 'up' || cmdValue !== 'ls' || cmdArg);
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