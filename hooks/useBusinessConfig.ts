
import { useData } from '@/contexts/DataContext';

export const useBusinessConfig = () => {
  const { businessConfig } = useData();
  
  return {
    data: businessConfig,
    isLoading: false,
    error: null
  };
};
