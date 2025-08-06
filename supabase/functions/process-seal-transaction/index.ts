
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

    const requestBody = await req.json()
    console.log('Request body received:', JSON.stringify(requestBody, null, 2))
    
    const { customerCardCode, customer_card_id, businessOwnerId, sealsToGive, notes } = requestBody

    if ((!customerCardCode && !customer_card_id) || !businessOwnerId || sealsToGive === undefined || sealsToGive === null) {
      console.error('Validation failed:', { customerCardCode, customer_card_id, businessOwnerId, sealsToGive })
      throw new Error('Código do cartão ou ID do cartão, ID do lojista e número de selos são obrigatórios')
    }

    if (sealsToGive === 0) {
      throw new Error('Número de selos não pode ser zero')
    }

    // Buscar o cartão do cliente
    let query = supabaseClient
      .from('customer_cards')
      .select(`
        *,
        loyalty_cards!inner(
          id,
          user_id,
          business_name,
          seal_count,
          is_active
        )
      `)
      .eq('is_active', true);

    if (customer_card_id) {
      query = query.eq('id', customer_card_id);
    } else {
      query = query.eq('card_code', customerCardCode);
    }

    const { data: customerCard, error: cardError } = await query.single()

    if (cardError || !customerCard) {
      throw new Error('Cartão do cliente não encontrado ou inativo')
    }

    // Verificar se o lojista é o dono do programa de fidelidade
    if (customerCard.loyalty_cards.user_id !== businessOwnerId) {
      throw new Error('Você não tem permissão para dar selos neste cartão')
    }

    if (!customerCard.loyalty_cards.is_active) {
      throw new Error('Este programa de fidelidade não está mais ativo')
    }

    // Calcular novos selos
    const currentSeals = customerCard.current_seals || 0
    const newSealsTotal = currentSeals + sealsToGive
    const requiredSeals = customerCard.loyalty_cards.seal_count
    
    // Validar limites de selos
    if (sealsToGive > 0 && newSealsTotal > requiredSeals) {
      throw new Error(`Não é possível adicionar ${sealsToGive} selos. Máximo permitido: ${requiredSeals - currentSeals}`)
    }
    
    if (sealsToGive < 0 && newSealsTotal < 0) {
      throw new Error(`Não é possível remover ${Math.abs(sealsToGive)} selos. Máximo permitido: ${currentSeals}`)
    }
    
    let rewardsEarned = 0
    let finalSealsCount = Math.max(0, newSealsTotal) // Ensure seals don't go below 0

    // Se completou cartões, calcular recompensas (apenas para adições)
    if (sealsToGive > 0 && newSealsTotal >= requiredSeals) {
      rewardsEarned = Math.floor(newSealsTotal / requiredSeals)
      finalSealsCount = newSealsTotal % requiredSeals
    }

    // Registrar transação de selos
    const { error: transactionError } = await supabaseClient
      .from('seal_transactions')
      .insert({
        customer_card_id: customerCard.id,
        business_owner_id: businessOwnerId,
        seals_given: sealsToGive,
        notes: notes || null
      })

    if (transactionError) {
      throw new Error('Erro ao registrar transação de selos')
    }

    // Atualizar cartão do cliente
    const { error: updateError } = await supabaseClient
      .from('customer_cards')
      .update({
        current_seals: finalSealsCount,
        total_rewards_earned: (customerCard.total_rewards_earned || 0) + rewardsEarned,
        updated_at: new Date().toISOString()
      })
      .eq('id', customerCard.id)

    if (updateError) {
      throw new Error('Erro ao atualizar cartão do cliente')
    }

    return new Response(
      JSON.stringify({
        success: true,
        transaction: {
          sealsGiven: sealsToGive,
          newSealsTotal: finalSealsCount,
          rewardsEarned,
          businessName: customerCard.loyalty_cards.business_name
        },
        customerCard: {
          currentSeals: finalSealsCount,
          totalRewardsEarned: (customerCard.total_rewards_earned || 0) + rewardsEarned,
          requiredSeals
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in process-seal-transaction:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
