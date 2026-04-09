import { PubSub } from '@google-cloud/pubsub'

const pubsub = new PubSub()

const TOPIC_COMMON = 'GOLMON_common'

const USER_TOPICS: Record<string, string> = {
  quentin: 'GOLMON_quentin',
  sami: 'GOLMON_sami',
  titi: 'GOLMON_thibault',
  dadibe: 'GOLMON_david',
}

type MessageCategory = 'OPEN' | 'CLOSE' | 'EMISSION' | 'ROUTAGE'

interface Message {
  CATEGORY: MessageCategory
  TARGET: string
  SOURCE: string
  TIMESTAMP: string
  PAYLOAD: string
}

/**
 * Interface du message Pub/Sub reçu par la Cloud Function.
 * GCP encode le payload en base64 dans le champ `data`.
 */
interface PubSubPayload {
  data: string
  messageId: string
  publishTime: string
  attributes?: Record<string, string>
}

/**
 * Détermine le topic de destination à partir du champ TARGET.
 * - 'COMMON'   → GOLMON_common
 * - clé connue → topic utilisateur correspondant (ex: 'quentin' → 'GOLMON_quentin')
 * - autre      → TARGET utilisé tel quel
 */
function resolveTargetTopic(target: string): string {
  if (target === 'COMMON') {
    return TOPIC_COMMON
  }
  return USER_TOPICS[target] ?? target
}

/**
 * Cloud Function GCP — déclenchée par Pub/Sub sur GOLMON_service.
 *
 * Déploiement :
 *   gcloud functions deploy routeMessage \
 *     --runtime nodejs22 \
 *     --trigger-topic GOLMON_service \
 *     --entry-point routeMessage \
 *     --service-account="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
 *
 * Sur GCP, new PubSub() sans argument utilise automatiquement le compte de service
 * via l'ADC (Application Default Credentials) du metadata server.
 */
export async function routeMessage(pubsubMessage: PubSubPayload): Promise<void> {
  const raw = Buffer.from(pubsubMessage.data, 'base64').toString('utf-8')

  let incoming: Message
  try {
    incoming = JSON.parse(raw) as Message
  } catch {
    console.error('Message non parseable, ignoré :', raw)
    return
  }

  const targetTopic = resolveTargetTopic(incoming.TARGET)

  const routed: Message = {
    ...incoming,
    CATEGORY: 'ROUTAGE',
  }

  const data = Buffer.from(JSON.stringify(routed))
  await pubsub.topic(targetTopic).publishMessage({ data })

  console.log(`[ROUTAGE] ${incoming.SOURCE} → ${targetTopic} (${incoming.CATEGORY})`)
}
