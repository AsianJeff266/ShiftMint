
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useExport } from '@/hooks/useExport';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { 
  DollarSign, 
  Calendar, 
  Clock, 
  Users, 
  Calculator, 
  Download, 
  Upload, 
  Lock, 
  Unlock, 
  Save, 
  Send, 
  Eye, 
  Edit, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  FileText, 
  Printer, 
  Plus, 
  Minus, 
  RefreshCw,
  Shield,
  History
} from 'lucide-react';

interface PayrollPeriod {
  id: string;
  business_id: string;
  period_name: string;
  start_date: string;
  end_date: string;
  pay_date: string;
  status: 'draft' | 'processing' | 'completed' | 'locked';
  total_hours: number;
  total_gross_pay: number;
  total_net_pay: number;
  total_tips: number;
  total_deductions: number;
  created_at: string;
  submitted_at?: string;
  submitted_by?: string;
  payroll_entries?: PayrollEntry[];
}

interface PayrollEntry {
  id: string;
  payroll_period_id: string;
  employee_id: string;
  regular_hours: number;
  overtime_hours: number;
  regular_pay: number;
  overtime_pay: number;
  total_tips: number;
  gross_pay: number;
  deductions: number;
  net_pay: number;
  status: 'draft' | 'processed' | 'paid';
  employees: {
    first_name: string;
    last_name: string;
    employee_number: string;
    role: string;
    hourly_wage: number;
    overtime_rate: number;
    tip_eligible: boolean;
  };
  manual_adjustments?: number;
  anomaly_flags?: string[];
}

interface PayrollConfig {
  pay_schedule: 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';
  pay_period_start_day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  default_timezone: string;
  overtime_threshold: number;
  minimum_wage: number;
  auto_calculate_overtime: boolean;
  tip_handling_method: 'pooled' | 'individual' | 'hybrid';
  holiday_pay_enabled: boolean;
  auto_lock_on_submit: boolean;
}

export const Payroll: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { exportData, loading: exportLoading } = useExport();
  
  // State management
  const [payrollPeriods, setPayrollPeriods] = useState<PayrollPeriod[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState<PayrollPeriod | null>(null);
  const [payrollEntries, setPayrollEntries] = useState<PayrollEntry[]>([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PayrollEntry | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  // Configuration state
  const [payrollConfig, setPayrollConfig] = useState<PayrollConfig>({
    pay_schedule: 'weekly',
    pay_period_start_day: 'monday',
    default_timezone: 'America/New_York',
    overtime_threshold: 40,
    minimum_wage: 15.00,
    auto_calculate_overtime: true,
    tip_handling_method: 'pooled',
    holiday_pay_enabled: false,
    auto_lock_on_submit: true
  });
  
  // Create period form
  const [createForm, setCreateForm] = useState({
    period_name: '',
    start_date: '',
    end_date: '',
    pay_date: ''
  });
  
  // Edit entry form
  const [editForm, setEditForm] = useState({
    regular_hours: '',
    overtime_hours: '',
    manual_adjustments: '',
    total_tips: '',
    deductions: ''
  });

  useEffect(() => {
    loadPayrollConfig();
    loadPayrollPeriods();
    loadEmployees();
  }, [user]);

  useEffect(() => {
    if (currentPeriod) {
      loadPayrollEntries(currentPeriod.id);
    }
  }, [currentPeriod]);

  const loadPayrollConfig = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setPayrollConfig({
          pay_schedule: data.pay_schedule_frequency || 'weekly',
          pay_period_start_day: 'monday',
          default_timezone: 'America/New_York',
          overtime_threshold: 40,
          minimum_wage: 15.00,
          auto_calculate_overtime: true,
          tip_handling_method: data.tip_handling_method || 'pooled',
          holiday_pay_enabled: false,
          auto_lock_on_submit: true
        });
      }
    } catch (error) {
      console.error('Error loading payroll config:', error);
    }
  };

  const loadPayrollPeriods = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payroll_periods')
        .select('*')
        .eq('business_id', user.id)
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      
      setPayrollPeriods(data || []);
      
      // Set current period to the most recent draft/processing period
      const activePeriod = data?.find(p => p.status === 'draft' || p.status === 'processing');
      if (activePeriod) {
        setCurrentPeriod(activePeriod);
      }
    } catch (error) {
      console.error('Error loading payroll periods:', error);
      toast({
        title: 'Error Loading Payroll',
        description: 'Failed to load payroll periods. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPayrollEntries = async (periodId: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payroll_entries')
        .select(`
          *,
          employees!inner(
            first_name,
            last_name,
            employee_number,
            role,
            hourly_wage,
            overtime_rate,
            tip_eligible
          )
        `)
        .eq('payroll_period_id', periodId)
        .order('employees.first_name');
      
      if (error) throw error;
      setPayrollEntries(data || []);
    } catch (error) {
      console.error('Error loading payroll entries:', error);
      toast({
        title: 'Error Loading Payroll Entries',
        description: 'Failed to load payroll entries. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('business_id', user.id)
        .eq('status', 'active')
        .order('first_name');
      
      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const generatePayrollPeriod = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Calculate period dates based on schedule
      const startDate = new Date(createForm.start_date);
      const endDate = new Date(createForm.end_date);
      const payDate = new Date(createForm.pay_date);
      
      // Create payroll period
      const { data: periodData, error: periodError } = await supabase
        .from('payroll_periods')
        .insert([{
          business_id: user.id,
          period_name: createForm.period_name,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          pay_date: payDate.toISOString().split('T')[0],
          status: 'draft',
          total_hours: 0,
          total_gross_pay: 0,
          total_net_pay: 0,
          total_tips: 0,
          total_deductions: 0
        }])
        .select()
        .single();
      
      if (periodError) throw periodError;
      
      // Generate payroll entries for all active employees
      const activeEmployees = employees.filter((emp: any) => emp.status === 'active');
      const payrollEntries = [];
      
      for (const employee of activeEmployees) {
        // Calculate hours and pay from shifts in this period
        const { data: shifts, error: shiftsError } = await supabase
          .from('shifts')
          .select('*')
          .eq('employee_id', employee.id)
          .eq('business_id', user.id)
          .gte('start_time', startDate.toISOString())
          .lte('start_time', endDate.toISOString())
          .eq('status', 'completed');
        
        if (shiftsError) throw shiftsError;
        
        // Calculate hours and pay
        const totalMinutes = shifts?.reduce((sum, shift) => sum + (shift.duration_minutes || 0), 0) || 0;
        const totalHours = totalMinutes / 60;
        const regularHours = Math.min(totalHours, payrollConfig.overtime_threshold);
        const overtimeHours = Math.max(0, totalHours - payrollConfig.overtime_threshold);
        
        const regularPay = regularHours * (employee.hourly_wage || 0);
        const overtimePay = overtimeHours * (employee.overtime_rate || employee.hourly_wage * 1.5);
        
        // Calculate tips
        const { data: tips, error: tipsError } = await supabase
          .from('tip_entries')
          .select('*')
          .eq('employee_id', employee.id)
          .eq('business_id', user.id)
          .gte('timestamp', startDate.toISOString())
          .lte('timestamp', endDate.toISOString());
        
        if (tipsError) throw tipsError;
        
        const totalTips = tips?.reduce((sum, tip) => sum + (tip.amount || 0), 0) || 0;
        const grossPay = regularPay + overtimePay + totalTips;
        
        // Calculate deductions (basic tax estimate)
        const taxRate = 0.25; // 25% combined tax rate estimate
        const deductions = grossPay * taxRate;
        const netPay = grossPay - deductions;
        
        // Check for anomalies
        const anomalyFlags = [];
        if (overtimeHours > 20) anomalyFlags.push('excessive_overtime');
        if (totalTips > grossPay * 0.5) anomalyFlags.push('high_tip_ratio');
        if (regularHours < 1) anomalyFlags.push('minimal_hours');
        
        payrollEntries.push({
          payroll_period_id: periodData.id,
          employee_id: employee.id,
          regular_hours: regularHours,
          overtime_hours: overtimeHours,
          regular_pay: regularPay,
          overtime_pay: overtimePay,
          total_tips: totalTips,
          gross_pay: grossPay,
          deductions: deductions,
          net_pay: netPay,
          status: 'draft',
          manual_adjustments: 0,
          anomaly_flags: anomalyFlags
        });
      }
      
      // Insert payroll entries
      const { error: entriesError } = await supabase
        .from('payroll_entries')
        .insert(payrollEntries);
      
      if (entriesError) throw entriesError;
      
      // Update period totals
      const totals = payrollEntries.reduce((acc, entry) => ({
        total_hours: acc.total_hours + entry.regular_hours + entry.overtime_hours,
        total_gross_pay: acc.total_gross_pay + entry.gross_pay,
        total_net_pay: acc.total_net_pay + entry.net_pay,
        total_tips: acc.total_tips + entry.total_tips,
        total_deductions: acc.total_deductions + entry.deductions
      }), { total_hours: 0, total_gross_pay: 0, total_net_pay: 0, total_tips: 0, total_deductions: 0 });
      
      const { error: updateError } = await supabase
        .from('payroll_periods')
        .update(totals)
        .eq('id', periodData.id);
      
      if (updateError) throw updateError;
      
      // Log the action
      await supabase
        .from('audit_logs')
        .insert([{
          business_id: user.id,
          user_id: user.id,
          action: 'payroll_period_created',
          entity_type: 'payroll_period',
          entity_id: periodData.id,
          new_data: { ...periodData, entries_count: payrollEntries.length }
        }]);
      
      toast({
        title: 'Payroll Period Created',
        description: `${createForm.period_name} has been created with ${payrollEntries.length} entries.`,
      });
      
      // Reset form
      setCreateForm({
        period_name: '',
        start_date: '',
        end_date: '',
        pay_date: ''
      });
      
      setShowCreateDialog(false);
      await loadPayrollPeriods();
    } catch (error) {
      console.error('Error creating payroll period:', error);
      toast({
        title: 'Error Creating Payroll Period',
        description: 'Failed to create payroll period. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const recalculatePayroll = async () => {
    if (!currentPeriod || !user) return;
    
    setLoading(true);
    try {
      // Recalculate all entries for the current period
      const { data: entries, error } = await supabase
        .from('payroll_entries')
        .select(`
          *,
          employees!inner(hourly_wage, overtime_rate)
        `)
        .eq('payroll_period_id', currentPeriod.id);
      
      if (error) throw error;
      
      const updates = [];
      let totalHours = 0;
      let totalGrossPay = 0;
      let totalNetPay = 0;
      let totalTips = 0;
      let totalDeductions = 0;
      
      for (const entry of entries) {
        const regularPay = entry.regular_hours * entry.employees.hourly_wage;
        const overtimePay = entry.overtime_hours * entry.employees.overtime_rate;
        const grossPay = regularPay + overtimePay + entry.total_tips + (entry.manual_adjustments || 0);
        const taxRate = 0.25;
        const deductions = grossPay * taxRate;
        const netPay = grossPay - deductions;
        
        updates.push({
          id: entry.id,
          regular_pay: regularPay,
          overtime_pay: overtimePay,
          gross_pay: grossPay,
          deductions: deductions,
          net_pay: netPay
        });
        
        totalHours += entry.regular_hours + entry.overtime_hours;
        totalGrossPay += grossPay;
        totalNetPay += netPay;
        totalTips += entry.total_tips;
        totalDeductions += deductions;
      }
      
      // Update all entries
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('payroll_entries')
          .update(update)
          .eq('id', update.id);
        
        if (updateError) throw updateError;
      }
      
      // Update period totals
      const { error: periodError } = await supabase
        .from('payroll_periods')
        .update({
          total_hours: totalHours,
          total_gross_pay: totalGrossPay,
          total_net_pay: totalNetPay,
          total_tips: totalTips,
          total_deductions: totalDeductions
        })
        .eq('id', currentPeriod.id);
      
      if (periodError) throw periodError;
      
      toast({
        title: 'Payroll Recalculated',
        description: 'All payroll calculations have been updated.',
      });
      
      await loadPayrollPeriods();
      if (currentPeriod) {
        await loadPayrollEntries(currentPeriod.id);
      }
    } catch (error) {
      console.error('Error recalculating payroll:', error);
      toast({
        title: 'Error Recalculating Payroll',
        description: 'Failed to recalculate payroll. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const lockPayrollPeriod = async (periodId: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('payroll_periods')
        .update({ status: 'locked' })
        .eq('id', periodId);
      
      if (error) throw error;
      
      await supabase
        .from('audit_logs')
        .insert([{
          business_id: user.id,
          user_id: user.id,
          action: 'payroll_period_locked',
          entity_type: 'payroll_period',
          entity_id: periodId
        }]);
      
      toast({
        title: 'Payroll Period Locked',
        description: 'The payroll period has been locked and can no longer be edited.',
      });
      
      await loadPayrollPeriods();
    } catch (error) {
      console.error('Error locking payroll period:', error);
      toast({
        title: 'Error Locking Payroll',
        description: 'Failed to lock payroll period. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const submitPayroll = async () => {
    if (!currentPeriod || !user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('payroll_periods')
        .update({
          status: payrollConfig.auto_lock_on_submit ? 'completed' : 'processing',
          submitted_at: new Date().toISOString(),
          submitted_by: user.id
        })
        .eq('id', currentPeriod.id);
      
      if (error) throw error;
      
      await supabase
        .from('audit_logs')
        .insert([{
          business_id: user.id,
          user_id: user.id,
          action: 'payroll_submitted',
          entity_type: 'payroll_period',
          entity_id: currentPeriod.id
        }]);
      
      toast({
        title: 'Payroll Submitted',
        description: 'Payroll has been submitted successfully.',
      });
      
      await loadPayrollPeriods();
    } catch (error) {
      console.error('Error submitting payroll:', error);
      toast({
        title: 'Error Submitting Payroll',
        description: 'Failed to submit payroll. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditEntry = (entry: PayrollEntry) => {
    setEditingEntry(entry);
    setEditForm({
      regular_hours: entry.regular_hours.toString(),
      overtime_hours: entry.overtime_hours.toString(),
      manual_adjustments: (entry.manual_adjustments || 0).toString(),
      total_tips: entry.total_tips.toString(),
      deductions: entry.deductions.toString()
    });
    setShowEditDialog(true);
  };

  const saveEntryEdit = async () => {
    if (!editingEntry || !user) return;
    
    setLoading(true);
    try {
      const regularHours = parseFloat(editForm.regular_hours) || 0;
      const overtimeHours = parseFloat(editForm.overtime_hours) || 0;
      const manualAdjustments = parseFloat(editForm.manual_adjustments) || 0;
      const totalTips = parseFloat(editForm.total_tips) || 0;
      const deductions = parseFloat(editForm.deductions) || 0;
      
      const regularPay = regularHours * editingEntry.employees.hourly_wage;
      const overtimePay = overtimeHours * editingEntry.employees.overtime_rate;
      const grossPay = regularPay + overtimePay + totalTips + manualAdjustments;
      const netPay = grossPay - deductions;
      
      const { error } = await supabase
        .from('payroll_entries')
        .update({
          regular_hours: regularHours,
          overtime_hours: overtimeHours,
          regular_pay: regularPay,
          overtime_pay: overtimePay,
          total_tips: totalTips,
          manual_adjustments: manualAdjustments,
          deductions: deductions,
          gross_pay: grossPay,
          net_pay: netPay
        })
        .eq('id', editingEntry.id);
      
      if (error) throw error;
      
      await supabase
        .from('audit_logs')
        .insert([{
          business_id: user.id,
          user_id: user.id,
          action: 'payroll_entry_modified',
          entity_type: 'payroll_entry',
          entity_id: editingEntry.id,
          old_data: editingEntry,
          new_data: {
            regular_hours: regularHours,
            overtime_hours: overtimeHours,
            manual_adjustments: manualAdjustments,
            total_tips: totalTips,
            deductions: deductions
          }
        }]);
      
      toast({
        title: 'Entry Updated',
        description: 'Payroll entry has been updated successfully.',
      });
      
      setShowEditDialog(false);
      setEditingEntry(null);
      
      if (currentPeriod) {
        await loadPayrollEntries(currentPeriod.id);
      }
    } catch (error) {
      console.error('Error updating payroll entry:', error);
      toast({
        title: 'Error Updating Entry',
        description: 'Failed to update payroll entry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportPayroll = async () => {
    if (!currentPeriod) return;
    
    await exportData({
      format: 'csv',
      includeEmployees: true,
      includeShifts: true,
      includeTips: true,
      includeAuditLogs: false,
      dateRange: {
        start: new Date(currentPeriod.start_date),
        end: new Date(currentPeriod.end_date)
      }
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      processing: { color: 'bg-blue-100 text-blue-800', label: 'Processing' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      locked: { color: 'bg-red-100 text-red-800', label: 'Locked' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getAnomalyBadge = (flags: string[]) => {
    if (!flags || flags.length === 0) return null;
    
    return (
      <Badge className="bg-yellow-100 text-yellow-800">
        {flags.length} Issue{flags.length > 1 ? 's' : ''}
      </Badge>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Payroll Management</h1>
          <p className="text-muted-foreground">
            Create and manage payroll periods with comprehensive calculations and validations
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={handleExportPayroll} 
            disabled={exportLoading || !currentPeriod}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Payroll
          </Button>
          <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configure
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Payroll Configuration</DialogTitle>
                <DialogDescription>
                  Configure your payroll settings and preferences
                </DialogDescription>
              </DialogHeader>
              {/* Configuration form content would go here */}
            </DialogContent>
          </Dialog>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Period
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Payroll Period</DialogTitle>
                <DialogDescription>
                  Create a new payroll period and automatically calculate employee pay
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="periodName">Period Name</Label>
                  <Input
                    id="periodName"
                    value={createForm.period_name}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, period_name: e.target.value }))}
                    placeholder="e.g., Week ending 2024-01-15"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={createForm.start_date}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, start_date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={createForm.end_date}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, end_date: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payDate">Pay Date</Label>
                  <Input
                    id="payDate"
                    type="date"
                    value={createForm.pay_date}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, pay_date: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={generatePayrollPeriod} disabled={loading}>
                  {loading ? 'Creating...' : 'Create Period'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Current Period Overview */}
      {currentPeriod && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {currentPeriod.period_name}
                </CardTitle>
                <CardDescription>
                  {new Date(currentPeriod.start_date).toLocaleDateString()} - {new Date(currentPeriod.end_date).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(currentPeriod.status)}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={recalculatePayroll}
                  disabled={loading || currentPeriod.status === 'locked'}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Recalculate
                </Button>
                {currentPeriod.status === 'draft' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => lockPayrollPeriod(currentPeriod.id)}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Lock
                  </Button>
                )}
                {currentPeriod.status === 'draft' && (
                  <Button
                    size="sm"
                    onClick={submitPayroll}
                    disabled={loading}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{currentPeriod.total_hours.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Total Hours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">${currentPeriod.total_gross_pay.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Gross Pay</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">${currentPeriod.total_tips.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Total Tips</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">${currentPeriod.total_deductions.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Deductions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">${currentPeriod.total_net_pay.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Net Pay</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payroll Entries Table */}
      {currentPeriod && (
        <Card>
          <CardHeader>
            <CardTitle>Employee Payroll Entries</CardTitle>
            <CardDescription>
              Individual payroll calculations for {currentPeriod.period_name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Regular Hours</TableHead>
                      <TableHead>OT Hours</TableHead>
                      <TableHead>Regular Pay</TableHead>
                      <TableHead>OT Pay</TableHead>
                      <TableHead>Tips</TableHead>
                      <TableHead>Gross Pay</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Net Pay</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {entry.employees.first_name} {entry.employees.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {entry.employees.employee_number} • {entry.employees.role}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{entry.regular_hours.toFixed(1)}</TableCell>
                        <TableCell>{entry.overtime_hours.toFixed(1)}</TableCell>
                        <TableCell>${entry.regular_pay.toFixed(2)}</TableCell>
                        <TableCell>${entry.overtime_pay.toFixed(2)}</TableCell>
                        <TableCell>${entry.total_tips.toFixed(2)}</TableCell>
                        <TableCell>${entry.gross_pay.toFixed(2)}</TableCell>
                        <TableCell>${entry.deductions.toFixed(2)}</TableCell>
                        <TableCell className="font-medium">${entry.net_pay.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(entry.status)}
                            {entry.anomaly_flags && getAnomalyBadge(entry.anomaly_flags)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditEntry(entry)}
                              disabled={currentPeriod.status === 'locked'}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {payrollEntries.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No payroll entries found for this period</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Entry Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Payroll Entry</DialogTitle>
            <DialogDescription>
              Modify payroll details for this employee. Changes will be logged for audit purposes.
            </DialogDescription>
          </DialogHeader>
          
          {editingEntry && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium">
                  {editingEntry.employees.first_name} {editingEntry.employees.last_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {editingEntry.employees.employee_number} • {editingEntry.employees.role}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="regularHours">Regular Hours</Label>
                  <Input
                    id="regularHours"
                    type="number"
                    step="0.1"
                    value={editForm.regular_hours}
                    onChange={(e) => setEditForm(prev => ({ ...prev, regular_hours: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overtimeHours">Overtime Hours</Label>
                  <Input
                    id="overtimeHours"
                    type="number"
                    step="0.1"
                    value={editForm.overtime_hours}
                    onChange={(e) => setEditForm(prev => ({ ...prev, overtime_hours: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalTips">Total Tips</Label>
                  <Input
                    id="totalTips"
                    type="number"
                    step="0.01"
                    value={editForm.total_tips}
                    onChange={(e) => setEditForm(prev => ({ ...prev, total_tips: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manualAdjustments">Manual Adjustments</Label>
                  <Input
                    id="manualAdjustments"
                    type="number"
                    step="0.01"
                    value={editForm.manual_adjustments}
                    onChange={(e) => setEditForm(prev => ({ ...prev, manual_adjustments: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deductions">Deductions</Label>
                <Input
                  id="deductions"
                  type="number"
                  step="0.01"
                  value={editForm.deductions}
                  onChange={(e) => setEditForm(prev => ({ ...prev, deductions: e.target.value }))}
                />
              </div>
              
              {/* Earnings Preview */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="h-4 w-4" />
                  <span className="font-medium">Calculation Preview</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>Regular Pay: ${((parseFloat(editForm.regular_hours) || 0) * editingEntry.employees.hourly_wage).toFixed(2)}</div>
                  <div>Overtime Pay: ${((parseFloat(editForm.overtime_hours) || 0) * editingEntry.employees.overtime_rate).toFixed(2)}</div>
                  <div>Tips: ${(parseFloat(editForm.total_tips) || 0).toFixed(2)}</div>
                  <div>Adjustments: ${(parseFloat(editForm.manual_adjustments) || 0).toFixed(2)}</div>
                  <div>Deductions: ${(parseFloat(editForm.deductions) || 0).toFixed(2)}</div>
                  <div className="font-medium border-t pt-1">
                    Net Pay: ${(() => {
                      const regular = (parseFloat(editForm.regular_hours) || 0) * editingEntry.employees.hourly_wage;
                      const overtime = (parseFloat(editForm.overtime_hours) || 0) * editingEntry.employees.overtime_rate;
                      const tips = parseFloat(editForm.total_tips) || 0;
                      const adjustments = parseFloat(editForm.manual_adjustments) || 0;
                      const deductions = parseFloat(editForm.deductions) || 0;
                      return (regular + overtime + tips + adjustments - deductions).toFixed(2);
                    })()}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={saveEntryEdit} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
