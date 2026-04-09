const { PubSub } = require('@google-cloud/pubsub')

const pubsub = new PubSub()

const TOPIC_COMMON = 'GOLMON_common'

const USER_TOPICS = {
  quentin: 'GOLMON_quentin',
  sami: 'GOLMON_sami',
  titi: 'GOLMON_thibault',
  dadibe: 'GOLMON_david',
}

async function routeMessage(pubsubMessage) {
  function resolveTargetTopic(target) {
    if (target === 'COMMON') {
      return TOPIC_COMMON
    }
    return USER_TOPICS[target] ?? target
  }

  const raw = Buffer.from(pubsubMessage.data, 'base64').toString('utf-8')

  let incoming
  try {
    incoming = JSON.parse(raw)
  } catch {
    console.error('Message non parseable, ignoré :', raw)
    return
  }

  const targetTopic = resolveTargetTopic(incoming.TARGET)

  const routed = {
    ...incoming,
    CATEGORY: 'ROUTAGE',
  }

  const data = Buffer.from(JSON.stringify(routed))
  await pubsub.topic(targetTopic).publishMessage({ data })

  console.log(`[ROUTAGE] ${incoming.SOURCE} → ${targetTopic} (${incoming.CATEGORY})`)
}
