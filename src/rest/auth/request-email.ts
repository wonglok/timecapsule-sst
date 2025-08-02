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

let dyna = new DynamoDBClient();

export async function handler(event) {
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
        return {
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
