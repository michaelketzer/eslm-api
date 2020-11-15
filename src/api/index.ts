import { Router } from 'express';
import baseRoutes from './routes/base';
import stratzRoutes from './routes/stratz';

export default () => {
	const app = Router();
	
    baseRoutes(app);
    stratzRoutes(app);
    
	return app;
}