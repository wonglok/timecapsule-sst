import { jwt2data } from "./util/jwt2data2jwt";
// import { server } from "@passwordless-id/webauthn";
// import { base64url } from "jose";
import { Resource } from "sst";
// import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
// import { unmarshall } from "@aws-sdk/util-dynamodb";

// let dyna = new DynamoDBClient();

export async function handler(event: any) {
    let { jwt }: any = JSON.parse(event.body);

    if (!jwt) {
        return {
            ok: false,
        };
    }

    let resp = await jwt2data({
        payload: jwt,
        secretKey: Resource.SESSION_SECRET.value,
    })
        .then((r) => {
            console.log(r);
            return {
                userID: r.userID,
                email: r.email,
                ok: true,
            };
        })
        .catch((e) => {
            return {
                userID: "",
                email: "",
                ok: false,
            };
        });

    if (!resp.ok) {
        return {
            ok: false,
        };
    } else {
        return {
            userID: resp.userID,
            email: resp.email,
            ok: true,
        };
    }
}
