console.log("Hello");
const { PubSub } = require("@google-cloud/pubsub");
const TOPICNAME = 'sami_topic_externe';

// Utilisation des identifiants JSON
const pubsub = new PubSub({ keyFilename: './key-samiparis.json' });
async function createTopic(topicName) {
const [topic] = await pubsub.createTopic(topicName);
console.log(`Topic ${topic.name} créé.`);
}

//start
//createTopic(TOPICNAME);

const newAttributes = {
    attr001: "toto"
};

const topic = pubsub.topic('sami_topic01');
const messageBuffer = Buffer.from('Hello Pub/Sub!');
topic.publishMessage({data: messageBuffer, attributes: newAttributes});
