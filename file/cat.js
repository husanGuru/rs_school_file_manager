import { createReadStream } from 'fs';
import { isPathExists } from "../utils/index.js";
import { MESSAGES } from "../messages/index.js";

export default async function cat(file) {
    const isFileExists = await isPathExists(file);
    if (!isFileExists) {
        throw new Error('File does not exist');
    }
    const rs = createReadStream(file);
    rs.on('data', (chunk) => {
        process.stdout.write(chunk);
    });
    rs.on('end', () => {
        process.stdout.write('\n');
        MESSAGES.pwd();
    });
}