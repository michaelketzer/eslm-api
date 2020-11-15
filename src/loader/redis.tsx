import {createClient} from 'redis';
import { cyan } from 'chalk';

const client = createClient();

client.on('connect', () => {
    console.info(cyan('🗄️ Redis Object Storage registered'));
});
client.on('error', (error) => {
    console.info(cyan('🗄️ Failed to connect to redis:', error));
});