import SteamID from 'steamid';
import { getStratzMatch } from '../entity/stratz/match';
import { StratzMatch } from '../stratz/match';

export interface HeroStats {
    picks: {
        games: number;
        won: number;
        phase1: number;
        phase2: number;
        phase3: number;
    };
    bans: {
        games: number;
        phase1: number;
        phase2: number;
        phase3: number;
    };
}

export function requireHeroStats(heroId: number, stats: {[x: string]: HeroStats}): HeroStats {
    if(!stats[heroId]) {
        stats[heroId] = {
            picks: {
                games: 0,
                won: 0,
                phase1: 0,
                phase2: 0,
                phase3: 0,
            },
            bans: {
                games: 0,
                phase1: 0,
                phase2: 0,
                phase3: 0,
            },
        };
    }

    return stats[heroId];
}

export function getPhase(order: number, gameVersion: number): number {
    if(gameVersion <= 131) {
        return order < 12 ? 1 : (order < 18 ? 2 : 3);
    }
    return order < 8 ? 1 : (order < 18 ? 2 : 3);
}

function parsePickBans(match: StratzMatch, teamId: number, dataObj: {[x: string]: HeroStats}): void {
    const {pickBans, radiantTeamId, didRadiantWin} = match;
    const wasRadiant = teamId === radiantTeamId;
    const won = didRadiantWin === wasRadiant;

    pickBans.forEach(({order, isPick, heroId, isRadiant}) => {
        const stats = requireHeroStats(heroId, dataObj);
        const type = isPick ? 'picks' : 'bans';
        if((isPick && wasRadiant === isRadiant) || (!isPick && wasRadiant !== isRadiant)) {
            stats[type].games = stats[type].games + 1;
            if(type === 'picks') {
                stats[type].won = stats[type].won + (won ? 1 : 0);
            }
            const phase = getPhase(order, match.gameVersionId);
            if(phase === 1) {
                stats[type].phase1 = stats[type].phase1 + 1;
            } else if(phase === 2) {
                stats[type].phase2 = stats[type].phase2 + 1;
            } else {
                stats[type].phase3 = stats[type].phase3 + 1;
            }
        }
    });
}

export async function topPickBansParser(matchIds: number[], teamId: number): Promise<{[x: string]: HeroStats}> {
    const stats: {[x: string]: HeroStats} = {};
    for(const match of matchIds) {
        const matchData = await getStratzMatch(match);
        if(matchData) {
            parsePickBans(matchData, teamId, stats);
        }
    }
    return stats;
}

export interface PlayerHeroStats {
    [x: string]: {
        [x: string]: {
            won: number;
            games: number;
        };
    };
}


export function requirePlayerHeroStats(playerId: number, heroId: number, stats: PlayerHeroStats): PlayerHeroStats[0][0] {
    if(!stats[playerId]) {
        stats[playerId] = {};
    }

    if(!stats[playerId][heroId]) {
        stats[playerId][heroId] = {
            won: 0,
            games: 0,
        };
    }

    return stats[playerId][heroId];
}

function parsePlayerPicks(match: StratzMatch, teamId: number, dataObj: PlayerHeroStats): void {
    const {players, radiantTeamId, didRadiantWin} = match;
    const wasRadiant = teamId === radiantTeamId;
    const won = didRadiantWin === wasRadiant;

    players.forEach(({steamAccountId, heroId, isRadiant}) => {
        var sid = new SteamID(`[U:1:${steamAccountId}]`);
        if(wasRadiant === isRadiant) {
            const stats = requirePlayerHeroStats(+sid.getSteamID64(), heroId, dataObj);
            stats.games = stats.games + 1;
            stats.won = stats.won + (won ? 1 : 0);
        }
    });
}

export async function playerTopHeroesForTeam(matchIds: number[], teamId: number): Promise<PlayerHeroStats> {
    const stats: PlayerHeroStats = {};
    for(const match of matchIds) {
        const matchData = await getStratzMatch(match);
        if(matchData) {
            parsePlayerPicks(matchData, teamId, stats);
        }
    }
    return stats;
}