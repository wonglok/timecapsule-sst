import { getChallenge } from "./util/getChallenge";

export async function handler(event) {
    let challenge = await getChallenge();
    return {
        challenge: challenge,
    };
}
