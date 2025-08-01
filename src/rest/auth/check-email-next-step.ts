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
    //

    let inbound = JSON.parse(event.body);

    let found: { Items: any[] } | any = await dyna.send(
        new ScanCommand({
            TableName: Resource.UserTable.name,
            ExpressionAttributeValues: marshall({
                ":email": inbound.email,
            }),
            FilterExpression: "email = :email",
        })
    );

    if (found?.Items?.length === 0) {
        // send email

        let pinVerify = `${randomize("0", 4)}`;

        await dyna.send(
            new PutItemCommand({
                TableName: Resource.UserTable.name,
                Item: marshall({
                    itemID: `${v4()}`,
                    email: `${inbound.email}`,
                    pinVerify: `${pinVerify}`,
                }),
            })
        );

        await sendPinEmail({
            pin: pinVerify,
            email: inbound.email,
        });
        return {
            screen: "show-pin-code-screen",
        };
    } else {
        let user = unmarshall(found.Items[0]);
        console.log(user);

        let userID = user?.itemID;

        let foundCredentials: { Items: any[] } | any = await dyna.send(
            new ScanCommand({
                TableName: Resource.PasskeyCredentialTable.name,
                ExpressionAttributeValues: marshall({
                    ":userID": userID,
                }),
                FilterExpression: "userID = :userID",
            })
        );

        if (foundCredentials?.Items?.length > 0) {
            return {
                screen: "show-passkey-screen",
            };
        } else {
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
                screen: "show-pin-code-screen",
            };
        }
    }
}
