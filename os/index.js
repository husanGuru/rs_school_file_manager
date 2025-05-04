import os from 'os';
import cpus from './cpus.js';
import { MESSAGES } from '../messages/index.js';

export default function osOperations(operation) {
    switch (operation) {
        case '--EOL': {
            MESSAGES.info(JSON.stringify(os.EOL));
            break;
        }
        case '--cpus': {
            cpus();
            break;
        }
        case '--homedir': {
            MESSAGES.info(os.homedir());
            break;
        }
        case '--username': {
            MESSAGES.info(os.userInfo().username);
            break;
        }
        case '--architecture': {
            MESSAGES.info(os.arch());
            break;
        }
        default:
            break;
    }
    MESSAGES.pwd();
}