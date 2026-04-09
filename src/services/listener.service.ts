import type { Subscription } from '@google-cloud/pubsub'
import type { Message as PubSubMessage } from '@google-cloud/pubsub'
import { pubsub } from '../config/pubsub'
import { TOPIC_COMMON, type Message } from '../data/data'


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

function makeMessageHandler(onMessage?: (msg: Message) => void) {
  return function handleMessage(message: PubSubMessage): void {
    try {
      const parsed: Message = JSON.parse(message.data.toString()) as Message
      onMessage?.(parsed)
      console.log(`[${parsed.CATEGORY}] ${parsed.SOURCE} → ${parsed.TARGET} : ${parsed.PAYLOAD}`)
    } catch (err) {
      console.error('Erreur de parsing du message :', err)
    } finally {
      message.ack()
    }
  }
}

export async function startListener(userName: string, onMessage?: (msg: Message) => void): Promise<void> {
  const topicUser = `GOLMON_${userName}`
  const subUser = `GOLMON_sub_${userName}`
  const subCommon = `GOLMON_sub_common_${userName}`

  const handler = makeMessageHandler(onMessage)

  const subUserConn = await ensureSubscription(topicUser, subUser)
  const subCommonConn = await ensureSubscription(TOPIC_COMMON, subCommon)

  subUserConn.on('message', handler)
  subCommonConn.on('message', handler)

  subUserConn.on('error', (err) => console.error(`Erreur sur ${subUser} :`, err))
  subCommonConn.on('error', (err) => console.error(`Erreur sur ${subCommon} :`, err))

  console.log(`Listener démarré sur ${topicUser} et ${TOPIC_COMMON}`)
}
