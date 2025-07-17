
export interface PayrollPeriod {
  id: string;
  business_id: string;
  period_start: string;
  period_end: string;
  status: 'draft' | 'finalized' | 'paid';
  total_gross_pay?: number;
  total_net_pay?: number;
  total_taxes?: number;
}

export interface PayrollEntry {
  id: string;
  payroll_period_id: string;
  employee_id: string;
  regular_hours?: number;
  overtime_hours?: number;
  regular_pay?: number;
  overtime_pay?: number;
  gross_pay?: number;
  federal_tax?: number;
  state_tax?: number;
  fica_tax?: number;
  net_pay?: number;
  total_tips?: number;
  total_deductions?: number;
}

export const mockPayrollPeriods: PayrollPeriod[] = [
  {
    id: '1',
    business_id: 'business_1',
    period_start: '2024-06-24',
    period_end: '2024-06-30',
    status: 'draft',
    total_gross_pay: 8450.00,
    total_net_pay: 6760.00,
    total_taxes: 1690.00
  }
];

export const mockPayrollEntries: PayrollEntry[] = [
  {
    id: '1',
    payroll_period_id: '1',
    employee_id: '1',
    regular_hours: 40,
    overtime_hours: 5,
    regular_pay: 620.00,
    overtime_pay: 116.25,
    gross_pay: 736.25,
    federal_tax: 162.00,
    state_tax: 66.26,
    fica_tax: 56.32,
    net_pay: 451.67,
    total_tips: 450.00,
    total_deductions: 284.58
  }
];
