// @ts-ignore
import formData from "form-data";
import Mailgun from "mailgun.js";
import { Resource } from "sst";

export async function sendPinEmail({
    pin = "",
    email = "",
}: {
    pin: string;
    email: string;
}) {
    // WORKS
    // WORKS
    // WORKS
    // WORKS

    const mailgun = new Mailgun(formData);

    const mg = mailgun.client({
        username: "robot",
        key: Resource.MAILGUN_API_KEY.value,
    });

    // const pin = "1234";
    // const email = "yellowhappy831@gmail.com";

    //
    return await mg.messages
        .create("email.loklok.org", {
            from: `PIN: ${pin} <robot@email.loklok.org>`,
            to: [email],
            subject: `Confirm Code: ${pin}.`,
            text: `Confirm Code: ${pin}. \n One time Confirm PIN, DO NOT share it with others.`,
            html: `<h1>Confirm Code: ${pin}.</h1> <br/> One time Confirm PIN, DO NOT share it with others.`,
        })

        // logs response data
        .then((msg) => {
            console.log("send email", msg);
            return { ok: true };
        })
        // logs any error
        .catch((err) => {
            console.log(err);
            return {
                ok: false,
            };
        });
}
