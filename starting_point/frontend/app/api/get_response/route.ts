import { MODEL, SYSTEM_PROMPT } from '@/lib/constants'
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY']
})

export async function POST(request: Request) {
  const { messages } = await request.json()

  try {
    const response = await client.chat.completions.create({
      messages: messages,
      model: MODEL
    })

    return new Response(
      JSON.stringify({
        role: 'assistant',
        content: response.choices[0].message.content
      })
    )
  } catch (error: any) {
    console.error('Error in POST handler:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500
    })
  }
}
