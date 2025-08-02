export const setupAPI = async ({ RestAPI, restLink, gameLink }) => {
    RestAPI.route("GET /", {
        handler: "src/rest/hello.handler",
        link: [...restLink],
    });

    // unifiend auth
    // unifiend auth
    // unifiend auth
    // unifiend auth
    // unifiend auth

    RestAPI.route(/*  */ "POST /auth/check-email-next-step", {
        handler: /**/ "src/rest/auth/check-email-next-step.handler",
        link: [...restLink],
    });

    RestAPI.route(/*  */ "POST /auth/check-pin-code-from-email", {
        handler: /**/ "src/rest/auth/check-pin-code-from-email.handler",
        link: [...restLink],
    });

    RestAPI.route(/*  */ "POST /auth/provide-passkey-challenge", {
        handler: /**/ "src/rest/auth/provide-passkey-challenge.handler",
        link: [...restLink],
    });

    RestAPI.route(/*  */ "POST /auth/add-passkey-to-account", {
        handler: /**/ "src/rest/auth/add-passkey-to-account.handler",
        link: [...restLink],
    });

    RestAPI.route(/*  */ "POST /auth/verify-login-passkey", {
        handler: /**/ "src/rest/auth/verify-login-passkey.handler",
        link: [...restLink],
    });

    RestAPI.route(/*  */ "POST /auth/get-cred-ids", {
        handler: /**/ "src/rest/auth/get-cred-ids.handler",
        link: [...restLink],
    });

    RestAPI.route(/*  */ "POST /auth/check-jwt-ok", {
        handler: /**/ "src/rest/auth/check-jwt-ok.handler",
        link: [...restLink],
    });

    // treasure
    // treasure
    // treasure
    // treasure
    // treasure

    RestAPI.route(/*  */ "POST /game-001/treasure-object-put-new", {
        handler: /**/ "src/rest/game-001/treasure-object-put-new.handler",
        link: [...restLink, ...gameLink],
    });

    RestAPI.route(/*  */ "POST /game-001/treasure-object-get", {
        handler: /**/ "src/rest/game-001/treasure-object-get.handler",
        link: [...restLink, ...gameLink],
    });
    RestAPI.route(/*  */ "POST /game-001/treasure-object-remove", {
        handler: /**/ "src/rest/game-001/treasure-object-remove.handler",
        link: [...restLink, ...gameLink],
    });

    //
    //
    //
    //
};
