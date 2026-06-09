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
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mimeType || 'image/jpeg', data: imageData }
          },
          {
            type: 'text',
            text: `You are a highly experienced radiologist AI specializing in bone fracture diagnosis. Analyze this X-ray image with maximum precision.

Step 1 — Image validation: Is this a bone X-ray? If not, set detected=false.
Step 2 — Fracture detection: Carefully scan every bone for cortical breaks, fracture lines, bone discontinuity, displacement, angulation, or abnormal density changes.
Step 3 — Classification: Identify the exact fracture type from the pattern of the fracture line(s).
Step 4 — Localization: Determine the precise anatomical location and draw a tight bounding box around each fracture zone as percentages of the image dimensions.

Return ONLY a single valid JSON object, no markdown, no extra text:
{"detected":boolean,"type":"avulsion|comminuted|dislocation|greenstick|hairline|impacted|longitudinal|oblique|pathological|spiral|unclear","confidence":integer_0_to_100,"severity":"none|mild|moderate|severe","location":"specific anatomical location","location_zh":"解剖位置中文","cause":"1-2 sentence mechanism of injury","cause_zh":"1-2句中文骨折原因","observations":["finding 1","finding 2","finding 3"],"observations_zh":["发现1","发现2","发现3"],"quality":"poor|fair|good|excellent","regions":[{"bbox":[x1_pct,y1_pct,x2_pct,y2_pct],"label":"short label","shape":"rect"}]}

Critical rules:
- regions: 1–3 entries, each bbox MUST tightly surround visible fracture area (percentages 0–100)
- confidence: be honest — only >85 if fracture is clearly visible
- If no fracture found: detected=false, regions=[], confidence=integer showing certainty of no-fracture
- observations must be specific radiological findings, not generic statements`
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
