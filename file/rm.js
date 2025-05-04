import { unlink } from "fs/promises";
import { MESSAGES } from "../messages/index.js";
import { isPathExists } from "../utils/index.js";

export default async function rm(file) {
    const isFileExists = await isPathExists(file);
    if (!isFileExists) {
        throw new Error('File does not exist');
    }

    await unlink(file);
    MESSAGES.success(`File (${file}) was deleted successfully`);
    MESSAGES.pwd();
}