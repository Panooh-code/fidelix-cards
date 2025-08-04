import { useAuth } from './useAuth';

export interface UserRoles {
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  userRoles: string[];
  isMerchant: boolean;
  isCustomer: boolean;
}

export const useUserRoles = (): UserRoles => {
  const { profile, userRoles, hasRole } = useAuth();
  
  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => userRoles.includes(role));
  };
  
  const isMerchant = hasRole('merchant');
  const isCustomer = hasRole('customer');
  
  return {
    hasRole,
    hasAnyRole,
    userRoles,
    isMerchant,
    isCustomer,
  };
};