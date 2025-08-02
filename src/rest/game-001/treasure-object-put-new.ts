import { Resource } from "sst";
import { jwt2data } from "../auth/util/jwt2data2jwt";
import { TreasureObjectTable } from "./TreasureObject";
import { v4 } from "uuid";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export async function handler(event: any) {
    let { jwt, message, treasureType, mapID, position }: any = JSON.parse(
        event.body
    );

    //
    let resp = await jwt2data({
        payload: jwt,
        secretKey: Resource.SESSION_SECRET.value,
    });

    let userID = resp.userID;
    let item = {
        itemID: `${v4()}`,
        userID: userID,
        mapID: mapID,
        message: message,
        position: position || [0, 0, 0],
        treasureType: treasureType,
        createdAt: new Date().toISOString(),
        udpatedAt: new Date().toISOString(),
    };
    let result = await TreasureObjectTable.put({
        item: item,
    });

    console.log(result);

    return item;
    //
}
