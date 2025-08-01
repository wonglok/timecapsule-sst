// import { processInbound } from './route/processInbound'

import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { Resource } from "sst";

let dyna = new DynamoDBClient();
export async function handler(event: any) {
    //
    const inbound = JSON.parse(event.body);

    let email = inbound.email;

    if (!email) {
        return {
            credIDs: [],
        };
    }

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

    let result = dyna.send(
        new ScanCommand({
            TableName: Resource.PasskeyCredentialTable.name,
            FilterExpression: "userID = :userID",
            ExpressionAttributeValues: {
                ":userID": { S: `${user.itemID}` },
            },
        })
    );

    let results =
        (await result.then((r) => r.Items?.map((r) => unmarshall(r)))) || [];

    let credIDs = results?.map((r) => {
        return r.credential?.id;
    });

    return {
        credIDs: credIDs,
    };
}
