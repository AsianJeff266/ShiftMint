
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'employee' | 'manager' | 'admin';
  businessId: string;
  hourlyWage?: number;
  isActive: boolean;
}

export interface Business {
  id: string;
  name: string;
  address: string;
  tipPoolingRules: TipPoolingRule[];
  posIntegration?: string;
}

export interface Shift {
  id: string;
  employeeId: string;
  businessId: string;
  clockIn: Date;
  clockOut?: Date;
  location?: {
    lat: number;
    lng: number;
  };
  status: 'active' | 'completed' | 'pending_review';
  hoursWorked?: number;
  tips: Tip[];
  totalTips: number;
}

export interface Tip {
  id: string;
  shiftId: string;
  employeeId: string;
  amount: number;
  type: 'cash' | 'credit' | 'pos_import';
  source: 'manual' | 'pos' | 'hourly_rate' | 'table';
  timestamp: Date;
  confirmedBy?: string;
  tableNumber?: string;
  notes?: string;
}

export interface TipPoolingRule {
  id: string;
  name: string;
  type: 'percentage' | 'hours' | 'flat_rate' | 'table_based';
  allocation: {
    role: string;
    percentage?: number;
    flatAmount?: number;
  }[];
  isActive: boolean;
}

export interface PayrollPeriod {
  id: string;
  businessId: string;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'processing' | 'completed';
  employees: PayrollEmployee[];
}

export interface PayrollEmployee {
  employeeId: string;
  totalHours: number;
  totalTips: number;
  grossPay: number;
  taxes: {
    federal: number;
    state: number;
    fica: number;
    ficaTipCredit: number;
  };
  netPay: number;
}
