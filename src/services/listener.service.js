console.log("Start listener");

const { PubSub } = require("@google-cloud/pubsub");

const TOPICNAME = 'sami_topic01';
const SUBSNAME = 'sami_sub_filter_01';

async function listenForMessages() {
    const pubsub = new PubSub({ keyFilename: './key-samiparis.json' });
    const subscription = pubsub.subscription(SUBSNAME);
    const messageHandler = (message) => {
        console.log(`Message ID: ${message.id}`);
        console.log(`Data: ${message.data.toString()}`);
        console.log(`Attributes: ${JSON.stringify(message.attributes)}`);
        // IMPORTANT : confirmer la réception
        message.ack();
    };
    subscription.on('message', messageHandler);
    console.log(`Listening for messages on ${SUBSNAME}...`);
}
