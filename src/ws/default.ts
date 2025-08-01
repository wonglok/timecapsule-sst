// import { processInbound } from './route/processInbound'

export async function handler(event: any) {
    // console.log(event);
    const connectionId = event["requestContext"]["connectionId"];
    // console.log("default", connectionId);

    let inbound = JSON.parse(event.body);

    console.log(inbound);

    // await processInbound({ inbound, connectionId })

    return {
        statusCode: 200,
        body: JSON.stringify("success"),
    };
}
