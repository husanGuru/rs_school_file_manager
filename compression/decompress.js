import { createReadStream, createWriteStream } from 'fs';
import path from 'path';
import zlib from 'zlib';
import { isPathExists } from "../utils/index.js";
import { MESSAGES } from '../messages/index.js';

export default async function decompress(file, dest) {
    const isFileExists = await isPathExists(file);
    if (!isFileExists) {
        throw new Error('File does not exist');
    }

    if (!dest) {
        throw new Error('Destination path is not specified');
    }

    const rs = createReadStream(file);
    const ws = createWriteStream(path.resolve(dest, file.split('/').at(-1).split('.').slice(0, -1).join('.')));

    const brotliDecompress = zlib.createBrotliDecompress();

    rs.pipe(brotliDecompress)
        .pipe(ws)
        .on('finish', () => {
            MESSAGES.success(`File decompressed successfully`);
            MESSAGES.pwd();
        })
        .on('error', (err) => {
            MESSAGES.error();
            MESSAGES.error('File decompression failed, make sure you passed correct destination (e.g. file.txt)');
            console.log(err);
        });
}