import {
    DeleteItemCommand,
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Resource } from "sst";

let dyna = new DynamoDBClient();

export async function handler(event: any) {
    // console.log(event);
    const connectionId = event["requestContext"]["connectionId"];

    await dyna.send(
        new DeleteItemCommand({
            TableName: Resource.ConnectionsTable.name,
            Key: marshall({
                itemID: connectionId,
            }),
        })
    );

    console.log("disconnect", connectionId);

    return {
        statusCode: 200,
        body: JSON.stringify("success"),
    };
}
