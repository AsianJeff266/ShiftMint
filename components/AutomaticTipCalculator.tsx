
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import { Calculator, Users, AlertCircle } from 'lucide-react';

const calculatorSchema = z.object({
  totalSales: z.string().min(1, 'Total sales is required').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Must be a positive number'),
  serviceChargeRate: z.string().min(1, 'Service charge rate is required').refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, 'Must be between 0 and 100'),
  distributionMethod: z.enum(['hours', 'equal', 'performance']),
});

type CalculatorValues = z.infer<typeof calculatorSchema>;

interface AutomaticTipCalculatorProps {
  onTipsCalculated: (tips: any) => void;
}

export const AutomaticTipCalculator = ({ onTipsCalculated }: AutomaticTipCalculatorProps) => {
  const { toast } = useToast();
  const { employees } = useData();
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationResults, setCalculationResults] = useState<any[]>([]);

  // Process real employee data with default values for calculation
  const activeEmployees = employees
    .filter(emp => emp.isActive)
    .map(emp => ({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      role: emp.role || 'employee',
      hoursWorked: Math.floor(Math.random() * 8) + 1, // Random hours for demo (1-8 hours)
      performanceScore: 0.8 + Math.random() * 0.2, // Random performance score (0.8-1.0)
    }));

  const form = useForm<CalculatorValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      totalSales: '',
      serviceChargeRate: '18',
      distributionMethod: 'hours',
    },
  });

  const calculateTipDistribution = (values: CalculatorValues) => {
    const totalSales = Number(values.totalSales);
    const serviceChargeRate = Number(values.serviceChargeRate) / 100;
    const totalTips = totalSales * serviceChargeRate;

    let distributions: any[] = [];

    switch (values.distributionMethod) {
      case 'hours':
        const totalHours = activeEmployees.reduce((sum, emp) => sum + emp.hoursWorked, 0);
        distributions = activeEmployees.map(emp => ({
          ...emp,
          tipAmount: (emp.hoursWorked / totalHours) * totalTips,
          basis: `${emp.hoursWorked}h of ${totalHours}h total`,
        }));
        break;

      case 'equal':
        const equalAmount = totalTips / activeEmployees.length;
        distributions = activeEmployees.map(emp => ({
          ...emp,
          tipAmount: equalAmount,
          basis: 'Equal distribution',
        }));
        break;

      case 'performance':
        const totalPerformance = activeEmployees.reduce((sum, emp) => sum + emp.performanceScore, 0);
        distributions = activeEmployees.map(emp => ({
          ...emp,
          tipAmount: (emp.performanceScore / totalPerformance) * totalTips,
          basis: `${(emp.performanceScore * 100).toFixed(0)}% performance score`,
        }));
        break;
    }

    return { distributions, totalTips };
  };

  const onSubmit = async (values: CalculatorValues) => {
    if (activeEmployees.length === 0) {
      toast({
        title: 'No Active Employees',
        description: 'Please add employees before calculating tip distribution.',
        variant: 'destructive',
      });
      return;
    }

    setIsCalculating(true);
    
    try {
      // Simulate calculation delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { distributions, totalTips } = calculateTipDistribution(values);
      setCalculationResults(distributions);
      
      toast({
        title: 'Tips Calculated',
        description: `Distributed $${totalTips.toFixed(2)} among ${distributions.length} employees`,
      });
      
      // Call the callback with the results
      onTipsCalculated({
        totalAmount: totalTips,
        distributions,
        method: values.distributionMethod,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      toast({
        title: 'Calculation Error',
        description: 'There was an error calculating tip distribution.',
        variant: 'destructive',
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const confirmDistribution = () => {
    calculationResults.forEach(result => {
      onTipsCalculated({
        id: Math.random().toString(36).substr(2, 9),
        amount: result.tipAmount,
        type: 'credit',
        employee: result.name,
        time: 'Just now',
        source: 'automatic',
        notes: `Auto-calculated based on ${result.basis}`,
      });
    });
    
    setCalculationResults([]);
    form.reset();
    
    toast({
      title: 'Tips Recorded',
      description: `Successfully recorded tips for ${calculationResults.length} employees`,
    });
  };

  if (activeEmployees.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Automatic Tip Calculator
          </CardTitle>
          <CardDescription>
            Calculate and distribute tips based on sales and service charges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Active Employees</h3>
            <p className="text-muted-foreground">
              You need to add employees before you can calculate tip distribution.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="totalSales"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Sales ($)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1250.00"
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceChargeRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Charge Rate (%)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="18"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="distributionMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distribution Method</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="hours">By Hours Worked</SelectItem>
                    <SelectItem value="equal">Equal Distribution</SelectItem>
                    <SelectItem value="performance">By Performance Score</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isCalculating} className="w-full">
            <Calculator className="w-4 h-4 mr-2" />
            {isCalculating ? 'Calculating...' : 'Calculate Distribution'}
          </Button>
        </form>
      </Form>

      {/* Active Employees Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Active Employees Today
          </CardTitle>
          <CardDescription>
            Employees who will receive tips from this calculation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {activeEmployees.map((employee) => (
              <div key={employee.id} className="flex justify-between items-center p-2 bg-muted rounded">
                <div>
                  <span className="font-medium">{employee.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">({employee.role})</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {employee.hoursWorked}h worked
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calculation Results */}
      {calculationResults.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">Calculated Distribution</CardTitle>
            <CardDescription className="text-green-700">
              Review the calculated tip amounts before confirming
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {calculationResults.map((result, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white rounded border">
                  <div>
                    <span className="font-medium">{result.name}</span>
                    <p className="text-sm text-muted-foreground">{result.basis}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-green-700">${result.tipAmount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 border-t font-bold">
                <span>Total Distributed:</span>
                <span>${calculationResults.reduce((sum, result) => sum + result.tipAmount, 0).toFixed(2)}</span>
              </div>
            </div>
            <Button onClick={confirmDistribution} className="w-full mt-4">
              Confirm & Record Tips
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
