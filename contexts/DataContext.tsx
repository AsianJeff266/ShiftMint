
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Import types from the original mock files to maintain compatibility
import { Employee } from '@/data/mockEmployees';
import { Shift } from '@/data/mockShifts';
import { PunchEvent } from '@/data/mockPunchEvents';
import { PayrollPeriod, PayrollEntry } from '@/data/mockPayroll';
import { BusinessConfiguration } from '@/data/mockBusinessConfig';

interface DataContextType {
  employees: Employee[];
  shifts: Shift[];
  punchEvents: PunchEvent[];
  payrollPeriods: PayrollPeriod[];
  payrollEntries: PayrollEntry[];
  businessConfig: BusinessConfiguration;
  loading: boolean;
  error: string | null;
  
  // Methods for data management
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (id: string, updates: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  addShift: (shift: Omit<Shift, 'id'>) => Promise<void>;
  updateShift: (id: string, updates: Partial<Shift>) => Promise<void>;
  addPunchEvent: (event: Omit<PunchEvent, 'id'>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [punchEvents, setPunchEvents] = useState<PunchEvent[]>([]);
  const [payrollPeriods, setPayrollPeriods] = useState<PayrollPeriod[]>([]);
  const [payrollEntries, setPayrollEntries] = useState<PayrollEntry[]>([]);
  const [businessConfig, setBusinessConfig] = useState<BusinessConfiguration>({
    id: 'business_1',
    name: 'Default Business',
    address: '',
    tipPoolingRules: [],
    payrollSettings: {
      payPeriod: 'weekly',
      overtimeThreshold: 40,
      tipCreditRate: 2.13,
    },
    taxSettings: {
      federalRate: 0.22,
      stateRate: 0.05,
      ficaRate: 0.0765,
      unemploymentRate: 0.006,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch employees from Supabase
  const fetchEmployees = async () => {
    if (!user?.businessId) return;
    
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('business_id', user.businessId)
        .eq('status', 'active');

      if (error) throw error;

      // Transform Supabase data to match our Employee interface
      const transformedEmployees: Employee[] = (data || []).map(emp => ({
        id: emp.id,
        employeeNumber: emp.employee_number,
        firstName: emp.first_name,
        lastName: emp.last_name,
        email: emp.email,
        phone: emp.phone || '',
        role: 'employee', // Default role
        businessId: emp.business_id,
        hourlyWage: emp.hourly_wage,
        hireDate: new Date(emp.hire_date),
        isActive: emp.status === 'active',
        taxExemptions: emp.tax_exemptions,
        filingStatus: emp.tax_filing_status,
        payFrequency: emp.pay_frequency,
        bankAccount: emp.bank_account_number || '',
        routingNumber: emp.routing_number || '',
      }));

      setEmployees(transformedEmployees);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to fetch employees');
    }
  };

  // Fetch business configuration
  const fetchBusinessConfig = async () => {
    if (!user?.businessId) return;

    try {
      const { data, error } = await supabase
        .from('business_configurations')
        .select('*')
        .eq('business_id', user.businessId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
        throw error;
      }

      if (data) {
        setBusinessConfig({
          id: data.id,
          name: data.business_name,
          address: data.address || '',
          tipPoolingRules: data.tip_pooling_rules || [],
          payrollSettings: data.payroll_settings || {
            payPeriod: 'weekly',
            overtimeThreshold: 40,
            tipCreditRate: 2.13,
          },
          taxSettings: data.tax_settings || {
            federalRate: 0.22,
            stateRate: 0.05,
            ficaRate: 0.0765,
            unemploymentRate: 0.006,
          },
        });
      }
    } catch (err) {
      console.error('Error fetching business config:', err);
      setError('Failed to fetch business configuration');
    }
  };

  // Fetch all data
  const refreshData = async () => {
    if (!user?.businessId) return;

    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchEmployees(),
        fetchBusinessConfig(),
      ]);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user?.businessId) {
      refreshData();
    } else {
      setLoading(false);
    }
  }, [user?.businessId]);

  // Add employee
  const addEmployee = async (employee: Omit<Employee, 'id'>) => {
    if (!user?.businessId) throw new Error('No business ID');

    try {
      const { data, error } = await supabase
        .from('employees')
        .insert({
          business_id: user.businessId,
          employee_number: employee.employeeNumber,
          first_name: employee.firstName,
          last_name: employee.lastName,
          email: employee.email,
          phone: employee.phone || null,
          hire_date: employee.hireDate.toISOString().split('T')[0],
          hourly_wage: employee.hourlyWage,
          status: 'active',
          tax_exemptions: employee.taxExemptions || 0,
          tax_filing_status: employee.filingStatus || 'single',
          pay_frequency: employee.payFrequency || 'weekly',
          bank_account_number: employee.bankAccount || null,
          routing_number: employee.routingNumber || null,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchEmployees(); // Refresh employees list
    } catch (err) {
      console.error('Error adding employee:', err);
      throw err;
    }
  };

  // Update employee
  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    try {
      const updateData: any = {};
      
      if (updates.firstName) updateData.first_name = updates.firstName;
      if (updates.lastName) updateData.last_name = updates.lastName;
      if (updates.email) updateData.email = updates.email;
      if (updates.phone !== undefined) updateData.phone = updates.phone || null;
      if (updates.hourlyWage !== undefined) updateData.hourly_wage = updates.hourlyWage;
      if (updates.taxExemptions !== undefined) updateData.tax_exemptions = updates.taxExemptions;
      if (updates.filingStatus) updateData.tax_filing_status = updates.filingStatus;
      if (updates.payFrequency) updateData.pay_frequency = updates.payFrequency;
      if (updates.bankAccount !== undefined) updateData.bank_account_number = updates.bankAccount || null;
      if (updates.routingNumber !== undefined) updateData.routing_number = updates.routingNumber || null;

      const { error } = await supabase
        .from('employees')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      await fetchEmployees(); // Refresh employees list
    } catch (err) {
      console.error('Error updating employee:', err);
      throw err;
    }
  };

  // Delete employee
  const deleteEmployee = async (id: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .update({ status: 'terminated' })
        .eq('id', id);

      if (error) throw error;

      await fetchEmployees(); // Refresh employees list
    } catch (err) {
      console.error('Error deleting employee:', err);
      throw err;
    }
  };

  // Placeholder implementations for shift and punch events
  const addShift = async (shift: Omit<Shift, 'id'>) => {
    // TODO: Implement shift creation
    console.log('Adding shift:', shift);
  };

  const updateShift = async (id: string, updates: Partial<Shift>) => {
    // TODO: Implement shift update
    console.log('Updating shift:', id, updates);
  };

  const addPunchEvent = async (event: Omit<PunchEvent, 'id'>) => {
    // TODO: Implement punch event creation
    console.log('Adding punch event:', event);
  };

  const value: DataContextType = {
    employees,
    shifts,
    punchEvents,
    payrollPeriods,
    payrollEntries,
    businessConfig,
    loading,
    error,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addShift,
    updateShift,
    addPunchEvent,
    refreshData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
