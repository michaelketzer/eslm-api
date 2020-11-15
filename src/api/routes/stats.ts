import { Request, Response, Router } from 'express';
import { getLeagueMatches } from '../../services/entity/league';
import { parseBasicGameData } from '../../services/stats/leagueStats';
const route = Router();

export default (app: Router) => {
    app.use('/stats', route);

    route.get('/league/matchIds/:leagueId', async (req: Request, res: Response) => {
        const matches = await getLeagueMatches(+req.params.leagueId)
        return res.json(matches).status(200);
    });

    route.get('/league/basicMatchData/:leagueId', async (req: Request, res: Response) => {
        const matches = await parseBasicGameData(+req.params.leagueId)
        return res.json(matches).status(200);
    });
}