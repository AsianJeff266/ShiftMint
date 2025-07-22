
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Calendar, Users, Calculator, Plus, Settings, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { PayrollConfiguration } from './PayrollConfiguration';

const payrollPeriodSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  payDate: z.string().min(1, "Pay date is required"),
  payPeriodType: z.enum(['weekly', 'biweekly', 'semimonthly', 'monthly']),
  description: z.string().min(1, "Description is required"),
});

type PayrollPeriodData = z.infer<typeof payrollPeriodSchema>;

interface PayrollPeriod {
  id: string;
  startDate: string;
  endDate: string;
  payDate: string;
  status: 'draft' | 'calculated' | 'approved' | 'paid';
  grossPay: number;
  tipAmount: number;
  employeeCount: number;
  description: string;
}

interface PayrollStats {
  currentPeriod: PayrollPeriod | null;
  activeEmployees: number;
  totalGrossPay: number;
  totalTips: number;
  periods: PayrollPeriod[];
}

export const PayrollOverview: React.FC = () => {
  const { user } = useAuth();
  const { employees } = useData();
  const { toast } = useToast();
  const [stats, setStats] = useState<PayrollStats>({
    currentPeriod: null,
    activeEmployees: 0,
    totalGrossPay: 0,
    totalTips: 0,
    periods: [],
  });
  const [loading, setLoading] = useState(true);
  const [isNewPeriodDialogOpen, setIsNewPeriodDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PayrollPeriodData>({
    resolver: zodResolver(payrollPeriodSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
      payDate: '',
      payPeriodType: 'weekly',
      description: '',
    },
  });

  useEffect(() => {
    const fetchPayrollData = async () => {
      if (!user?.businessId) return;

      try {
        setLoading(true);
        
        // Fetch payroll periods
        const { data: periods, error: periodsError } = await supabase
          .from('payroll_periods')
          .select('*')
          .eq('business_id', user.businessId)
          .order('start_date', { ascending: false });

        if (periodsError) {
          console.error('Error fetching payroll periods:', periodsError);
          // Create default period if none exist
          const defaultPeriod: PayrollPeriod = {
            id: 'default',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            payDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'draft',
            grossPay: 0,
            tipAmount: 0,
            employeeCount: 0,
            description: 'Current Period',
          };
          setStats({
            currentPeriod: defaultPeriod,
            activeEmployees: employees?.filter(emp => emp.status === 'active').length || 0,
            totalGrossPay: 0,
            totalTips: 0,
            periods: [defaultPeriod],
          });
        } else {
          // Process fetched periods
          const processedPeriods: PayrollPeriod[] = periods?.map(period => ({
            id: period.id,
            startDate: period.start_date,
            endDate: period.end_date,
            payDate: period.pay_date,
            status: period.status,
            grossPay: period.gross_pay || 0,
            tipAmount: period.tip_amount || 0,
            employeeCount: period.employee_count || 0,
            description: period.description || 'Payroll Period',
          })) || [];

          const currentPeriod = processedPeriods[0] || null;
          const totalGross = processedPeriods.reduce((sum, period) => sum + period.grossPay, 0);
          const totalTips = processedPeriods.reduce((sum, period) => sum + period.tipAmount, 0);

          setStats({
            currentPeriod,
            activeEmployees: employees?.filter(emp => emp.status === 'active').length || 0,
            totalGrossPay: totalGross,
            totalTips,
            periods: processedPeriods,
          });
        }
      } catch (error) {
        console.error('Error fetching payroll data:', error);
        toast({
          title: "Error",
          description: "Failed to load payroll data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPayrollData();
  }, [user?.businessId, employees, toast]);

  const onSubmitNewPeriod = async (data: PayrollPeriodData) => {
    if (!user?.businessId) {
      toast({
        title: "Error",
        description: "No business ID available. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Try to create in database first
      const { data: newPeriod, error } = await supabase
        .from('payroll_periods')
        .insert({
          business_id: user.businessId,
          start_date: data.startDate,
          end_date: data.endDate,
          pay_date: data.payDate,
          status: 'draft',
          description: data.description,
          gross_pay: 0,
          tip_amount: 0,
          employee_count: stats.activeEmployees,
        })
        .select()
        .single();

      let processedPeriod: PayrollPeriod;

      if (error) {
        console.error('Database error creating payroll period:', error);
        
        // Create local fallback period for demo purposes
        processedPeriod = {
          id: `local-${Date.now()}`,
          startDate: data.startDate,
          endDate: data.endDate,
          payDate: data.payDate,
          status: 'draft',
          grossPay: 0,
          tipAmount: 0,
          employeeCount: stats.activeEmployees,
          description: data.description,
        };

        toast({
          title: "Payroll Period Created (Demo Mode)",
          description: "Payroll period created locally for demonstration purposes.",
        });
      } else {
        // Use database result
        processedPeriod = {
          id: newPeriod.id,
          startDate: newPeriod.start_date,
          endDate: newPeriod.end_date,
          payDate: newPeriod.pay_date,
          status: newPeriod.status,
          grossPay: newPeriod.gross_pay || 0,
          tipAmount: newPeriod.tip_amount || 0,
          employeeCount: newPeriod.employee_count || 0,
          description: newPeriod.description || 'New Period',
        };

        toast({
          title: "Payroll Period Created",
          description: "New payroll period has been successfully created.",
        });
      }

      // Update local state
      setStats(prev => ({
        ...prev,
        periods: [processedPeriod, ...prev.periods],
        currentPeriod: processedPeriod,
      }));

      form.reset();
      setIsNewPeriodDialogOpen(false);
    } catch (error) {
      console.error('Error creating payroll period:', error);
      toast({
        title: "Error",
        description: `Failed to create payroll period: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculatePeriodPayroll = async (periodId: string) => {
    if (!user?.businessId) return;

    try {
      // TODO: Implement payroll calculation logic
      toast({
        title: "Payroll Calculation",
        description: "Payroll calculation feature is being implemented.",
      });
    } catch (error) {
      console.error('Error calculating payroll:', error);
      toast({
        title: "Error",
        description: "Failed to calculate payroll. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'draft': return 'outline';
      case 'calculated': return 'secondary';
      case 'approved': return 'default';
      case 'paid': return 'default';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p>Loading payroll data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payroll Overview</h2>
        <Button onClick={() => setIsConfigDialogOpen(true)} variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Configure Payroll
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Period</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.currentPeriod ? stats.currentPeriod.description : 'No Active Period'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.currentPeriod 
                ? `${formatDate(stats.currentPeriod.startDate)} - ${formatDate(stats.currentPeriod.endDate)}`
                : 'Create a new period to get started'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeEmployees === 0 ? 'No employees added' : 'Ready for payroll'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Period Gross Pay</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.currentPeriod?.grossPay || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.currentPeriod?.tipAmount || 0)} from tips
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={getStatusColor(stats.currentPeriod?.status || 'draft')}>
              {stats.currentPeriod?.status || 'No Period'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.currentPeriod?.status === 'draft' ? 'Ready to calculate' : 'Processed'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payroll Periods</CardTitle>
          <Dialog open={isNewPeriodDialogOpen} onOpenChange={setIsNewPeriodDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Period
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Payroll Period</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitNewPeriod)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Weekly payroll - Week 1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="payDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pay Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="payPeriodType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pay Period Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="biweekly">Bi-weekly</SelectItem>
                              <SelectItem value="semimonthly">Semi-monthly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsNewPeriodDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Creating...' : 'Create Period'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.periods.length > 0 ? (
              stats.periods.map((period) => (
                <div key={period.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{period.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(period.startDate)} - {formatDate(period.endDate)} • {period.employeeCount} employees • {formatCurrency(period.grossPay)} gross
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(period.status)}>
                      {period.status}
                    </Badge>
                    {period.status === 'draft' && (
                      <Button 
                        size="sm" 
                        onClick={() => calculatePeriodPayroll(period.id)}
                        disabled={stats.activeEmployees === 0}
                      >
                        Calculate
                      </Button>
                    )}
                    {period.status !== 'draft' && (
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                <p>No payroll periods found</p>
                <p className="text-sm">Create your first payroll period to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Dialog */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payroll Configuration</DialogTitle>
          </DialogHeader>
          <PayrollConfiguration />
        </DialogContent>
      </Dialog>
    </div>
  );
};
