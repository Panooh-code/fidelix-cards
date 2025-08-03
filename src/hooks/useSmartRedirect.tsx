import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, getSmartRedirectPath } from '@/utils/userUtils';

export const useSmartRedirect = () => {
  const navigate = useNavigate();

  const redirectUser = useCallback(async (userId: string, fallbackPath: string = '/') => {
    try {
      const userProfile = await getUserProfile(userId);
      const smartPath = getSmartRedirectPath(userProfile);
      navigate(smartPath);
    } catch (error) {
      console.error('Error in smart redirect:', error);
      navigate(fallbackPath);
    }
  }, [navigate]);

  return { redirectUser };
};