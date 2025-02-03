import { ChatCompletionTool } from 'openai/resources/index.mjs'

export const handleTool = async (toolName: string, parameters: any) => {
  switch (toolName) {
    case 'fetch_location_info':
      return handleFetchLocationInfo(parameters)
    default:
      throw new Error('Tool not found')
  }
}

export const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'fetch_location_info',
      description:
        'Fetches information about a landmark and hotels using Internet Search',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The location to search for'
          }
        },
        additionalProperties: false,
        required: ['location']
      },
      strict: true
    }
  }
]

const handleFetchLocationInfo = async ({ location }: { location: string }) => {
  return 'handleFetchLocationInfo called with location: ' + location
}
