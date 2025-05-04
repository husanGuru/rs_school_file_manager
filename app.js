import os from 'os';
import { isValidCommand } from './utils/index.js';
import { MESSAGES } from './messages/index.js';

import { add, cat, cd, cp, ls, mkdir, mv, rm, rn, up } from './file/index.js';
import osOperations from './os/index.js';
import compress from './compression/compress.js';
import decompress from './compression/decompress.js';
import hash from './hash/hash.js';


const username = process.argv[2]?.split('=')[1];
if (!username) {
    MESSAGES.error('Username is not specified (npm run start -- --username=your_username)');
    process.exit(0);
}
MESSAGES.welcome(username);

process.on('SIGINT', () => {
    MESSAGES.exit(username);
    process.exit(0);
});

process.chdir(os.homedir());

MESSAGES.pwd();
MESSAGES.prompt();

process.stdin.setEncoding('utf8');
process.stdin.on('data', async (data) => {
    try {
        let cmd = data.trim();

        if (cmd === '.exit') {
            MESSAGES.exit(username);
            process.exit(0);
        }

        if (isValidCommand(cmd)) {
            const cmdArr = cmd.split(' ');
            let cmdValue = cmdArr[0];
            let cmdArg = cmdArr.slice(1).join(' ');
            switch (cmdValue) {
                case 'up': {
                    up();
                    break;
                }
                case 'cd': {
                    cd(cmdArg);
                    break;
                }
                case 'ls': {
                    await ls();
                    break;
                }
                case 'cat': {
                    await cat(cmdArg);
                    break;
                }
                case 'add': {
                    await add(cmdArg);
                    break;
                }
                case 'mkdir': {
                    await mkdir(cmdArg);
                    break;
                }
                case 'rn': {
                    await rn(cmdArg.split(' ')[0], cmdArg.split(' ')[1]);
                    break;
                }
                case 'cp': {
                    await cp(cmdArg.split(' ')[0], cmdArg.split(' ')[1]);
                    break;
                }

                case 'mv': {
                    await mv(cmdArg.split(' ')[0], cmdArg.split(' ')[1]);
                    break;
                }
                case 'rm': {
                    await rm(cmdArg);
                    break;
                }
                case 'os': {
                    osOperations(cmdArg);
                    break;
                }
                case 'hash': {
                    await hash(cmdArg);
                    break;
                }
                case 'compress': {
                    await compress(cmdArg.split(' ')[0], cmdArg.split(' ')[1]);
                    break;
                }
                case 'decompress': {
                    await decompress(cmdArg.split(' ')[0], cmdArg.split(' ')[1]);
                    break;
                }
                default:
                    break;
            }
        } else {
            MESSAGES.invalidInput();
        }

    } catch (err) {
        MESSAGES.error();
        if (err.message) {
            MESSAGES.error(err.message);
        }
    }
});


process.stdin.resume();