// import { server } from "@passwordless-id/webauthn";
// import { base64url } from "jose";
import { Resource } from "sst";
import { jwt2data } from "../auth/util/jwt2data2jwt";
// import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
// import { unmarshall } from "@aws-sdk/util-dynamodb";

// let dyna = new DynamoDBClient();

export async function handler(event: any) {
    let { jwt }: any = JSON.parse(event.body);

    //

    //
}
