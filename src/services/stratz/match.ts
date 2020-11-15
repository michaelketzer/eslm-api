import { STRATZ_BASE_URL } from ".";
import { addLeagueMatch, adjustLeagueId } from "../entity/league";
import { saveStratzMatch } from "../entity/stratz/match";
import { fileStream, Location } from "../file";
import { fetchJson } from "../request";
import { resetLeagueData } from "../stats/leagueStats";

//#region <interfaces>
export interface StratzPickBan {
    isPick: boolean;
    heroId: number;
    order: number;
    bannedHeroId: number;
    isRadiant: boolean;
    playerIndex: number;
    wasBannedSuccessfully: boolean;
}

export interface StratzHeroPlayer {
    matchId: number;
    playerSlot: number;
    heroId: number;
    steamAccountId: number;
    isRadiant: boolean;
    numKills: number;
    numDeaths: number;
    numAssists: number;
    leaverStatus: number;
    numLastHits: number;
    numDenies: number;
    goldPerMinute: number;
    experiencePerMinute: number;
    level: number;
    gold: number;
    goldSpent: number;
    heroDamage: number;
    towerDamage: number;
    isRandom: boolean;
    lane: number;
    intentionalFeeding: boolean;
    role: number;
    imp: number;
    award: number;
    item0Id: number;
    item1Id: number;
    item3Id: number;
    item4Id: number;
    behavior: number;
    heroHealing: number;
    roamLane: number;
    isVictory: boolean;
    networth: number;
    neutral0Id: number;
    imp2: number
}

export interface StratzMatch {
    id: number;
    didRadiantWin: boolean;
    durationSeconds: number;
    startDateTime: number;
    clusterId: number;
    firstBloodTime: number;
    lobbyType: number;
    numHumanPlayers: number;
    gameMode: number;
    replaySalt: number;
    isStats: boolean;
    avgImp: number;
    parsedDateTime: number;
    statsDateTime: number;
    leagueId: number;
    radiantTeamId: number;
    direTeamId: number;
    seriesId: number;
    gameVersionId: number;
    regionId: number;
    sequenceNum: number;
    rank: number;
    bracket: number;
    endDateTime: number;
    analysisOutcome: number;
    predictedOutcomeWeight: number;
    pickBans: Array<StratzPickBan>;
    players: Array<StratzHeroPlayer>;
}
//#endregion


export async function streamMatch(matchId: number): Promise<void> {
    const match = await fetchJson<StratzMatch>(STRATZ_BASE_URL + '/match/' + matchId);

    if(match) {
        if(match.leagueId) {
            await addLeagueMatch(match.leagueId, match.id);
            await saveStratzMatch(match.id, match);
            await resetLeagueData(adjustLeagueId(match.leagueId, match.id));
        }

        return await fileStream(matchId, Location.STRATZ_MATCH, JSON.stringify(match));
    }
}