
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useExport } from '@/hooks/useExport';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  DollarSign, 
  Calendar, 
  MapPin, 
  FileText, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  MoreVertical,
  UserPlus,
  UserCheck,
  UserX,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Eye
} from 'lucide-react';

interface Employee {
  id: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  hire_date: string;
  termination_date?: string;
  status: 'active' | 'inactive' | 'terminated' | 'invited';
  hourly_wage: number;
  overtime_rate: number;
  tip_eligible: boolean;
  tax_exemptions: number;
  tax_filing_status: string;
  pay_frequency: string;
  bank_account_number?: string;
  routing_number?: string;
  invite_sent_at?: string;
  invite_accepted_at?: string;
  users?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export const Employees: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { exportData, loading: exportLoading } = useExport();
  
  // State management
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Add employee form state
  const [newEmployee, setNewEmployee] = useState({
    employee_number: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: '',
    hire_date: new Date().toISOString().split('T')[0],
    hourly_wage: '',
    overtime_rate: '',
    tip_eligible: true,
    tax_exemptions: 0,
    tax_filing_status: 'single',
    pay_frequency: 'weekly',
    bank_account_number: '',
    routing_number: '',
    send_invite: false
  });

  const employeeRoles = [
    { value: 'server', label: 'Server' },
    { value: 'bartender', label: 'Bartender' },
    { value: 'host', label: 'Host/Hostess' },
    { value: 'busser', label: 'Busser' },
    { value: 'cook', label: 'Cook' },
    { value: 'manager', label: 'Manager' },
    { value: 'cashier', label: 'Cashier' },
    { value: 'food_runner', label: 'Food Runner' },
    { value: 'kitchen_staff', label: 'Kitchen Staff' },
    { value: 'other', label: 'Other' }
  ];

  const taxFilingStatuses = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married Filing Jointly' },
    { value: 'married_separate', label: 'Married Filing Separately' },
    { value: 'head_of_household', label: 'Head of Household' }
  ];

  const payFrequencies = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'semi_monthly', label: 'Semi-monthly' }
  ];

  useEffect(() => {
    loadEmployees();
  }, [user]);

  const loadEmployees = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          users(first_name, last_name, email)
        `)
        .eq('business_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast({
        title: 'Error Loading Employees',
        description: 'Failed to load employee data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateEmployeeNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    return `EMP${timestamp}${random}`;
  };

  const addEmployee = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Validate required fields
      if (!newEmployee.first_name || !newEmployee.last_name || !newEmployee.role) {
        toast({
          title: 'Missing Required Fields',
          description: 'Please fill in first name, last name, and role.',
          variant: 'destructive',
        });
        return;
      }

      // Generate employee number if not provided
      const employeeNumber = newEmployee.employee_number || generateEmployeeNumber();
      
      // Calculate overtime rate if not provided
      const overtimeRate = newEmployee.overtime_rate 
        ? parseFloat(newEmployee.overtime_rate) 
        : (newEmployee.hourly_wage ? parseFloat(newEmployee.hourly_wage) * 1.5 : null);

      const employeeData = {
        business_id: user.id,
        employee_number: employeeNumber,
        first_name: newEmployee.first_name,
        last_name: newEmployee.last_name,
        email: newEmployee.email || null,
        phone: newEmployee.phone || null,
        role: newEmployee.role,
        hire_date: newEmployee.hire_date,
        status: newEmployee.send_invite && newEmployee.email ? 'invited' : 'active',
        hourly_wage: newEmployee.hourly_wage ? parseFloat(newEmployee.hourly_wage) : null,
        overtime_rate: overtimeRate,
        tip_eligible: newEmployee.tip_eligible,
        tax_exemptions: newEmployee.tax_exemptions,
        tax_filing_status: newEmployee.tax_filing_status,
        pay_frequency: newEmployee.pay_frequency,
        bank_account_number: newEmployee.bank_account_number || null,
        routing_number: newEmployee.routing_number || null,
        invite_sent_at: newEmployee.send_invite && newEmployee.email ? new Date().toISOString() : null
      };

      const { data, error } = await supabase
        .from('employees')
        .insert([employeeData])
        .select()
        .single();

      if (error) throw error;

      // Log the action
      await supabase
        .from('audit_logs')
        .insert([{
          business_id: user.id,
          user_id: user.id,
          action: 'employee_created',
          entity_type: 'employee',
          entity_id: data.id,
          new_data: employeeData
        }]);

      toast({
        title: 'Employee Added',
        description: `${newEmployee.first_name} ${newEmployee.last_name} has been added successfully.`,
      });

      // Reset form
      setNewEmployee({
        employee_number: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        role: '',
        hire_date: new Date().toISOString().split('T')[0],
        hourly_wage: '',
        overtime_rate: '',
        tip_eligible: true,
        tax_exemptions: 0,
        tax_filing_status: 'single',
        pay_frequency: 'weekly',
        bank_account_number: '',
        routing_number: '',
        send_invite: false
      });

      setShowAddDialog(false);
      await loadEmployees();
    } catch (error) {
      console.error('Error adding employee:', error);
      toast({
        title: 'Error Adding Employee',
        description: 'Failed to add employee. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (employeeId: string, updates: Partial<Employee>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('employees')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', employeeId);

      if (error) throw error;

      // Log the action
      await supabase
        .from('audit_logs')
        .insert([{
          business_id: user.id,
          user_id: user.id,
          action: 'employee_updated',
          entity_type: 'employee',
          entity_id: employeeId,
          new_data: updates
        }]);

      toast({
        title: 'Employee Updated',
        description: 'Employee information has been updated successfully.',
      });

      await loadEmployees();
    } catch (error) {
      console.error('Error updating employee:', error);
      toast({
        title: 'Error Updating Employee',
        description: 'Failed to update employee. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (employeeId: string) => {
    if (!user || !employeeId) return;
    
    setLoading(true);
    try {
      // Soft delete by updating status
      const { error } = await supabase
        .from('employees')
        .update({
          status: 'terminated',
          termination_date: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        })
        .eq('id', employeeId);

      if (error) throw error;

      // Log the action
      await supabase
        .from('audit_logs')
        .insert([{
          business_id: user.id,
          user_id: user.id,
          action: 'employee_terminated',
          entity_type: 'employee',
          entity_id: employeeId,
          new_data: { status: 'terminated', termination_date: new Date().toISOString().split('T')[0] }
        }]);

      toast({
        title: 'Employee Terminated',
        description: 'Employee has been terminated successfully.',
      });

      setShowDeleteDialog(false);
      setEmployeeToDelete(null);
      await loadEmployees();
    } catch (error) {
      console.error('Error terminating employee:', error);
      toast({
        title: 'Error Terminating Employee',
        description: 'Failed to terminate employee. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const sendInvitation = async (employeeId: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('employees')
        .update({
          status: 'invited',
          invite_sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', employeeId);

      if (error) throw error;

      toast({
        title: 'Invitation Sent',
        description: 'Employee invitation has been sent successfully.',
      });

      await loadEmployees();
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: 'Error Sending Invitation',
        description: 'Failed to send invitation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    await exportData({
      format: 'csv',
      includeEmployees: true,
      includeShifts: false,
      includeTips: false,
      includeAuditLogs: false
    });
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    const matchesTab = activeTab === 'all' || employee.status === activeTab;
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' },
      terminated: { color: 'bg-red-100 text-red-800', label: 'Terminated' },
      invited: { color: 'bg-blue-100 text-blue-800', label: 'Invited' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getEmployeeStats = () => {
    const stats = {
      total: employees.length,
      active: employees.filter(e => e.status === 'active').length,
      inactive: employees.filter(e => e.status === 'inactive').length,
      terminated: employees.filter(e => e.status === 'terminated').length,
      invited: employees.filter(e => e.status === 'invited').length
    };
    return stats;
  };

  const stats = getEmployeeStats();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Employee Management</h1>
          <p className="text-muted-foreground">Manage your team members and their information</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={handleExport} 
            disabled={exportLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Add a new team member to your business
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={newEmployee.first_name}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, first_name: e.target.value }))}
                        placeholder="John"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={newEmployee.last_name}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, last_name: e.target.value }))}
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={newEmployee.phone}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Employment Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Employment Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employeeNumber">Employee Number</Label>
                      <Input
                        id="employeeNumber"
                        value={newEmployee.employee_number}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, employee_number: e.target.value }))}
                        placeholder="Auto-generated if empty"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role *</Label>
                      <Select value={newEmployee.role} onValueChange={(value) => setNewEmployee(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {employeeRoles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hireDate">Hire Date</Label>
                      <Input
                        id="hireDate"
                        type="date"
                        value={newEmployee.hire_date}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, hire_date: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payFrequency">Pay Frequency</Label>
                      <Select value={newEmployee.pay_frequency} onValueChange={(value) => setNewEmployee(prev => ({ ...prev, pay_frequency: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pay frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {payFrequencies.map((freq) => (
                            <SelectItem key={freq.value} value={freq.value}>
                              {freq.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Compensation */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Compensation</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hourlyWage">Hourly Wage</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="hourlyWage"
                          type="number"
                          step="0.01"
                          min="0"
                          value={newEmployee.hourly_wage}
                          onChange={(e) => setNewEmployee(prev => ({ ...prev, hourly_wage: e.target.value }))}
                          placeholder="15.00"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="overtimeRate">Overtime Rate</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="overtimeRate"
                          type="number"
                          step="0.01"
                          min="0"
                          value={newEmployee.overtime_rate}
                          onChange={(e) => setNewEmployee(prev => ({ ...prev, overtime_rate: e.target.value }))}
                          placeholder="Auto-calculated (1.5x)"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="tipEligible"
                      checked={newEmployee.tip_eligible}
                      onCheckedChange={(checked) => setNewEmployee(prev => ({ ...prev, tip_eligible: checked as boolean }))}
                    />
                    <Label htmlFor="tipEligible">Tip Eligible</Label>
                  </div>
                </div>

                <Separator />

                {/* Tax Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tax Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taxFilingStatus">Tax Filing Status</Label>
                      <Select value={newEmployee.tax_filing_status} onValueChange={(value) => setNewEmployee(prev => ({ ...prev, tax_filing_status: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select filing status" />
                        </SelectTrigger>
                        <SelectContent>
                          {taxFilingStatuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxExemptions">Tax Exemptions</Label>
                      <Input
                        id="taxExemptions"
                        type="number"
                        min="0"
                        value={newEmployee.tax_exemptions}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, tax_exemptions: parseInt(e.target.value) || 0 }))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Banking Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Banking Information (Optional)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={newEmployee.bank_account_number}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, bank_account_number: e.target.value }))}
                        placeholder="Account number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="routingNumber">Routing Number</Label>
                      <Input
                        id="routingNumber"
                        value={newEmployee.routing_number}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, routing_number: e.target.value }))}
                        placeholder="Routing number"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Invitation */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="sendInvite"
                      checked={newEmployee.send_invite}
                      onCheckedChange={(checked) => setNewEmployee(prev => ({ ...prev, send_invite: checked as boolean }))}
                    />
                    <Label htmlFor="sendInvite">Send invitation email to employee</Label>
                  </div>
                  {newEmployee.send_invite && !newEmployee.email && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Email address is required to send an invitation.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={addEmployee} disabled={loading}>
                  {loading ? 'Adding...' : 'Add Employee'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold">{stats.inactive}</p>
              </div>
              <UserX className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Terminated</p>
                <p className="text-2xl font-bold">{stats.terminated}</p>
              </div>
              <Trash2 className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Invited</p>
                <p className="text-2xl font-bold">{stats.invited}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                  <SelectItem value="invited">Invited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
          <CardDescription>
            Manage your team members and their information
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
                    <TableHead>Role</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Hire Date</TableHead>
                    <TableHead>Wage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {employee.first_name} {employee.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {employee.employee_number}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {employee.role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {employee.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {employee.email}
                            </div>
                          )}
                          {employee.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {employee.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(employee.hire_date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {employee.hourly_wage && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {employee.hourly_wage.toFixed(2)}/hr
                          </div>
                        )}
                        {employee.tip_eligible && (
                          <div className="text-xs text-green-600">Tip Eligible</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(employee.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingEmployee(employee)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {employee.status === 'active' && employee.email && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => sendInvitation(employee.id)}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          )}
                          {employee.status !== 'terminated' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEmployeeToDelete(employee.id);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredEmployees.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No employees found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terminate Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to terminate this employee? This action will mark them as terminated and they will no longer have access to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => employeeToDelete && deleteEmployee(employeeToDelete)} disabled={loading}>
              {loading ? 'Terminating...' : 'Terminate Employee'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
