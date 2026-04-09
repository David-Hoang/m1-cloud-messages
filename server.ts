import express from 'express'
import cors from 'cors'
import { WebSocketServer, WebSocket } from 'ws'
import { createServer } from 'http'
import { startListener } from './src/services/listener.service.js'
import { publishMessage, publishOpen, publishClose } from './src/services/publish.service.js'

const PORT = 3000

const app = express()
app.use(cors())
app.use(express.json())

const httpServer = createServer(app)
const wss = new WebSocketServer({ server: httpServer })

function broadcast(msg: object) {
  const payload = JSON.stringify(msg)
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload)
    }
  })
}

// POST /publish — envoyer un message
app.post('/publish', async (req, res) => {
  const { source, target, payload, category } = req.body
  await publishMessage(source, target, payload, category)
  res.json({ ok: true })
})

// POST /open — rejoindre le chat
app.post('/open', async (req, res) => {
  const { source } = req.body
  await publishOpen(source)
  res.json({ ok: true })
})

// POST /close — quitter le chat
app.post('/close', async (req, res) => {
  const { source } = req.body
  await publishClose(source)
  res.json({ ok: true })
})

// Démarrage
httpServer.listen(PORT, async () => {
  const userName = process.env.VITE_USER_NAME
  if (!userName) {
    console.error('VITE_USER_NAME manquant dans .env.local')
    process.exit(1)
  }
  await startListener(userName, broadcast)
  console.log(`Serveur démarré sur http://localhost:${PORT}`)
})
