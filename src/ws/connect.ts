import {
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Resource } from "sst";

let dyna = new DynamoDBClient();
export async function handler(event: any) {
    const clientID = event?.queryStringParameters?.clientID || "none";

    const connectionId = event["requestContext"]["connectionId"];

    console.log("connected>>>");
    console.log("clinetID", clientID, "connectionID", connectionId);
    console.log("<<<connected");

    let newItem = await dyna
        .send(
            new PutItemCommand({
                TableName: Resource.ConnectionsTable.name,
                Item: marshall({
                    itemID: connectionId,
                    clientID: clientID,
                }),
            })
        )
        .then(async (result) => {
            return await dyna
                .send(
                    new GetItemCommand({
                        TableName: Resource.ConnectionsTable.name,
                        Key: marshall({
                            itemID: connectionId,
                        }),
                    })
                )
                .then((r: any) => {
                    return unmarshall(r.Item);
                });
        });

    console.log("connect", connectionId, newItem);

    // Resource.ConnectionsTable
    //

    return {
        statusCode: 200,
        body: JSON.stringify("success"),
    };
}
