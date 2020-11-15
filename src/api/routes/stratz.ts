import { Router, Request, Response } from 'express';
import { streamMatch } from '../../services/stratz/match';
const route = Router();

export default (app: Router) => {
    app.use('/stratz', route);

    route.put('/match/:matchId', async (req: Request, res: Response) => {
        await streamMatch(+req.params.matchId);
        return res.sendStatus(204);
    });
}