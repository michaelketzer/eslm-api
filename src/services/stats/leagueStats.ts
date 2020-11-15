import { getObj, setObj } from '../../loader/redis';
import { getLeagueMatches } from '../entity/league';
import { getStratzMatch } from '../entity/stratz/match';
import { StratzPickBan } from '../stratz/match';

const basicGameDataKey = (leagueId: number): string => `league_stats_${leagueId}_base_game_data`;

export interface LeagueStats {
    teams: {
        [x: string]: {
            won: number;
            total: number;
            points: number;
        };
    };

    matches: {
        [x: number]: {
            duration: number;
            teamA: number[];
            teamB: number[];
            winner: number;
            direTeamId: number;
            radiantTeamId: number;
            netTeamA: number;
            date: number | null;
            netTeamB: number;
            pointsA: number;
            pointsB: number;
        }
    }
}

const sortFn = ({playerIndex: a}: StratzPickBan, {playerIndex: b}: StratzPickBan) => a - b;

export async function parseBasicGameData(leagueId: number): Promise<LeagueStats> {
    const data = await getObj<LeagueStats>(basicGameDataKey(leagueId));
    if(data) {
        return data;
    }

    const matches = await getLeagueMatches(leagueId);
    const stats: LeagueStats = {
        matches: {},
        teams: {},
    };
    
    for(const match of matches) {
        const data = await getStratzMatch(match);

        if(!data) {
            continue;
        }
        const wonA = data.didRadiantWin;
        stats.teams[data.radiantTeamId] = {
            won: (stats.teams[data.radiantTeamId]?.won || 0) + (wonA ? 1 : 0),
            total: (stats.teams[data.radiantTeamId]?.total || 0) + 1,
            points: (stats.teams[data.radiantTeamId]?.points || 0) + (wonA ? 3 : 0),
        };
        stats.teams[data.direTeamId] = {
            won: (stats.teams[data.direTeamId]?.won || 0) + (wonA ? 0 : 1),
            total: (stats.teams[data.direTeamId]?.total || 0) + 1,
            points: (stats.teams[data.direTeamId]?.points || 0) + (wonA ? 0 : 3),
        };

        stats.matches[data.id] = {
            duration: data.durationSeconds,
            radiantTeamId: data.radiantTeamId,
            direTeamId: data.direTeamId,
            date: data.startDateTime || null,
            teamA: data.pickBans.sort(sortFn).reduce<number[]>((acc, {isPick, isRadiant, heroId}) => {
                if(isPick && isRadiant) {
                    acc.push(heroId);
                }
                return acc;
            }, []),
            teamB: data.pickBans.sort(sortFn).reduce<number[]>((acc, {isPick, isRadiant, heroId}) => {
                if(isPick && !isRadiant) {
                    acc.push(heroId);
                }
                return acc;
            }, []),
            winner: wonA ? data.radiantTeamId : data.direTeamId,
            netTeamA: data.players.reduce((acc, {isRadiant, networth}) => {
                if(isRadiant) {
                    acc += networth;
                }
                return acc;
            }, 0),
            netTeamB: data.players.reduce((acc, {isRadiant, networth}) => {
                if(!isRadiant) {
                    acc += networth;
                }
                return acc;
            }, 0),
            pointsA: data.players.reduce((acc, {isRadiant, numDeaths}) => acc + (!isRadiant ? numDeaths : 0), 0),
            pointsB: data.players.reduce((acc, {isRadiant, numDeaths}) => acc + (isRadiant ? numDeaths : 0), 0),
        }
    }

    await setObj(basicGameDataKey(leagueId), stats);
    
    return stats;
}

export async function resetLeagueData(leagueId: number) {
    await setObj(basicGameDataKey(leagueId), null);
}