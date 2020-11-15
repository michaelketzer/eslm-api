import fs from 'fs/promises';
import chalk from 'chalk';

const BASE_LOCATION = __dirname + '/../../static';

export enum Location {
    STRATZ_MATCH = '/stratz/match/',
}

export async function fileStream(filename: string | number, location: Location, data: string): Promise<void> {
    const fileLoc = BASE_LOCATION + location + filename + '.json';

    try {
        return fs.writeFile(fileLoc, data, 'utf-8');
    } catch(err) {
        console.log(chalk.red(`Failed to write [${fileLoc}] - err`));
    }
}