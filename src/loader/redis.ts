import {createClient} from 'redis';
import { cyan } from 'chalk';

const client = createClient();

client.on('connect', () => {
    console.info(cyan('🗄️ Redis Object Storage registered'));
});
client.on('error', (error) => {
    console.info(cyan('🗄️ Failed to connect to redis:', error));
});

export async function setObj(key: string, obj: any = null): Promise<void> {
    return new Promise((resolve, reject) => {
        client.set(key, JSON.stringify(obj), (err) => {
            if(err) {
                reject(err);
            }

            resolve();
        })
    });
}

export async function getObj<T>(key: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
        client.get(key, (err, reply) => {
            if(err) {
                reject(err);
            }

            resolve(reply?.length && reply !== 'null' ? JSON.parse(reply) : null);
        })
    });
}
