import { PubSub, type Subscription } from '@google-cloud/pubsub'
import type { Message as PubSubMessage } from '@google-cloud/pubsub'
import { addMessage, type Message } from '../data/data'

const USER_NAME = import.meta.env.VITE_USER_NAME

const TOPIC_USER = `GOLMON_${USER_NAME}`
const TOPIC_COMMON = 'GOLMON_common'

const SUB_USER = `GOLMON_sub_${USER_NAME}`
const SUB_COMMON = `GOLMON_sub_common_${USER_NAME}`

const pubsub = new PubSub()

async function ensureSubscription(topicName: string, subName: string): Promise<Subscription> {
  try {
    const [subscription] = await pubsub.topic(topicName).createSubscription(subName)
    console.log(`Subscription créée : ${subName}`)
    return subscription
  } catch (err: unknown) {
    // Code 6 = ALREADY_EXISTS dans gRPC
    if ((err as { code?: number }).code === 6) {
      console.log(`Subscription déjà existante : ${subName}`)
      return pubsub.subscription(subName)
    }
    throw err
  }
}

function handleMessage(message: PubSubMessage): void {
  try {
    const parsed: Message = JSON.parse(message.data.toString()) as Message
    addMessage(parsed)
    console.log(`[${parsed.CATEGORY}] ${parsed.SOURCE} → ${parsed.TARGET} : ${parsed.PAYLOAD}`)
  } catch (err) {
    console.error('Erreur de parsing du message :', err)
  } finally {
    message.ack()
  }
}

export async function startListener(): Promise<void> {
  const subUser = await ensureSubscription(TOPIC_USER, SUB_USER)
  const subCommon = await ensureSubscription(TOPIC_COMMON, SUB_COMMON)

  subUser.on('message', handleMessage)
  subCommon.on('message', handleMessage)

  subUser.on('error', (err) => console.error(`Erreur sur ${SUB_USER} :`, err))
  subCommon.on('error', (err) => console.error(`Erreur sur ${SUB_COMMON} :`, err))

  console.log(`Listener démarré sur ${TOPIC_USER} et ${TOPIC_COMMON}`)
}
