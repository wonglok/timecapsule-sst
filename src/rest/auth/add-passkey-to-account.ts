// @ts-ignore
import {
    DynamoDBClient,
    PutItemCommand,
    ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
// import Mailgun from "mailgun.js";
import { Resource } from "sst";
import { getRandomValues } from "crypto";
import * as jwt from "jsonwebtoken";
import { register } from "@passwordless-id/webauthn/dist/esm/client";
import { base64url } from "jose";
import { jwt2data } from "./util/jwt2data2jwt";
import { verifyRegistration } from "@passwordless-id/webauthn/dist/esm/server";
import { v4 } from "uuid";

let dyna = new DynamoDBClient();

export async function handler(event: any) {
    let {
        jwt,
        info,
        challenge,
        origin,
    }: {
        jwt: string;
        info: any;
        origin: string;
        challenge: string;
    } = JSON.parse(event.body);
    //

    let originalChallenge: string = new TextDecoder().decode(
        base64url.decode(challenge)
    );

    let data = await jwt2data({
        payload: originalChallenge,
        secretKey: Resource.SESSION_SECRET.value,
    });

    if (data.challenge === "challenge") {
        let result = await verifyRegistration(info, {
            origin: origin,
            challenge: challenge,
        });

        let credential = result.credential;

        let user = await jwt2data({
            payload: jwt,
            secretKey: Resource.SESSION_SECRET.value,
        });

        await dyna.send(
            new PutItemCommand({
                TableName: Resource.PasskeyCredentialTable.name,
                Item: marshall({
                    itemID: `${v4()}`,
                    userID: user.userID,
                    credential: credential,
                }),
            })
        );

        return { ok: true };
    } else {
        return { ok: false };
    }
}
