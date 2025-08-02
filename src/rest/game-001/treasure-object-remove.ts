import { Resource } from "sst";
import { jwt2data } from "../auth/util/jwt2data2jwt";
import { TreasureObjectTable } from "./TreasureObject";
import { v4 } from "uuid";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export async function handler(event: any) {
    let { jwt, itemID }: any = JSON.parse(event.body);

    //
    let resp = await jwt2data({
        payload: jwt,
        secretKey: Resource.SESSION_SECRET.value,
    });

    let userID = resp.userID;

    let item = await TreasureObjectTable.get({
        item: { itemID: itemID },
    });

    if (userID === item.userID) {
        let result = await TreasureObjectTable.remove({
            item: { itemID: itemID },
        });

        console.log(result);

        return {
            ok: true,
        };
    }

    //
}
