import { getObj, setObj } from "../../../loader/redis";
import { StratzMatch } from "../../stratz/match";

const getMatchKey = (matchId: number) => `stratz_match_${matchId}`;

export async function getStratzMatch(matchId: number): Promise<StratzMatch | null> {
    return await getObj<StratzMatch>(getMatchKey(matchId));
}

export async function saveStratzMatch(matchId: number, match: StratzMatch): Promise<void> {
    await setObj(getMatchKey(matchId), match);
}