import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Clock, 
  Calculator,
  Calendar,
  FileText,
  Shield,
  BarChart3,
  FileCheck,
  Settings,
  Save,
  AlertCircle
} from 'lucide-react';

const configurationSchema = z.object({
  // Business Setup
  businessLegalName: z.string().min(1, "Business legal name is required"),
  businessEIN: z.string().min(9, "Valid EIN required"),
  stateOfIncorporation: z.string().min(1, "State of incorporation is required"),
  defaultPaySchedule: z.enum(['weekly', 'biweekly', 'semimonthly', 'monthly']),
  timeZone: z.string().min(1, "Time zone is required"),
  workweekStartDay: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  
  // Wage & Compensation
  minimumWage: z.number().min(0, "Minimum wage must be positive"),
  overtimeThreshold: z.number().min(0, "Overtime threshold must be positive"),
  overtimeRate: z.number().min(1, "Overtime rate must be at least 1x"),
  tipCreditRate: z.number().min(0, "Tip credit rate must be positive"),
  tipHandlingMethod: z.enum(['pooled', 'direct', 'hybrid']),
  
  // Time & Attendance
  enableAutoBreakDeduction: z.boolean(),
  mealBreakMinutes: z.number().min(0),
  restBreakMinutes: z.number().min(0),
  roundingRule: z.enum(['none', '5min', '10min', '15min']),
  
  // Tax & Withholding
  federalTaxRate: z.number().min(0).max(1),
  stateTaxRate: z.number().min(0).max(1),
  socialSecurityRate: z.number().min(0).max(1),
  medicareRate: z.number().min(0).max(1),
  
  // Pay Period Controls
  allowRetroactiveCorrections: z.boolean(),
  gracePeriodDays: z.number().min(0),
  autoClosePeriod: z.boolean(),
  
  // Payroll Distribution
  defaultPaymentMethod: z.enum(['directDeposit', 'check', 'cash']),
  enablePayStubs: z.boolean(),
  
  // Compliance
  retentionPeriodYears: z.number().min(7, "Minimum 7 years retention required"),
  enableAuditLogs: z.boolean(),
});

type ConfigurationData = z.infer<typeof configurationSchema>;

export const PayrollConfiguration: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('business');

  const form = useForm<ConfigurationData>({
    resolver: zodResolver(configurationSchema),
    defaultValues: {
      businessLegalName: '',
      businessEIN: '',
      stateOfIncorporation: '',
      defaultPaySchedule: 'weekly',
      timeZone: 'America/New_York',
      workweekStartDay: 'monday',
      minimumWage: 15.00,
      overtimeThreshold: 40,
      overtimeRate: 1.5,
      tipCreditRate: 2.13,
      tipHandlingMethod: 'pooled',
      enableAutoBreakDeduction: true,
      mealBreakMinutes: 30,
      restBreakMinutes: 15,
      roundingRule: '5min',
      federalTaxRate: 0.22,
      stateTaxRate: 0.05,
      socialSecurityRate: 0.062,
      medicareRate: 0.0145,
      allowRetroactiveCorrections: true,
      gracePeriodDays: 3,
      autoClosePeriod: false,
      defaultPaymentMethod: 'directDeposit',
      enablePayStubs: true,
      retentionPeriodYears: 7,
      enableAuditLogs: true,
    },
  });

  const onSubmit = async (data: ConfigurationData) => {
    setIsLoading(true);
    try {
      // TODO: Implement Supabase save functionality
      console.log('Saving configuration:', data);
      
      toast({
        title: "Configuration Saved",
        description: "Your payroll configuration has been successfully updated.",
      });
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const configurationTabs = [
    { id: 'business', label: 'Business Setup', icon: Building2 },
    { id: 'employees', label: 'Employee Config', icon: Users },
    { id: 'wages', label: 'Wages & Compensation', icon: DollarSign },
    { id: 'time', label: 'Time & Attendance', icon: Clock },
    { id: 'tax', label: 'Tax & Withholding', icon: Calculator },
    { id: 'periods', label: 'Pay Period Controls', icon: Calendar },
    { id: 'distribution', label: 'Payroll Distribution', icon: FileText },
    { id: 'permissions', label: 'Permissions', icon: Shield },
    { id: 'reporting', label: 'Reporting', icon: BarChart3 },
    { id: 'compliance', label: 'Compliance', icon: FileCheck },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Payroll Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5 h-auto">
                  {configurationTabs.slice(0, 5).map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id} className="flex flex-col items-center gap-1 p-3">
                      <tab.icon className="w-4 h-4" />
                      <span className="text-xs">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsList className="grid w-full grid-cols-5 h-auto mt-2">
                  {configurationTabs.slice(5).map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id} className="flex flex-col items-center gap-1 p-3">
                      <tab.icon className="w-4 h-4" />
                      <span className="text-xs">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Business Setup & Defaults */}
                <TabsContent value="business" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="businessLegalName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Legal Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Business LLC" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="businessEIN"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Federal EIN</FormLabel>
                          <FormControl>
                            <Input placeholder="XX-XXXXXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="stateOfIncorporation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State of Incorporation</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="CA">California</SelectItem>
                              <SelectItem value="NY">New York</SelectItem>
                              <SelectItem value="TX">Texas</SelectItem>
                              <SelectItem value="FL">Florida</SelectItem>
                              <SelectItem value="IL">Illinois</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="defaultPaySchedule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Pay Schedule</FormLabel>
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
                    <FormField
                      control={form.control}
                      name="workweekStartDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Workweek Start Day</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="monday">Monday</SelectItem>
                              <SelectItem value="tuesday">Tuesday</SelectItem>
                              <SelectItem value="wednesday">Wednesday</SelectItem>
                              <SelectItem value="thursday">Thursday</SelectItem>
                              <SelectItem value="friday">Friday</SelectItem>
                              <SelectItem value="saturday">Saturday</SelectItem>
                              <SelectItem value="sunday">Sunday</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Employee Configuration */}
                <TabsContent value="employees" className="space-y-4">
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Employee Configuration</h3>
                    <p className="text-muted-foreground mb-4">
                      Configure employee roles, departments, and default settings
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                      <Card>
                        <CardContent className="pt-6">
                          <h4 className="font-medium mb-2">Default Settings</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Default hourly wage: $15.00</li>
                            <li>• Tip-eligible by default</li>
                            <li>• W-2 employee classification</li>
                            <li>• Weekly pay frequency</li>
                          </ul>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <h4 className="font-medium mb-2">Available Roles</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">Server</Badge>
                            <Badge variant="outline">Bartender</Badge>
                            <Badge variant="outline">Host</Badge>
                            <Badge variant="outline">Kitchen</Badge>
                            <Badge variant="outline">Manager</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Wages & Compensation */}
                <TabsContent value="wages" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="minimumWage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Wage</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>Per hour minimum wage</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tipCreditRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tip Credit Rate</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>Tipped minimum wage</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="overtimeThreshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Overtime Threshold (hours)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>Hours per week before overtime</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="overtimeRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Overtime Rate Multiplier</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>Overtime pay multiplier (e.g., 1.5x)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tipHandlingMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tip Handling Method</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pooled">Pooled Tips</SelectItem>
                              <SelectItem value="direct">Direct Attribution</SelectItem>
                              <SelectItem value="hybrid">Hybrid System</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>How tips are distributed</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Time & Attendance Integration */}
                <TabsContent value="time" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="enableAutoBreakDeduction"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Auto-Break Deduction</FormLabel>
                            <FormDescription>
                              Automatically deduct break time from hours
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="roundingRule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Rounding Rule</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">No Rounding</SelectItem>
                              <SelectItem value="5min">Round to 5 minutes</SelectItem>
                              <SelectItem value="10min">Round to 10 minutes</SelectItem>
                              <SelectItem value="15min">Round to 15 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mealBreakMinutes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meal Break Duration (minutes)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="restBreakMinutes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rest Break Duration (minutes)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Tax & Withholding Settings */}
                <TabsContent value="tax" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="federalTaxRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Federal Tax Rate</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              max="1"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>As decimal (e.g., 0.22 for 22%)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="stateTaxRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State Tax Rate</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              max="1"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>As decimal (e.g., 0.05 for 5%)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="socialSecurityRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Social Security Rate</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.001" 
                              max="1"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>Currently 6.2%</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="medicareRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medicare Rate</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.0001" 
                              max="1"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>Currently 1.45%</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Pay Period Controls */}
                <TabsContent value="periods" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="allowRetroactiveCorrections"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Allow Retroactive Corrections</FormLabel>
                            <FormDescription>
                              Allow editing of previous pay periods
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="autoClosePeriod"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Auto-Close Pay Period</FormLabel>
                            <FormDescription>
                              Automatically close periods after grace period
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gracePeriodDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grace Period (days)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>Days after period end to allow adjustments</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Payroll Distribution & Exports */}
                <TabsContent value="distribution" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="defaultPaymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Payment Method</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="directDeposit">Direct Deposit</SelectItem>
                              <SelectItem value="check">Physical Check</SelectItem>
                              <SelectItem value="cash">Cash Payment</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="enablePayStubs"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enable Pay Stubs</FormLabel>
                            <FormDescription>
                              Generate digital pay stubs for employees
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Permissions & Access Control */}
                <TabsContent value="permissions" className="space-y-4">
                  <div className="text-center py-8">
                    <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Access Control</h3>
                    <p className="text-muted-foreground mb-6">
                      Configure role-based permissions and access levels
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Admin Permissions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm space-y-1 text-left">
                            <li>✅ Full system access</li>
                            <li>✅ Edit payroll configurations</li>
                            <li>✅ Process payroll</li>
                            <li>✅ View all employee data</li>
                            <li>✅ Generate reports</li>
                            <li>✅ Manage user permissions</li>
                          </ul>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Manager Permissions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm space-y-1 text-left">
                            <li>✅ View team payroll data</li>
                            <li>✅ Approve timesheets</li>
                            <li>✅ Generate team reports</li>
                            <li>❌ Edit system configurations</li>
                            <li>❌ Process final payroll</li>
                            <li>❌ View sensitive employee data</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Reporting & Analytics */}
                <TabsContent value="reporting" className="space-y-4">
                  <div className="text-center py-8">
                    <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Reporting & Analytics</h3>
                    <p className="text-muted-foreground mb-6">
                      Configure automated reports and analytics
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Payroll Reports</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm space-y-1 text-left">
                            <li>• Payroll cost over time</li>
                            <li>• Labor cost % of sales</li>
                            <li>• Overtime cost tracker</li>
                            <li>• Department breakdowns</li>
                          </ul>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Tip Analytics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm space-y-1 text-left">
                            <li>• Tip-to-sales ratios</li>
                            <li>• Employee tip performance</li>
                            <li>• Tip distribution analysis</li>
                            <li>• Seasonal tip trends</li>
                          </ul>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Compliance Reports</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm space-y-1 text-left">
                            <li>• Tax liability forecast</li>
                            <li>• Audit trail reports</li>
                            <li>• Form submission status</li>
                            <li>• Regulatory compliance</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Compliance & Documentation */}
                <TabsContent value="compliance" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="retentionPeriodYears"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Record Retention Period (years)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="7"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 7)}
                            />
                          </FormControl>
                          <FormDescription>Minimum 7 years required by law</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="enableAuditLogs"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enable Audit Logs</FormLabel>
                            <FormDescription>
                              Track all system changes and user actions
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Compliance Checklist
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">FLSA Overtime Rules</span>
                          <Badge variant="outline">Configured</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">State Minimum Wage</span>
                          <Badge variant="outline">Configured</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Tip Credit Compliance</span>
                          <Badge variant="outline">Configured</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Record Retention</span>
                          <Badge variant="outline">Configured</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Tax Withholding</span>
                          <Badge variant="outline">Configured</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Separator />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline">
                  Reset to Defaults
                </Button>
                <Button type="submit" disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}; 