// @ts-ignore
import {
    DynamoDBClient,
    PutItemCommand,
    ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
// import Mailgun from "mailgun.js";
import { Resource } from "sst";
import { sendPinEmail } from "./send-pin-email";
import { v4 } from "uuid";
import randomize from "randomatic";
import limiterFnc from "lambda-rate-limiter";
let dyna = new DynamoDBClient();

const limiter = limiterFnc({
    interval: 60 * 1000, // Rate limit interval in ms (e.g., 1 minute)
    uniqueTokenPerInterval: 500, // Max requests per interval
});

export async function handler(event) {
    const userToken = event?.requestContext?.identity?.sourceIp || "anonymous"; // Or another identifier
    await limiter.check(50, userToken);

    let inbound = JSON.parse(event.body);

    let user = await dyna
        .send(
            new ScanCommand({
                TableName: Resource.UserTable.name,
                FilterExpression: "email = :email",
                ExpressionAttributeValues: {
                    ":email": { S: `${inbound.email}` },
                },
            })
        )
        .then((r) => r.Items?.[0] || undefined)
        .then((r) => {
            if (r) {
                return unmarshall(r);
            }
        });

    if (!user) {
        throw {
            ok: false,
        };
    }

    let pinVerify = `${randomize("0", 4)}`;

    await dyna.send(
        new PutItemCommand({
            TableName: Resource.UserTable.name,
            Item: marshall({
                ...user,
                pinVerify: `${pinVerify}`,
            }),
        })
    );

    // send email
    await sendPinEmail({
        pin: pinVerify,
        email: inbound.email,
    });

    return {
        ok: true,
    };
}
