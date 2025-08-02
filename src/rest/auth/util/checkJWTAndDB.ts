import { Resource } from "sst";
import { jwt2data } from "./jwt2data2jwt";

export async function checkJWTAndDB({ jwt }: { jwt: string }) {
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
