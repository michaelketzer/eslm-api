import chalk from "chalk";
import fetch from 'node-fetch';

export async function fetchJson<T extends object>(url: string): Promise<T | null> {
    const response = await fetch(url);
    if(response.ok) {
        return await response.json();
    }
    console.log(chalk.red(`Request failed [${url}] with response - ${response.status}: ${response.statusText}`));

    return null;
}