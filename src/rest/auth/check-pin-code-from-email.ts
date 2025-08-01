// @ts-ignore
import {
    DynamoDBClient,
    PutItemCommand,
    ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
// import Mailgun from "mailgun.js";
import { Resource } from "sst";

import * as jwt from "jsonwebtoken";
import { data2jwt } from "./util/jwt2data2jwt";

let dyna = new DynamoDBClient();

export async function handler(event) {
    //

    let inbound = JSON.parse(event.body);

    let email = inbound.email;
    let pinCode = inbound.pinCode;

    let found: { Items: any[] } | any = await dyna.send(
        new ScanCommand({
            TableName: Resource.UserTable.name,
            ExpressionAttributeValues: marshall({
                ":email": email,
                ":pinVerify": pinCode,
            }),
            FilterExpression: "email = :email AND pinVerify = :pinVerify",
        })
    );

    if (found?.Items?.length === 0) {
        throw JSON.stringify({
            code: 400,
            error: "invalid email or pin code",
        });
    } else {
        let user = unmarshall(found.Items[0]);
        console.log(user);

        await dyna.send(
            new PutItemCommand({
                TableName: Resource.UserTable.name,
                Item: marshall({
                    ...user,
                    pinVerify: null,
                    userIsVerified: true,
                    lastLogin: new Date().toISOString(),
                    lastLoginSource: "email",
                    lastLoginIP: event.requestContext.http.sourceIp,
                }),
            })
        );

        let jwtStr = await data2jwt({
            payload: {
                email: user.email,
                userID: user.itemID,
            },
            secretKey: Resource.SESSION_SECRET.value,
        });

        return {
            email: user.email,
            userID: user.itemID,
            jwt: jwtStr,
            hasPasskey: user?.credentails?.length > 0,
        };
    }
}
