
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

    const url = new URL(req.url)
    const customerCardCode = url.searchParams.get('cardCode')
    const businessOwnerId = url.searchParams.get('businessOwnerId')

    if (!customerCardCode || !businessOwnerId) {
      throw new Error('Código do cartão e ID do lojista são obrigatórios')
    }

    // Buscar informações completas do cartão do cliente
    const { data: customerCard, error: cardError } = await supabaseClient
      .from('customer_cards')
      .select(`
        *,
        loyalty_cards!inner(
          id,
          user_id,
          business_name,
          business_segment,
          seal_count,
          seal_shape,
          reward_description,
          primary_color,
          background_color,
          is_active
        ),
        profiles!customer_cards_customer_id_fkey(
          full_name,
          email
        )
      `)
      .eq('card_code', customerCardCode)
      .eq('is_active', true)
      .single()

    if (cardError || !customerCard) {
      throw new Error('Cartão do cliente não encontrado')
    }

    // Verificar se o lojista tem permissão para ver este cartão
    if (customerCard.loyalty_cards.user_id !== businessOwnerId) {
      throw new Error('Você não tem permissão para ver este cartão')
    }

    if (!customerCard.loyalty_cards.is_active) {
      throw new Error('Este programa de fidelidade não está mais ativo')
    }

    // Buscar histórico de transações de selos
    const { data: transactions, error: transactionsError } = await supabaseClient
      .from('seal_transactions')
      .select('*')
      .eq('customer_card_id', customerCard.id)
      .order('transaction_date', { ascending: false })
      .limit(10)

    if (transactionsError) {
      console.warn('Erro ao buscar transações:', transactionsError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        customerCard: {
          id: customerCard.id,
          cardCode: customerCard.card_code,
          currentSeals: customerCard.current_seals || 0,
          totalRewardsEarned: customerCard.total_rewards_earned || 0,
          createdAt: customerCard.created_at,
          customer: {
            name: customerCard.profiles?.full_name || 'Nome não disponível',
            email: customerCard.profiles?.email || 'Email não disponível'
          },
          loyaltyProgram: {
            businessName: customerCard.loyalty_cards.business_name,
            businessSegment: customerCard.loyalty_cards.business_segment,
            sealCount: customerCard.loyalty_cards.seal_count,
            sealShape: customerCard.loyalty_cards.seal_shape,
            rewardDescription: customerCard.loyalty_cards.reward_description,
            primaryColor: customerCard.loyalty_cards.primary_color,
            backgroundColor: customerCard.loyalty_cards.background_color
          }
        },
        transactions: transactions || []
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in get-customer-card-info:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
