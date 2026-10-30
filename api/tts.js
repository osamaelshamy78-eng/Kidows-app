// Vercel serverless function: GET /api/tts?text=...  (or POST { text })
// Calls ElevenLabs text-to-speech and returns an mp3.
// The API key stays server-side (set as a Vercel env var) — never expose
// it in frontend code.
// GET is preferred: Vercel's CDN caches each phrase, so the same sentence
// is only paid for once on ElevenLabs no matter how many kids replay it.

// Haytham: warm, clear Arabic storytelling voice. Override with ELEVENLABS_VOICE_ID.
const DEFAULT_VOICE_ID = 'albaa6OioIhKtKdCEkQw'
const MAX_TEXT_LENGTH = 600

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const text = req.method === 'GET' ? req.query?.text : req.body?.text
  if (!text || typeof text !== 'string') {
    res.status(400).json({ error: 'Missing text' })
    return
  }
  if (text.length > MAX_TEXT_LENGTH) {
    res.status(413).json({ error: 'Text too long' })
    return
  }

  const apiKey = process.env.ELEVENLABS_API_KEY
  const voiceId = process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID

  if (!apiKey) {
    res.status(501).json({ error: 'TTS not configured yet' })
    return
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_64`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.6, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true }
        })
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      console.error('ElevenLabs TTS error', response.status, errText)
      res.status(502).json({ error: 'TTS provider error' })
      return
    }

    const arrayBuffer = await response.arrayBuffer()
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable')
    res.status(200).send(Buffer.from(arrayBuffer))
  } catch (err) {
    console.error('TTS request failed', err)
    res.status(500).json({ error: 'TTS request failed' })
  }
}
