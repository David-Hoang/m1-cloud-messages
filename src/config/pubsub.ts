import { config } from 'dotenv'
import { PubSub } from '@google-cloud/pubsub'

// Charge .env.local en local. Sans effet sur GCP (le fichier n'existe pas).
config({ path: '.env.local' })

// Le SDK GCP lit GOOGLE_APPLICATION_CREDENTIALS automatiquement depuis process.env :
//   - En local  : pointe vers le fichier de clé JSON (défini dans .env.local)
//   - Sur GCP   : variable absente → ADC via le service account attaché à la fonction
export const pubsub = new PubSub()
