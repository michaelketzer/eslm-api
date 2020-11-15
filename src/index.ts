import config from './config/index';
import express from 'express';
import http from 'http';
import {green} from 'chalk';

async function startServer() {
    const app = express();
    const server  = http.createServer(app);
    await require('./loader').default({app});
    server.listen(config.port, () => {
        console.log(green(`API started on: ${config.port}`));
    });
}

startServer();