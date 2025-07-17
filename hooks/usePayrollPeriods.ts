
import { useData } from '@/contexts/DataContext';

export const usePayrollPeriods = () => {
  const { payrollPeriods } = useData();
  
  return {
    data: payrollPeriods,
    isLoading: false,
    error: null
  };
};

export { usePayrollEntries } from './usePayrollEntries';
