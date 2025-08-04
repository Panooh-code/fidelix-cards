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

    const { publicCode, customerId } = await req.json()

    if (!publicCode || !customerId) {
      throw new Error('Código público e ID do cliente são obrigatórios')
    }

    // Buscar o cartão de fidelidade pelo código público
    const { data: loyaltyCard, error: cardError } = await supabaseClient
      .from('loyalty_cards')
      .select('id')
      .eq('public_code', publicCode)
      .single()

    if (cardError || !loyaltyCard) {
      return new Response(
        JSON.stringify({ error: 'Cartão de fidelidade não encontrado' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      )
    }

    // Verificar se o cliente já possui um cartão para este programa de fidelidade
    const { data: customerCard, error: customerCardError } = await supabaseClient
      .from('customer_cards')
      .select('card_code')
      .eq('loyalty_card_id', loyaltyCard.id)
      .eq('customer_id', customerId)
      .maybeSingle()

    if (customerCardError) {
      console.error('Error checking customer card:', customerCardError)
      throw new Error('Erro ao verificar status do cliente')
    }

    // Se encontrou um cartão, cliente já participa
    if (customerCard) {
      return new Response(
        JSON.stringify({
          status: 'participant',
          cardCode: customerCard.card_code
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Se não encontrou, cliente é visitante
    return new Response(
      JSON.stringify({
        status: 'visitor'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in get-customer-status:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})