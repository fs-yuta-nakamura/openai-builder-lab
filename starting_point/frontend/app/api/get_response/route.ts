import { MODEL, SYSTEM_PROMPT } from '@/lib/constants'
import { handleTool, tools } from '@/lib/tools'
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY']
})

export async function POST(request: Request) {
  const { messages } = await request.json()

  try {
    let completion = await client.chat.completions.create({
      messages: messages,
      tools: tools,
      model: MODEL
    })
    const toolCalls = completion.choices[0].message.tool_calls
    const toolCall = toolCalls && toolCalls[0]

    if (toolCall) {
      // tool is called
      const args = JSON.parse(toolCall.function.arguments)
      console.log('toolCall.function.name', toolCall.function.name)
      console.log('args', args)
      const toolResult = await handleTool(toolCall.function.name, args)
      console.log('toolResult', toolResult)

      messages.push(completion.choices[0].message)
      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: toolResult.toString()
      })

      completion = await client.chat.completions.create({
        messages: messages,
        tools: tools,
        model: MODEL,
        store: true
      })

      console.log('completion: ', completion)
    }

    return new Response(
      JSON.stringify({
        role: 'assistant',
        content: completion?.choices[0]?.message?.content
      })
    )
  } catch (error: any) {
    console.error('Error in POST handler:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500
    })
  }
}
