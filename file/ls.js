import { readdir } from 'fs/promises';
import { isDirectory } from '../utils/index.js';
import { MESSAGES } from '../messages/index.js';

export default async function ls() {
    let res = await readdir(process.cwd());
    let table = await Promise.all(res.map(async item => {
        try {
            const type = (await isDirectory(item)) ? 'directory' : 'file';
            return ({ Name: item, Type: type });
        } catch (err) {
            return ({ Name: item, Type: 'directory' }); //Windows 'System Volume Information' fallback
        }
    }
    ));
    console.table(table);
    MESSAGES.pwd();
}