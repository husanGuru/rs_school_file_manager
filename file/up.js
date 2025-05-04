import { MESSAGES } from "../messages/index.js";

export default function up() {
    process.chdir('..');
    MESSAGES.pwd();
}