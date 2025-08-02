/// <reference path="./.sst/platform/config.d.ts" />

const REGION = "ap-southeast-2"; // sydney
const AWS_PROFILE = "lok_at_inter_site_com";
export default $config({
    app(input) {
        return {
            name: "timecapsule-sst",
            removal: input?.stage === "production" ? "retain" : "remove",
            protect: ["production"].includes(input?.stage),
            home: "aws",
            providers: {
                aws: {
                    region: REGION,
                    profile: AWS_PROFILE,
                },
            },
        };
    },
    async run() {
        //        //
        const MAILGUN_API_KEY = new sst.Secret("MAILGUN_API_KEY");
        const SESSION_SECRET = new sst.Secret("SESSION_SECRET");

        //
        //

        const GlobalTable = new sst.aws.Dynamo("GlobalTable", {
            fields: {
                itemID: "string",
            },
            primaryIndex: { hashKey: "itemID" },
        });

        const UserTable = new sst.aws.Dynamo("UserTable", {
            fields: {
                itemID: "string",
            },
            primaryIndex: { hashKey: "itemID" },
        });

        const PasskeyCredentialTable = new sst.aws.Dynamo(
            "PasskeyCredentialTable",
            {
                fields: {
                    itemID: "string",
                },
                primaryIndex: { hashKey: "itemID" },
            }
        );

        const OwnerGroupTable = new sst.aws.Dynamo("OwnerGroupTable", {
            fields: {
                itemID: "string",
            },
            primaryIndex: { hashKey: "itemID" },
        });

        const ConnectionsTable = new sst.aws.Dynamo("ConnectionsTable", {
            fields: {
                itemID: "string",
            },
            primaryIndex: { hashKey: "itemID" },
        });

        const TreasureMapTable = new sst.aws.Dynamo("TreasureMapTable", {
            fields: {
                itemID: "string",
            },
            primaryIndex: { hashKey: "itemID" },
        });

        const TreasureObjectTable = new sst.aws.Dynamo("TreasureObjectTable", {
            fields: {
                itemID: "string",
            },
            primaryIndex: { hashKey: "itemID" },
        });

        const gameLink = [
            //
            TreasureMapTable,
            TreasureObjectTable,
        ];

        const restLink = [
            PasskeyCredentialTable,
            GlobalTable,
            UserTable,
            OwnerGroupTable,
            ConnectionsTable,
            MAILGUN_API_KEY,
            SESSION_SECRET,
        ];

        const RestAPI = new sst.aws.ApiGatewayV2("RestAPI", {
            cors: true,
            link: restLink,
        });

        const SocketAPI = new sst.aws.ApiGatewayWebSocket("SocketAPI", {});

        const realtimeLink = [
            PasskeyCredentialTable,
            RestAPI,
            ConnectionsTable,
            SESSION_SECRET,
            SocketAPI,
        ];

        /////////////////
        /////////////////
        /////////////////

        SocketAPI.route("$connect", {
            handler: "src/ws/connect.handler",
            link: [...realtimeLink],
        });

        SocketAPI.route("$disconnect", {
            handler: "src/ws/disconnect.handler",
            link: [...realtimeLink],
        });

        SocketAPI.route("$default", {
            handler: "src/ws/default.handler",
            link: [...realtimeLink],
        });

        SocketAPI.route("sendMessage", {
            handler: "src/ws/sendMessage.handler",
            link: [...realtimeLink],
        });

        /////////////////
        /////////////////
        /////////////////
        let { setupAPI } = await import("./src/rest/index");
        await setupAPI({ RestAPI, restLink });

        //
    },
});

//
