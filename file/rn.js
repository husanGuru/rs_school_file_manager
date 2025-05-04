import { rename } from "fs/promises";
import { MESSAGES } from "../messages/index.js";
import { isPathExists } from "../utils/index.js";

export default async function rn(file, newFileName) {
    const isFileExists = await isPathExists(file);
    if (!isFileExists) {
        throw new Error('File does not exist');
    }
    await rename(file, newFileName);

    MESSAGES.success(`File (${file}) was renamed successfully (${newFileName})`);
    MESSAGES.pwd();
}