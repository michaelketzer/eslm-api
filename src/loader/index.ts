import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from '../api';
import './redis';

export default async ({ app }: { app: express.Application}) => {
    app.use(cors({
        exposedHeaders: 'Content-Disposition'
    }));
    app.options('*', cors())

    app.use('/static', express.static('static', {
        maxAge: '31536000'
    }));

    /** health check endpoints */
    app.get('/status', (req, res) => res.status(200).end());
    app.head('/status', (req, res) => res.status(200).end());

    app.use(bodyParser.json());
    app.use(routes());
};