import { MESSAGES } from "../messages/index.js";

export default function cd(dir) {
    process.chdir(dir);
    MESSAGES.pwd();
}