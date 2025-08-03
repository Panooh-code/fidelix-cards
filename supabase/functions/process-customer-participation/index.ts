
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

    const { publicCode, customerId, agreedToTerms } = await req.json()

    if (!publicCode || !customerId) {
      throw new Error('Código público e ID do cliente são obrigatórios')
    }

    if (!agreedToTerms) {
      throw new Error('É necessário concordar com os termos')
    }

    // Buscar o cartão de fidelidade
    const { data: loyaltyCard, error: cardError } = await supabaseClient
      .from('loyalty_cards')
      .select('id, business_name, is_active')
      .eq('public_code', publicCode)
      .single()

    if (cardError || !loyaltyCard) {
      throw new Error('Cartão de fidelidade não encontrado')
    }

    if (!loyaltyCard.is_active) {
      throw new Error('Este cartão de fidelidade não está mais ativo')
    }

    // Verificar se o cliente já participa
    const { data: existingParticipation } = await supabaseClient
      .from('card_participations')
      .select('id')
      .eq('loyalty_card_id', loyaltyCard.id)
      .eq('customer_id', customerId)
      .single()

    if (existingParticipation) {
      throw new Error('Você já participa desta promoção')
    }

    // Gerar código único para o cartão do cliente (4 letras + 4 números)
    const generateCustomerCardCode = (): string => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let code = ''
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return code
    }

    // Verificar unicidade do código do cliente
    let customerCardCode = ''
    let isUnique = false
    let attempts = 0
    const maxAttempts = 10

    while (!isUnique && attempts < maxAttempts) {
      customerCardCode = generateCustomerCardCode()
      const { data: existingCustomerCard } = await supabaseClient
        .from('customer_cards')
        .select('id')
        .eq('card_code', customerCardCode)
        .single()

      if (!existingCustomerCard) {
        isUnique = true
      }
      attempts++
    }

    if (!isUnique) {
      throw new Error('Não foi possível gerar um código único para seu cartão')
    }

    // Gerar QR code para o cartão do cliente
    const customerCardUrl = `https://jpkogupeanqhhwujvkxh.supabase.co/my-card/${customerCardCode}`
    const customerQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(customerCardUrl)}`

    // Iniciar transação
    const { error: participationError } = await supabaseClient
      .from('card_participations')
      .insert({
        loyalty_card_id: loyaltyCard.id,
        customer_id: customerId,
        agreed_to_terms: agreedToTerms
      })

    if (participationError) {
      throw new Error('Erro ao registrar participação')
    }

    // Criar cartão do cliente
    const { data: customerCard, error: customerCardError } = await supabaseClient
      .from('customer_cards')
      .insert({
        loyalty_card_id: loyaltyCard.id,
        customer_id: customerId,
        card_code: customerCardCode,
        qr_code_url: customerQrCodeUrl
      })
      .select()
      .single()

    if (customerCardError) {
      throw new Error('Erro ao criar seu cartão de fidelidade')
    }

    return new Response(
      JSON.stringify({
        success: true,
        customerCard: {
          id: customerCard.id,
          cardCode: customerCardCode,
          qrCodeUrl: customerQrCodeUrl,
          publicUrl: customerCardUrl
        },
        businessName: loyaltyCard.business_name
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in process-customer-participation:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
