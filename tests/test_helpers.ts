import * as fs from 'fs';

export async function eraseStorage (filePath: string) {
    try {
        await fs.promises.unlink(filePath);
    } catch (err) {
    }
}

export function genReminder (notice: string, timeOffset: number = 1000): Object {
    return { time: Date.now() + timeOffset, notice };
}

export async function setStorage (filePath: string, data: string) {
    await fs.promises.writeFile(filePath, data, 'utf8')
}

export async function readStorage (filePath: string): Promise<string> {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return data;
}
