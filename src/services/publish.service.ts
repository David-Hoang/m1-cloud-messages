import { pubsub } from '../config/pubsub'
import { addMessage, type Message, type MessageCategory } from '../data/data'

const TOPIC_SERVICE = 'GOLMON_service'

const topic = pubsub.topic(TOPIC_SERVICE)

export async function publishMessage(
  target: string,
  payload: string,
  category: MessageCategory = 'EMISSION',
): Promise<void> {
  const message: Message = {
    CATEGORY: category,
    TARGET: target,
    SOURCE: import.meta.env.VITE_USER_NAME,
    TIMESTAMP: new Date().toISOString(),
    PAYLOAD: payload,
  }

  const data = Buffer.from(JSON.stringify(message))
  await topic.publishMessage({ data })

  addMessage(message)
  console.log(`[${category}] → ${target} : ${payload}`)
}

export async function publishOpen(): Promise<void> {
  await publishMessage('COMMON', '', 'OPEN')
}

export async function publishClose(): Promise<void> {
  await publishMessage('COMMON', '', 'CLOSE')
}
