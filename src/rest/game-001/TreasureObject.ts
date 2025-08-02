"use server";
//
//        POCUserWorkerTable

import { Resource } from "sst";
import {
    DeleteItemCommand,
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand,
    ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamoDB = new DynamoDBClient();
const DatabaseCollection = Resource.TreasureObjectTable.name;

export const TreasureObjectTable = {
    put: async ({ item }: { item: { itemID: string } | any }) => {
        await dynamoDB.send(
            new PutItemCommand({
                TableName: DatabaseCollection,
                Item: marshall(item, {
                    convertClassInstanceToMap: true,
                    removeUndefinedValues: true,
                }),
            })
        );
    },
    remove: async ({ item }: { item: { itemID: string } | any }) => {
        await dynamoDB.send(
            new DeleteItemCommand({
                TableName: DatabaseCollection,
                Key: marshall({ itemID: item.itemID }),
            })
        );
    },
    get: async ({ item }: { item: { itemID: string } | any }) => {
        return await dynamoDB
            .send(
                new GetItemCommand({
                    TableName: DatabaseCollection,
                    Key: marshall({
                        itemID: item.itemID,
                    }),
                })
            )
            .then((r) => {
                if (r.Item) {
                    return unmarshall(r.Item);
                }
                return undefined;
            })
            .catch((r) => {
                console.error(r);
                return undefined;
            });
    },
    //

    listByFilter: async ({
        var001 = "yo",
        var002 = "yo",
    }: {
        var002: string;
        var001: string;
    }) => {
        return await dynamoDB
            .send(
                new ScanCommand({
                    TableName: DatabaseCollection,
                    FilterExpression: `var001 = :var001 AND var002 = :var002`,
                    ExpressionAttributeValues: {
                        ":var001": {
                            S: `${var001}`,
                        },
                        ":var002": { S: `${var002}` },
                    },
                })
            )
            .then((r) => {
                return (r.Items || [])?.map((r) => unmarshall(r)) || [];
            });
    },

    //
    list: async ({ var001 }: { var001: string }) => {
        return await dynamoDB
            .send(
                new ScanCommand({
                    TableName: DatabaseCollection,
                    FilterExpression: `var001 = :var001`,
                    ExpressionAttributeValues: {
                        ":var001": { S: `${var001}` },
                    },
                })
            )
            .then((r) => {
                return (r.Items || [])?.map((r) => unmarshall(r)) || [];
            });
    },
    //
    listAllInMap: async ({ mapID }: { mapID: string }) => {
        return await dynamoDB
            .send(
                new ScanCommand({
                    TableName: DatabaseCollection,
                    FilterExpression: `mapID = :mapID`,
                    ExpressionAttributeValues: {
                        ":mapID": { S: `${mapID}` },
                    },
                })
            )
            .then((r) => {
                return (r.Items || [])?.map((r) => unmarshall(r)) || [];
            });
    },
};
