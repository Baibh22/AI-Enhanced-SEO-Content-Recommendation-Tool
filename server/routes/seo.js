const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/analyze', async (req, res) => {
  try {
    const { content, title } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const prompt = `You are an SEO expert. Analyze the following article for SEO optimization.

TITLE: "${title || 'Untitled'}"
CONTENT: "${content}"

You are an SEO analysis engine.
Your task:
1. Extract 5–10 relevant SEO keywords ONLY from the content body.
   - Do NOT use words from the title unless they also appear naturally in the content.
   - Prefer multi-word phrases where appropriate.
2. Compute an SEO score between 0 and 100 based on:
   - Alignment between the content and the given title/heading
   - Keyword relevance and natural density
   - Content length, structure (paragraphs, headings, flow)
   - Readability and clarity for a general audience
3. Generate 3–5 clear, specific, and actionable improvement suggestions.
   - Suggestions must be directly applicable to the provided content.
   - Avoid generic or vague advice.

Output Rules:
- Respond with ONLY valid JSON.
- Do NOT include explanations, markdown, or extra text.
- Follow the exact schema and field names below.

Required Output Format:
{
  "seoScore": <integer between 0 and 100>,
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "suggestions": [
    "Specific suggestion 1",
    "Specific suggestion 2",
    "Specific suggestion 3"
  ]
}`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO analysis expert. Always respond with valid JSON only, no additional text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'SEO Content Tool'
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      
      if (!analysis.seoScore || !analysis.keywords || !analysis.suggestions) {
        throw new Error('Invalid response format from AI');
      }
      
      analysis.seoScore = Math.min(100, Math.max(0, Math.round(analysis.seoScore)));
      
      res.json(analysis);
    } else {
      throw new Error('Invalid AI response format');
    }
  } catch (error) {
    console.error('SEO Analysis Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to analyze content',
      details: error.response?.data?.error || error.message 
    });
  }
});

module.exports = router;
