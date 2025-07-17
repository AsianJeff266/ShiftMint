
export interface Employee {
  id: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  hire_date: string;
  hourly_wage: number;
  overtime_rate?: number;
  status: 'active' | 'inactive';
  business_id: string;
}

export const mockEmployees: Employee[] = [
  {
    id: '1',
    employee_number: 'EMP001',
    first_name: 'John',
    last_name: 'Smith',
    email: 'john.smith@shiftmint.com',
    phone: '555-0101',
    hire_date: '2024-01-15',
    hourly_wage: 15.50,
    overtime_rate: 23.25,
    status: 'active',
    business_id: 'business_1'
  },
  {
    id: '2',
    employee_number: 'EMP002',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.johnson@shiftmint.com',
    phone: '555-0102',
    hire_date: '2024-02-01',
    hourly_wage: 16.00,
    overtime_rate: 24.00,
    status: 'active',
    business_id: 'business_1'
  },
  {
    id: '3',
    employee_number: 'EMP003',
    first_name: 'Mike',
    last_name: 'Chen',
    email: 'mike.chen@shiftmint.com',
    phone: '555-0103',
    hire_date: '2024-01-30',
    hourly_wage: 14.75,
    overtime_rate: 22.13,
    status: 'active',
    business_id: 'business_1'
  },
  {
    id: '4',
    employee_number: 'EMP004',
    first_name: 'Emily',
    last_name: 'Davis',
    email: 'emily.davis@shiftmint.com',
    phone: '555-0104',
    hire_date: '2024-03-01',
    hourly_wage: 13.50,
    overtime_rate: 20.25,
    status: 'active',
    business_id: 'business_1'
  }
];
