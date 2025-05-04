import os from 'os';
import { MESSAGES } from '../messages/index.js';

export default function cpus() {
    const cpus = os.cpus();

    let cpuInfo = cpus.map(cpu => ({
        model: cpu.model,
        'clock rate (GHz)': cpu.speed / 1000
    }));
    MESSAGES.info(`Total amount of CPUs: ${cpus.length}`);

    console.table(cpuInfo);
}