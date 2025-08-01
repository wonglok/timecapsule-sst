import { data2jwt, jwt2data } from "./util/jwt2data2jwt";
import { server } from "@passwordless-id/webauthn";
import { base64url } from "jose";
import { Resource } from "sst";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

let dyna = new DynamoDBClient();

export async function handler(event: any) {
    let { email, challenge, origin, pubKeyCred }: any = JSON.parse(event.body);

    let originalChallenge: string = new TextDecoder().decode(
        base64url.decode(challenge)
    );

    let data = await jwt2data({
        payload: originalChallenge,
        secretKey: Resource.SESSION_SECRET.value,
    });

    if (data.challenge === "challenge") {
        //

        let user = await dyna
            .send(
                new ScanCommand({
                    TableName: Resource.UserTable.name,
                    FilterExpression: "email = :email",
                    ExpressionAttributeValues: {
                        ":email": { S: `${email}` },
                    },
                })
            )
            .then((r) => r.Items?.[0] || undefined)
            .then((r) => {
                if (r) {
                    return unmarshall(r);
                }
            });

        if (user) {
            let creds = await dyna
                .send(
                    new ScanCommand({
                        TableName: Resource.PasskeyCredentialTable.name,
                        FilterExpression: "userID = :userID",
                        ExpressionAttributeValues: {
                            ":userID": { S: `${user.itemID}` },
                        },
                    })
                )
                .then((r) => {
                    return r.Items?.map((r) => unmarshall(r));
                });

            let credObject: any = creds?.find(
                (r) => `${r.credential.id}` === `${pubKeyCred.id}`
            );

            console.log(credObject);

            await server.verifyAuthentication(
                pubKeyCred,
                credObject.credential,
                {
                    origin: origin,
                    challenge: challenge,
                    userVerified: true,
                }
            );

            let jwt = await data2jwt({
                payload: {
                    userID: user.itemID,
                    email: user.email,
                },
                secretKey: Resource.SESSION_SECRET.value,
            });

            return {
                jwt,
                ok: true,
            };
        }

        //
    }

    return;
}
