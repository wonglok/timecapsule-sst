// import { processInbound } from './route/processInbound'
import {
    ApiGatewayManagementApiClient,
    PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { LambdaFunctionURLEvent } from "aws-lambda";
import { Resource } from "sst";

let gateway = new ApiGatewayManagementApiClient({
    endpoint: Resource.SocketAPI.managementEndpoint,
});
let dyna = new DynamoDBClient({});

export async function handler(event: LambdaFunctionURLEvent) {
    // console.log(event);
    const connectionId = event["requestContext"]["connectionId"];
    // console.log("default", connectionId);

    let inbound = JSON.parse(event.body);

    console.log(inbound);

    gateway
        .send(
            new PostToConnectionCommand({
                ConnectionId: `${connectionId}`,
                Data: inbound || {},
            })
        )
        .then((r) => {
            console.log("msg successfully sent to", connectionId);
        })
        .catch(async (r) => {
            console.error(r);
        });

    // await processInbound({ inbound, connectionId })

    return {
        statusCode: 200,
        body: JSON.stringify("success"),
    };
}
