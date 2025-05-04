import { createReadStream } from 'fs';
import { createHash } from 'crypto';
import { isPathExists } from "../utils/index.js";
import { MESSAGES } from '../messages/index.js';

export default async function hash(file) {
    const isFileExists = await isPathExists(file);
    if (!isFileExists) {
        throw new Error('File does not exist');
    }
    const rs = createReadStream(file);
    const hash = createHash('sha256');

    rs.on('data', (data) => {
        hash.update(data);
    });
    rs.on('end', () => {
        console.log(hash.digest('hex'));
        MESSAGES.pwd();
    });
}