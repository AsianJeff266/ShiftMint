
import { useData } from '@/contexts/DataContext';

export const useEmployees = () => {
  const { employees } = useData();
  
  return {
    data: employees,
    isLoading: false,
    error: null
  };
};
