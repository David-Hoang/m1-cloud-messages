export const TOPIC_SERVICE = 'GOLMON_service'
export const TOPIC_COMMON = 'GOLMON_common'

export const USER_TOPICS = {
  "quentin": "GOLMON_quentin",
  "sami": "GOLMON_sami",
  "titi": "GOLMON_thibault",
  "dadibe": "GOLMON_david",
}


export type MessageCategory = 'OPEN' | 'CLOSE' | 'EMISSION' | 'ROUTAGE'

export interface Message {
  CATEGORY: MessageCategory
  TARGET: string
  SOURCE: string
  TIMESTAMP: string
  PAYLOAD: string
}

export const messages: Message[] = []

export function addMessage(message: Message): void {
  messages.push(message)
}
