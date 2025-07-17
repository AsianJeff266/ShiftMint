
export interface BusinessConfiguration {
  id: string;
  business_id: string;
  business_name: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  tax_settings?: {
    federal_rate: number;
    state_rate: number;
    fica_rate: number;
    unemployment_rate: number;
  };
  payroll_settings?: {
    pay_period: string;
    overtime_threshold: number;
    tip_credit_rate: number;
  };
  tip_pooling_rules?: Array<{
    role: string;
    percentage: number;
  }>;
}

export const mockBusinessConfig: BusinessConfiguration = {
  id: '1',
  business_id: 'business_1',
  business_name: 'ShiftMint Demo Restaurant',
  address: {
    street: '123 Main Street',
    city: 'Portland',
    state: 'OR',
    zip: '97201'
  },
  tax_settings: {
    federal_rate: 0.22,
    state_rate: 0.09,
    fica_rate: 0.0765,
    unemployment_rate: 0.006
  },
  payroll_settings: {
    pay_period: 'weekly',
    overtime_threshold: 40,
    tip_credit_rate: 2.13
  },
  tip_pooling_rules: [
    {
      role: 'server',
      percentage: 0.8
    },
    {
      role: 'bartender',
      percentage: 0.15
    },
    {
      role: 'host',
      percentage: 0.05
    }
  ]
};
