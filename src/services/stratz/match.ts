import { STRATZ_BASE_URL } from ".";
import { fileStream, Location } from "../file";
import { fetchJson } from "../request";


export async function streamMatch(matchId: number): Promise<void> {
    const match = await fetchJson(STRATZ_BASE_URL + '/match/' + matchId);
    
    if(match) {
        return await fileStream(matchId, Location.STRATZ_MATCH, JSON.stringify(match));
    }
}