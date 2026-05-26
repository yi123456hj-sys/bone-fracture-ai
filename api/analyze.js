import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { imageData, mimeType } = req.body;
    if (!imageData) return res.status(400).json({ error: 'No image data' });

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mimeType || 'image/jpeg', data: imageData }
          },
          {
            type: 'text',
            text: 'You are a medical imaging AI assistant. Analyze this bone X-ray image carefully. Return ONLY valid JSON with no markdown or explanation: {"detected":true_or_false,"type":"avulsion|comminuted|dislocation|greenstick|hairline|impacted|longitudinal|oblique|pathological|spiral|unclear","confidence":0_to_100,"severity":"none|mild|moderate|severe","location":"anatomical description in English","observations":["finding 1","finding 2","finding 3"],"quality":"poor|fair|good|excellent"}'
          }
        ]
      }]
    });

    const raw = message.content[0].text.replace(/^```json?\s*/,'').replace(/\s*```$/,'').trim();
    res.json(JSON.parse(raw));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
