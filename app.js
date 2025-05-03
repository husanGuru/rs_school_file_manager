import os from 'os';
import { isDirectory, isPathExists, isValidCommand, MESSAGES } from './utils.js';

import path from 'path';
import fs, { createReadStream, createWriteStream } from 'fs';
import { readdir, mkdir, writeFile, rename, unlink } from 'fs/promises';
import { createHash } from 'crypto';
import zlib from 'zlib';

const username = process.argv[2]?.split('=')[1];

if (!username) {
    MESSAGES.error('Username is not specified (npm run start -- --username=your_username)');
    process.exit();
}

console.log(`Welcome to the File Manager, ${username}!`);

// const rs = createReadStream();

process.on('SIGINT', () => {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
    process.exit();
});

// process.stdin.resume();
process.chdir(os.homedir());

MESSAGES.pwd();
MESSAGES.prompt();

process.stdin.on('data', async (data) => {
    try {
        let cmd = data.toString().trim();

        if (isValidCommand(cmd)) {
            const cmdArr = cmd.split(' ');
            let cmdValue = cmdArr[0];
            let cmdArg = cmdArr.slice(1).join(' ');
            switch (cmdValue) {
                case 'up': {
                    process.chdir('..');
                    break;

                }
                case 'cd': {
                    if (!cmdArg) {
                        MESSAGES.invalidInput();

                    } else {
                        process.chdir(cmdArg);
                    }

                    break;
                }
                case 'ls': {

                    let res = await readdir(process.cwd());
                    let table = await Promise.all(res.map(async item => {
                        try {

                            const type = (await isDirectory(item)) ? 'directory' : 'file';
                            return ({ Name: item, Type: type });
                        } catch (err) {
                            return ({ Name: item, Type: 'directory' }); //Windows 'System Volume Information' fallback
                        }

                    }
                    ));

                    console.table(table);
                    break;

                }
                case 'cat': {
                    const isFileExists = await isPathExists(cmdArg);
                    if (!isFileExists) {
                        throw new Error('File does not exist');
                    }

                    const rs = createReadStream(cmdArg);
                    rs.on('data', (chunk) => {
                        process.stdout.write(chunk);
                    });
                    rs.on('end', () => {
                        process.stdout.write('\n');
                    });

                    break;

                }

                case 'add': {

                    await writeFile(cmdArg, '', { flag: 'a' });
                    break;
                }

                case 'mkdir': {
                    await mkdir(cmdArg);
                    break;

                }

                case 'rn': {
                    const filePath = cmdArg.split(' ')[0];
                    const isFileExists = await isPathExists(filePath);
                    if (!isFileExists) {
                        throw new Error('File does not exist');
                    }
                    const newFileName = cmdArg.split(' ')[1];
                    await rename(filePath, newFileName);
                    break;

                }

                case 'cp': {
                    const filePath = cmdArg.split(' ')[0];
                    const isFileExists = await isPathExists(filePath);
                    if (!isFileExists) {
                        throw new Error('File does not exist');
                    }
                    const newFilePath = path.resolve(cmdArg.split(' ')[1], filePath);

                    const rs = createReadStream(filePath);
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
                        MESSAGES.success("File copy completed");

                    });

                    break;
                }

                case 'mv': {
                    const filePath = cmdArg.split(' ')[0];
                    const isFileExists = await isPathExists(filePath);
                    if (!isFileExists) {
                        throw new Error('File does not exist');
                    }
                    const newFilePath = path.resolve(cmdArg.split(' ')[1], filePath);

                    const rs = createReadStream(filePath);
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

                    ws.on('finish', async () => {
                        await unlink(filePath);
                        MESSAGES.success("File move completed");

                    });

                    break;
                }


                case 'rm': {
                    const isFileExists = await isPathExists(cmdArg);
                    if (!isFileExists) {
                        throw new Error('File does not exist');
                    }

                    await unlink(cmdArg);
                    break;
                }
                case 'os': {

                    switch (cmdArg) {
                        case '--EOL': {
                            MESSAGES.info(JSON.stringify(os.EOL));
                            break;
                        }
                        case '--cpus': {
                            const cpus = os.cpus();

                            let cpuInfo = cpus.map(cpu => ({
                                model: cpu.model,
                                clockRate: cpu.speed
                            }));
                            MESSAGES.info(`Total amount of CPUs: ${cpus.length}`);

                            console.table(cpuInfo);
                            break;
                        }
                        case '--homedir': {
                            MESSAGES.info(os.homedir());

                            break;
                        }
                        case '--username': {
                            MESSAGES.info(os.userInfo().username);
                            break;
                        }
                        case '--architecture': {
                            MESSAGES.info(os.arch());
                            break;
                        }


                        default:
                            break;
                    }

                    break;
                }
                case 'hash': {
                    const isFileExists = await isPathExists(cmdArg);
                    if (!isFileExists) {
                        throw new Error('File does not exist');
                    }
                    const rs = createReadStream(cmdArg);
                    const hash = createHash('sha256');

                    rs.on('data', (data) => {
                        hash.update(data);

                    });
                    rs.on('end', () => {
                        console.log(hash.digest('hex'));
                    });
                    break;
                }
                case 'compress': {
                    const filePath = cmdArg.split(' ')[0];
                    const isFileExists = await isPathExists(filePath);
                    if (!isFileExists) {
                        throw new Error('File does not exist');
                    }
                    const destPath = path.resolve(cmdArg.split(' ')[1]);

                    const rs = createReadStream(filePath);
                    const ws = createWriteStream(destPath);

                    const brotliCompress = zlib.createBrotliCompress();

                    rs.pipe(brotliCompress)
                        .pipe(ws)
                        .on('finish', () => {
                            MESSAGES.success(`File compressed successfully`);
                        })
                        .on('error', (err) => {
                            MESSAGES.error();
                            MESSAGES.error('File compression failed, make sure you passed correct destination (e.g. file.txt.br)');
                            console.log(err);
                        });

                    break;
                }
                case 'decompress': {

                    const filePath = cmdArg.split(' ')[0];
                    const isFileExists = await isPathExists(filePath);
                    if (!isFileExists) {
                        throw new Error('File does not exist');
                    }
                    const destPath = path.resolve(cmdArg.split(' ')[1]);

                    const rs = createReadStream(filePath);
                    const ws = createWriteStream(destPath);

                    const brotliDecompress = zlib.createBrotliDecompress();

                    rs.pipe(brotliDecompress)
                        .pipe(ws)
                        .on('finish', () => {
                            MESSAGES.success(`File decompressed successfully`);
                        })
                        .on('error', (err) => {
                            MESSAGES.error();
                            MESSAGES.error('File decompression failed, make sure you passed correct destination (e.g. file.txt)');

                            console.log(err);
                        });


                    break;
                }
                default:
                    break;
            }



        } else {
            MESSAGES.invalidInput();
        }

        MESSAGES.pwd();

    } catch (err) {
        MESSAGES.error();
        if (err.message) {
            MESSAGES.error(err.message);
        }

        console.log(err);


    }
});



