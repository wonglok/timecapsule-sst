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
const DatabaseCollection = Resource.TreasureMapTable.name;

export const TreasureMapDBOps = {
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

    listByJobPostID: async ({ jobPostID }: { jobPostID: string }) => {
        return await dynamoDB
            .send(
                new ScanCommand({
                    TableName: DatabaseCollection,
                    FilterExpression: `jobPostID = :jobPostID`,
                    ExpressionAttributeValues: {
                        ":jobPostID": { S: `${jobPostID}` },
                    },
                })
            )
            .then((r) => {
                return (r.Items || [])?.map((r) => unmarshall(r)) || [];
            });
    },

    listByWorkerUserIDTelegram: async ({
        workerUserIDTelegram,
        workStatus = "accepted",
    }: {
        workStatus: string;
        workerUserIDTelegram: string;
    }) => {
        return await dynamoDB
            .send(
                new ScanCommand({
                    TableName: DatabaseCollection,
                    FilterExpression: `workerUserIDTelegram = :workerUserIDTelegram AND workStatus = :workStatus`,
                    ExpressionAttributeValues: {
                        ":workerUserIDTelegram": {
                            S: `${workerUserIDTelegram}`,
                        },
                        ":workStatus": { S: `${workStatus}` },
                    },
                })
            )
            .then((r) => {
                return (r.Items || [])?.map((r) => unmarshall(r)) || [];
            });
    },

    //
    listByBossUserIDTelegram: async ({
        bossUserIDTelegram,
    }: {
        bossUserIDTelegram: string;
    }) => {
        return await dynamoDB
            .send(
                new ScanCommand({
                    TableName: DatabaseCollection,
                    FilterExpression: `bossUserIDTelegram = :bossUserIDTelegram`,
                    ExpressionAttributeValues: {
                        ":bossUserIDTelegram": { S: `${bossUserIDTelegram}` },
                    },
                })
            )
            .then((r) => {
                return (r.Items || [])?.map((r) => unmarshall(r)) || [];
            });
    },

    // listByBossID: async ({ bossID }: { bossID: string }) => {
    //     return await dynamoDB
    //         .send(
    //             new ScanCommand({
    //                 TableName: DatabaseCollection,
    //                 FilterExpression: `bossID = :bossID`,
    //                 ExpressionAttributeValues: {
    //                     ':bossID': { S: `${bossID}` },
    //                 },
    //             }),
    //         )
    //         .then((r) => {
    //             return (r.Items || [])?.map((r) => unmarshall(r)) || []
    //         })
    // },
};
