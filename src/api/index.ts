import { Router } from 'express';
import baseRoutes from './routes/base';
import stratzRoutes from './routes/stratz';
import statsRoutes from './routes/stats';

export default () => {
	const app = Router();
	
    baseRoutes(app);
    stratzRoutes(app);
    statsRoutes(app);
    
	return app;
}