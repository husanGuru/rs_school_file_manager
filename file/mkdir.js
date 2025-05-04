import { mkdir as  fsMkdir } from 'fs/promises';
import { MESSAGES } from "../messages/index.js";

export default async function mkdir(dir) {
    await fsMkdir(dir);
    MESSAGES.success(`New directory (${dir}) was created successfully`);
    MESSAGES.pwd();
}