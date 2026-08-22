// Vercel serverless function: POST /api/tts { text: "..." }
// Calls ElevenLabs text-to-speech and streams back an mp3.
// The API key stays server-side (set as a Vercel env var) — never expose
// it in frontend code.
// Arabic narration uses the Haytham voice selected for warm, clear storytelling.

const ARABIC_VOICE_ID = 'IES4nrmZdUBHByLBde0P'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { text } = req.body || {}
  if (!text || typeof text !== 'string') {
    res.status(400).json({ error: 'Missing text' })
    return
  }

  const apiKey = process.env.ELEVENLABS_API_KEY
  const voiceId = ARABIC_VOICE_ID

  if (!apiKey) {
    res.status(501).json({ error: 'TTS not configured yet' })
    return
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.65, similarity_boost: 0.8 }
        })
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      res.status(502).json({ error: 'TTS provider error', detail: errText })
      return
    }

    const arrayBuffer = await response.arrayBuffer()
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.status(200).send(Buffer.from(arrayBuffer))
  } catch (err) {
    res.status(500).json({ error: 'TTS request failed', detail: String(err) })
  }
}
