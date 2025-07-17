import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePayrollPeriods } from '@/hooks/usePayrollPeriods';
import { usePayrollEntries } from '@/hooks/usePayrollEntries';
import { useEmployees } from '@/hooks/useEmployees';
import { useBusinessConfig } from '@/hooks/useBusinessConfig';
import { Calculator, DollarSign, Users, Clock, TrendingUp } from 'lucide-react';

export const PayrollCalculationEngine: React.FC = () => {
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('');
  const { data: payrollPeriods } = usePayrollPeriods();
  const { data: employees } = useEmployees();
  const { data: businessConfigs } = useBusinessConfig();
  const { data: payrollEntries } = usePayrollEntries(selectedPeriodId);
  
  const currentPeriod = payrollPeriods?.[0];
  const businessConfig = businessConfigs?.[0];
  const taxSettings = businessConfig?.tax_settings as any;
  
  const calculatePayrollTotals = () => {
    if (!employees || !currentPeriod) return null;
    
    const totalEmployees = employees.length;
    const avgHourlyWage = employees.reduce((sum, emp) => sum + Number(emp.hourly_wage), 0) / totalEmployees;
    const estimatedWeeklyHours = 32; // Average hours per employee
    const estimatedGrossPay = totalEmployees * avgHourlyWage * estimatedWeeklyHours;
    const estimatedTaxes = estimatedGrossPay * ((taxSettings?.federal_rate || 0) + (taxSettings?.state_rate || 0) + (taxSettings?.fica_rate || 0));
    const estimatedNetPay = estimatedGrossPay - estimatedTaxes;
    
    return {
      totalEmployees,
      avgHourlyWage,
      estimatedGrossPay,
      estimatedTaxes,
      estimatedNetPay,
      estimatedWeeklyHours
    };
  };
  
  const calculations = calculatePayrollTotals();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Payroll Calculation Engine
          </CardTitle>
          <CardDescription>
            Real-time payroll calculations and projections
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentPeriod && calculations ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {calculations.totalEmployees}
                  </p>
                  <p className="text-sm text-blue-600/80">Active Employees</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    ${calculations.estimatedGrossPay.toFixed(0)}
                  </p>
                  <p className="text-sm text-green-600/80">Est. Gross Pay</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    ${calculations.estimatedTaxes.toFixed(0)}
                  </p>
                  <p className="text-sm text-orange-600/80">Est. Taxes</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <Clock className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {calculations.estimatedWeeklyHours}h
                  </p>
                  <p className="text-sm text-purple-600/80">Avg Weekly Hours</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No payroll period data available for calculations
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {currentPeriod && (
        <Card>
          <CardHeader>
            <CardTitle>Current Pay Period Details</CardTitle>
            <CardDescription>
              {new Date(currentPeriod.period_start).toLocaleDateString()} - {new Date(currentPeriod.period_end).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={currentPeriod.status === 'draft' ? 'outline' : 'default'} className="capitalize">
                    {currentPeriod.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total Gross Pay</span>
                  <span className="text-sm font-mono">
                    ${Number(currentPeriod.total_gross_pay || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total Taxes</span>
                  <span className="text-sm font-mono">
                    ${Number(currentPeriod.total_taxes || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total Net Pay</span>
                  <span className="text-sm font-mono font-bold">
                    ${Number(currentPeriod.total_net_pay || 0).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Calculation Breakdown</h4>
                {calculations && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Average Hourly Rate</span>
                      <span>${calculations.avgHourlyWage.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax Rate (Combined)</span>
                      <span>
                        {(((taxSettings?.federal_rate || 0) + (taxSettings?.state_rate || 0) + (taxSettings?.fica_rate || 0)) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Est. Net Rate</span>
                      <span>
                        {((calculations.estimatedNetPay / calculations.estimatedGrossPay) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Actions</h4>
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    Recalculate Payroll
                  </Button>
                  <Button className="w-full" variant="outline">
                    Generate Reports
                  </Button>
                  <Button className="w-full">
                    Process Payments
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
