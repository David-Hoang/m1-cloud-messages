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
