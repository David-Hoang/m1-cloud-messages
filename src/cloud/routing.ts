import { pubsub } from '../config/pubsub'
import type { Message } from '../data/data'

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
 * - 'COMMON' → topic commun GOLMON_common
 * - autre   → TARGET est directement le nom du topic destinataire
 */
function resolveTargetTopic(target: string): string {
  if (target === 'COMMON') {
    return 'GOLMON_common'
  }
  return target
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
 * C'est ce flag --service-account qui attache l'identité GCP à la fonction.
 * Sur GCP, new PubSub() sans keyFilename utilise automatiquement ce compte
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
