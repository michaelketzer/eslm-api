import { getObj, setObj } from "../../loader/redis";

const seasonThreeMatches = new Set<number>([
    5698415534,
    5698406476,
    5698399532,
    5698395456,
    5698336566,
    5698332960,
    5698331543,
    5698342802,
    5698334352,
    5698332470
]);

export function adjustLeagueId(leagueId: number, matchId?: number): number {
    if(matchId && seasonThreeMatches.has(matchId)) {
        return 3;
    }
    return leagueId;
}

const getLeagueMatchesKey = (leagueId: number) => `league_${leagueId}_matches`;

export async function getLeagueMatches(leagueId: number): Promise<number[]> {
    return (await getObj<number[]>(getLeagueMatchesKey(adjustLeagueId(leagueId)))) || [];
}

export async function addLeagueMatch(leagueId: number, matchId: number): Promise<void> {
    const matches = await getLeagueMatches(adjustLeagueId(leagueId, matchId));
    await setObj(getLeagueMatchesKey(adjustLeagueId(leagueId, matchId)), matches.concat(matchId));
}