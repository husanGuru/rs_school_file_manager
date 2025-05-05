import { createReadStream, createWriteStream } from 'fs';
import path from 'path';
import zlib from 'zlib';
import { isPathExists } from "../utils/index.js";
import { MESSAGES } from '../messages/index.js';

export default async function compress(file, dest) {
    const isFileExists = await isPathExists(file);
    if (!isFileExists) {
        throw new Error('File does not exist');
    }

    if (!dest) {
        throw new Error('Destination path is not specified');
    }

    const rs = createReadStream(file);
    const ws = createWriteStream(path.resolve(dest, file + '.br'));

    const brotliCompress = zlib.createBrotliCompress();

    rs.pipe(brotliCompress)
        .pipe(ws)
        .on('finish', () => {
            MESSAGES.success(`File compressed successfully`);
            MESSAGES.pwd();
        })
        .on('error', (err) => {
            MESSAGES.error();
            MESSAGES.error('File compression failed, make sure you passed correct destination (e.g. some_dir)');
            console.log(err);
        });
}