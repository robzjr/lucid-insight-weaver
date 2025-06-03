
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting dream interpretation request...')
    
    const { dreamText } = await req.json()
    console.log('Received dream text:', dreamText?.substring(0, 100) + '...')
    
    if (!dreamText) {
      console.error('No dream text provided')
      return new Response(
        JSON.stringify({ error: 'Dream text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const googleAiApiKey = Deno.env.get('GOOGLE_AI_API_KEY')
    console.log('Google AI API key present:', !!googleAiApiKey)
    
    if (!googleAiApiKey) {
      console.error('Google AI API key not configured')
      return new Response(
        JSON.stringify({ error: 'Google AI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Generating interpretations...')
    
    // Create interpretations using Google AI Studio
    const interpretations = await Promise.all([
      generateInterpretation(dreamText, 'islamic', googleAiApiKey),
      generateInterpretation(dreamText, 'spiritual', googleAiApiKey),
      generateInterpretation(dreamText, 'psychological', googleAiApiKey)
    ])

    console.log('All interpretations generated successfully')

    return new Response(
      JSON.stringify({
        interpretations: {
          islamic: interpretations[0],
          spiritual: interpretations[1],
          psychological: interpretations[2]
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in interpret-dream function:', error)
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function generateInterpretation(dreamText: string, perspective: string, apiKey: string): Promise<string> {
  const prompts = {
    islamic: `As an Islamic scholar, provide a thoughtful interpretation of this dream according to Islamic tradition and teachings. Focus on spiritual guidance and references to Islamic principles: "${dreamText}"`,
    spiritual: `As a spiritual guide, provide an interpretation of this dream from a universal spiritual perspective, focusing on personal growth, symbolism, and inner wisdom: "${dreamText}"`,
    psychological: `As a psychologist, provide an interpretation of this dream from a psychological perspective, focusing on subconscious processes, emotional patterns, and mental states: "${dreamText}"`
  }

  console.log(`Generating ${perspective} interpretation...`)

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompts[perspective as keyof typeof prompts]
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    })

    console.log(`Google AI response status for ${perspective}:`, response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Google AI API error for ${perspective}:`, response.status, errorText)
      throw new Error(`Google AI API returned ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log(`Generated ${perspective} interpretation successfully`)
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text
    }
    
    console.error(`Invalid response structure for ${perspective}:`, data)
    throw new Error(`Failed to generate ${perspective} interpretation: Invalid response structure`)
    
  } catch (error) {
    console.error(`Error generating ${perspective} interpretation:`, error)
    throw new Error(`Failed to generate ${perspective} interpretation: ${error.message}`)
  }
}
