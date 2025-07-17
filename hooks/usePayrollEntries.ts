
import { useData } from '@/contexts/DataContext';

export const usePayrollEntries = (periodId?: string) => {
  const { payrollEntries } = useData();
  
  const filteredEntries = periodId 
    ? payrollEntries.filter(entry => entry.payroll_period_id === periodId)
    : payrollEntries;
  
  return {
    data: filteredEntries,
    isLoading: false,
    error: null
  };
};
