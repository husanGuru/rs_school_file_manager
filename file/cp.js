import { createReadStream, createWriteStream } from "fs";
import { MESSAGES } from "../messages/index.js";
import { isPathExists } from "../utils/index.js";
import path from "path";

export default async function cp(file, dir) {
    const isFileExists = await isPathExists(file);
    if (!isFileExists) {
        throw new Error('File does not exist');
    }
    const newFilePath = path.resolve(dir, file);

    const rs = createReadStream(file);
    const ws = createWriteStream(newFilePath);

    rs.pipe(ws);

    rs.on('error', (err) => {
        MESSAGES.error();
        MESSAGES.error(err.message);
    });

    ws.on('error', (err) => {
        MESSAGES.error();
        MESSAGES.error(err.message);
    });

    ws.on('finish', () => {
        MESSAGES.success(`File (${file}) was copied successfully`);
        MESSAGES.pwd();
    });
}