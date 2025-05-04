import { writeFile } from 'fs/promises';
import { MESSAGES } from "../messages/index.js";

export default async function add(file) {
    await writeFile(file, '', { flag: 'a' });
    MESSAGES.success(`New file (${file}) was created successfully`);
    MESSAGES.pwd();
}