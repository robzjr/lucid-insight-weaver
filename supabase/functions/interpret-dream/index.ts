
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { dreamText } = await req.json()
    
    if (!dreamText) {
      return new Response(
        JSON.stringify({ error: 'Dream text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const googleAiApiKey = Deno.env.get('GOOGLE_AI_API_KEY')
    
    if (!googleAiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Google AI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create interpretations using Google AI Studio
    const interpretations = await Promise.all([
      generateInterpretation(dreamText, 'islamic', googleAiApiKey),
      generateInterpretation(dreamText, 'spiritual', googleAiApiKey),
      generateInterpretation(dreamText, 'psychological', googleAiApiKey)
    ])

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
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
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

  const data = await response.json()
  
  if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text
  }
  
  throw new Error(`Failed to generate ${perspective} interpretation`)
}
