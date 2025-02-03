import { ChatCompletionTool } from 'openai/resources/index.mjs'
import { getJson } from 'serpapi'

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
        'Fetches information about a landmark and hotels in certain location using Internet Search. ',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The location to search for'
          },
          query: {
            type: 'string',
            description: 'The query to search for'
          }
        },
        additionalProperties: false,
        required: ['location', 'query']
      },
      strict: true
    }
  }
]

const handleFetchLocationInfo = async ({
  location,
  query
}: {
  location: string
  query: string
}) => {
  const searchResult = await getJson({
    engine: 'google_maps',
    api_key: process.env['SERPAPI_API_KEY'],
    q: query,
    location
  })

  return searchResult
}
