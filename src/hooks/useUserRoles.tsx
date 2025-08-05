import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { getUserProfile } from '@/utils/userUtils';
import { useQuery } from '@tanstack/react-query';

export interface UserRoleCapabilities {
  isMerchant: boolean;
  isCustomer: boolean;
  canAccessMerchantArea: boolean;
  canAccessCustomerArea: boolean;
  hasRole: (role: string) => boolean;
  firstName: string;
}

export const useUserRoles = (): UserRoleCapabilities => {
  const { user, profile } = useAuth();

  // Get user profile data for card counts
  const { data: userProfileData } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => getUserProfile(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return useMemo(() => {
    if (!user || !profile) {
      return {
        isMerchant: false,
        isCustomer: false,
        canAccessMerchantArea: false,
        canAccessCustomerArea: false,
        hasRole: () => false,
        firstName: '',
      };
    }

    const roles = profile.roles || [];
    const hasRole = (role: string) => roles.includes(role);
    
    // Hybrid logic: role + actual card ownership
    const isMerchant = hasRole('merchant') || (userProfileData?.hasLoyaltyCards ?? false);
    const isCustomer = hasRole('customer') || (userProfileData?.hasCustomerCards ?? false);
    
    // Can access areas based on both role and content
    const canAccessMerchantArea = isMerchant && (userProfileData?.hasLoyaltyCards ?? false);
    const canAccessCustomerArea = isCustomer && (userProfileData?.hasCustomerCards ?? false);

    // Extract first name from full name
    const firstName = profile.full_name?.split(' ')[0] || 'Usuário';

    return {
      isMerchant,
      isCustomer,
      canAccessMerchantArea,
      canAccessCustomerArea,
      hasRole,
      firstName,
    };
  }, [user, profile, userProfileData]);
};