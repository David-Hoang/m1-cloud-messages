import { pubsub } from '../config/pubsub'
import { addMessage, TOPIC_SERVICE, type Message, type MessageCategory } from '../data/data'

const topic = pubsub.topic(TOPIC_SERVICE)

export async function publishMessage(
  source: string,
  target: string,
  payload: string,
  category: MessageCategory = 'EMISSION',
): Promise<void> {
  const message: Message = {
    CATEGORY: category,
    TARGET: target,
    SOURCE: source,
    TIMESTAMP: new Date().toISOString(),
    PAYLOAD: payload,
  }

  const data = Buffer.from(JSON.stringify(message))
  await topic.publishMessage({ data })

  addMessage(message)
  console.log(`[${category}] → ${target} : ${payload}`)
}

export async function publishOpen(source: string): Promise<void> {
  await publishMessage(source, 'COMMON', '', 'OPEN')
}

export async function publishClose(source: string): Promise<void> {
  await publishMessage(source, 'COMMON', '', 'CLOSE')
}
