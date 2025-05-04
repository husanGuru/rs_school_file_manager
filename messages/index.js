import { styleText } from "util";
import { COMMANDS } from "../utils/commands.js";

export const MESSAGES = {
    welcome: (username) => console.log(`Welcome to the File Manager, ${username}!`),
    prompt: () => console.log(`Enter one of the commands (${COMMANDS.map(cmd => styleText('blue', cmd)).join(', ')})`),
    pwd: () => console.log(`You are currently in ${styleText('green', process.cwd())}`),
    error: (msg = 'Operation failed') => console.log(styleText('red', msg)),
    success: (msg) => console.log(styleText('green', msg)),
    info: (msg) => console.log(styleText('blue', msg)),
    invalidInput: () => console.log(styleText('yellow', 'Invalid input')),
    exit: (username) => console.log(`Thank you for using File Manager, ${styleText('green', username)}, goodbye!`),
};