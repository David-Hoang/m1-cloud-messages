export type MessageCategory = 'OPEN' | 'CLOSE' | 'EMISSION' | 'ROUTAGE'

export type Message = {
  id: number
  source: string
  target: string
  category: MessageCategory
  payload: string
  timestamp: string
  isSent: boolean
}