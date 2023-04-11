import { App, LogLevel } from "@slack/bolt";
import _ from "lodash";
import { getTrackIdFromUrl, getTrackUrlRequest } from "./spotifyHelper";

const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

const app = new App({
    appToken: SLACK_APP_TOKEN,
    token: SLACK_BOT_TOKEN,
    logLevel: LogLevel.DEBUG,
    socketMode: true,
});

const dummySongsUrl: string[] = ['5EWPGh7jbTNO2wakv8LjUI'];

app.command("/inject", async ({ ack, payload, say, logger }) => {
    const trackUrl = await getTrackUrlRequest(_.sample(dummySongsUrl)!);
    logger.info(trackUrl);
    await ack();
    await say({
        channel: payload.channel_id,
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `<${trackUrl}>`
                },

            },
        ]
    });

});

app.command("/addfavorite", async ({ ack, payload, logger }) => {
    await ack();
    dummySongsUrl.push(getTrackIdFromUrl(payload.text));
    logger.info(dummySongsUrl.length + "songs ids array size");
    dummySongsUrl.forEach(id => {
        logger.info(`Song id: ${id}`);
    })
});

app.event('link_shared', async ({ event, client, logger }) => {
    try {
        console.log("GG kazkas suveike");
        console.log("link: " + event.links[0].url);

        const result = client.chat.unfurl({
            channel: event.channel,
            ts: event.message_ts,
            unfurls: {
                [event.links[0].url]: {
                }
            }
        })

        logger.info(result);
    }
    catch (error) {
        logger.error(error);
    }
});

app.start().catch((error) => {
    console.error(error);
    process.exit(1);
});