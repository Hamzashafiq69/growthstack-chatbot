import { NextRequest, NextResponse } from 'next/server';
import { knowledgeBase } from '@/lib/knowledge-base';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const systemPrompt = `You are an AI assistant for GrowthStack, a SaaS platform for marketing and sales teams. 
Answer questions using ONLY the information provided in the knowledge base below.
Be helpful, concise, and friendly. If someone asks something not covered in the knowledge base, say you don't have that information and suggest they contact support@growthstack.io.
Never make up information. Keep answers under 150 words unless a detailed comparison is needed.

KNOWLEDGE BASE:
${knowledgeBase}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'API error' }, { status: 500 });
    }

    const reply = data.choices[0].message.content;
    return NextResponse.json({ reply });

  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
