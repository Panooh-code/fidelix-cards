import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  isMerchant: boolean;
  isParticipant: boolean;
  hasLoyaltyCards: boolean;
  hasCustomerCards: boolean;
}

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  try {
    // Check if user has created loyalty cards (merchant)
    const { data: loyaltyCards, error: loyaltyError } = await supabase
      .from('loyalty_cards')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (loyaltyError) {
      console.error('Error checking loyalty cards:', loyaltyError);
    }

    // Check if user has customer cards (participant)
    const { data: customerCards, error: customerError } = await supabase
      .from('customer_cards')
      .select('id')
      .eq('customer_id', userId)
      .limit(1);

    if (customerError) {
      console.error('Error checking customer cards:', customerError);
    }

    const hasLoyaltyCards = (loyaltyCards?.length || 0) > 0;
    const hasCustomerCards = (customerCards?.length || 0) > 0;

    return {
      isMerchant: hasLoyaltyCards,
      isParticipant: hasCustomerCards,
      hasLoyaltyCards,
      hasCustomerCards,
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return {
      isMerchant: false,
      isParticipant: false,
      hasLoyaltyCards: false,
      hasCustomerCards: false,
    };
  }
};

export const getSmartRedirectPath = (userProfile: UserProfile): string => {
  // If user is both merchant and participant, prefer merchant area
  if (userProfile.isMerchant) {
    return '/my-cards';
  }
  
  // If user is only a participant
  if (userProfile.isParticipant) {
    return '/my-customer-cards';
  }
  
  // Default to home page if no profile data
  return '/';
};