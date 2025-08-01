"use server";
import { base64url } from "jose";
import { Resource } from "sst";
import { data2jwt } from "./jwt2data2jwt";

export async function getChallenge() {
    return base64url.encode(
        await data2jwt({
            payload: {
                challenge: "challenge",
                timestamp: Date.now(),
            },
            secretKey: Resource.SESSION_SECRET.value,
        })
    );
}
