
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { cardId } = await req.json()

    if (!cardId) {
      throw new Error('Card ID é obrigatório')
    }

    // Gerar código público único (2 letras + 4 números)
    const generatePublicCode = (): string => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const numbers = '0123456789'
      
      let code = ''
      // 2 letras
      for (let i = 0; i < 2; i++) {
        code += letters.charAt(Math.floor(Math.random() * letters.length))
      }
      // 4 números
      for (let i = 0; i < 4; i++) {
        code += numbers.charAt(Math.floor(Math.random() * numbers.length))
      }
      
      return code
    }

    // Verificar se o código já existe e gerar um novo se necessário
    let publicCode = ''
    let isUnique = false
    let attempts = 0
    const maxAttempts = 10

    while (!isUnique && attempts < maxAttempts) {
      publicCode = generatePublicCode()
      const { data: existingCard } = await supabaseClient
        .from('loyalty_cards')
        .select('id')
        .eq('public_code', publicCode)
        .single()

      if (!existingCard) {
        isUnique = true
      }
      attempts++
    }

    if (!isUnique) {
      throw new Error('Não foi possível gerar um código único')
    }

    // Gerar URLs
    const publicUrl = `https://jpkogupeanqhhwujvkxh.supabase.co/card/${publicCode}`
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(publicUrl)}`

    // Atualizar o cartão com os novos dados
    const { error: updateError } = await supabaseClient
      .from('loyalty_cards')
      .update({
        public_code: publicCode,
        qr_code_url: qrCodeUrl,
        public_url: publicUrl
      })
      .eq('id', cardId)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({
        success: true,
        publicCode,
        qrCodeUrl,
        publicUrl
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in generate-loyalty-card-codes:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
