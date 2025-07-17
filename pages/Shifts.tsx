
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
import { supabase } from '@/lib/supabase';
import { 
  Clock, 
  Calendar, 
  Edit, 
  Save, 
  X,
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Download, 
  Search, 
  Filter,
  Plus,
  Minus,
  Timer,
  PlayCircle,
  StopCircle,
  PauseCircle,
  BarChart3,
  MapPin,
  FileText,
  Eye,
  Calculator
} from 'lucide-react';

interface Shift {
  id: string;
  employee_id: string;
  business_id: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  job_code?: string;
  location_id?: string;
  status: 'active' | 'completed' | 'pending_review';
  created_at: string;
  updated_at: string;
  employees: {
    first_name: string;
    last_name: string;
    employee_number: string;
    role: string;
    hourly_wage: number;
    overtime_rate: number;
  };
}

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  employee_number: string;
  role: string;
  hourly_wage: number;
  overtime_rate: number;
  status: string;
}

export const Shifts: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { exportData, loading: exportLoading } = useExport();
  
  // State management
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('today');
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('shifts');
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    start_time: '',
    end_time: '',
    duration_minutes: '',
    job_code: '',
    status: 'completed' as 'active' | 'completed' | 'pending_review'
  });

  const jobCodes = [
    { value: 'regular', label: 'Regular Shift' },
    { value: 'opening', label: 'Opening' },
    { value: 'closing', label: 'Closing' },
    { value: 'double', label: 'Double Shift' },
    { value: 'training', label: 'Training' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'event', label: 'Special Event' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    loadShifts();
    loadEmployees();
  }, [user, dateFilter]);

  const loadShifts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('shifts')
        .select(`
          *,
          employees!inner(
            first_name, 
            last_name, 
            employee_number, 
            role, 
            hourly_wage, 
            overtime_rate
          )
        `)
        .eq('business_id', user.id)
        .order('start_time', { ascending: false });

      // Apply date filter
      const now = new Date();
      let startDate = new Date();
      let endDate = new Date();

      switch (dateFilter) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'week':
          startDate.setDate(now.getDate() - now.getDay());
          startDate.setHours(0, 0, 0, 0);
          endDate.setDate(startDate.getDate() + 6);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
          break;
        case 'all':
        default:
          // No date filter
          break;
      }

      if (dateFilter !== 'all') {
        query = query
          .gte('start_time', startDate.toISOString())
          .lte('start_time', endDate.toISOString());
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setShifts(data || []);
    } catch (error) {
      console.error('Error loading shifts:', error);
      toast({
        title: 'Error Loading Shifts',
        description: 'Failed to load shift data. Please try again.',
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

  const openEditDialog = (shift: Shift) => {
    setEditingShift(shift);
    setEditForm({
      start_time: shift.start_time ? new Date(shift.start_time).toISOString().slice(0, 16) : '',
      end_time: shift.end_time ? new Date(shift.end_time).toISOString().slice(0, 16) : '',
      duration_minutes: shift.duration_minutes?.toString() || '',
      job_code: shift.job_code || '',
      status: shift.status
    });
    setShowEditDialog(true);
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return 0;
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    return Math.round(diffMs / (1000 * 60)); // Convert to minutes
  };

  const saveShiftEdit = async () => {
    if (!editingShift || !user) return;
    
    setLoading(true);
    try {
      // Calculate duration if both start and end times are provided
      let duration = editForm.duration_minutes ? parseInt(editForm.duration_minutes) : null;
      
      if (editForm.start_time && editForm.end_time && !duration) {
        duration = calculateDuration(editForm.start_time, editForm.end_time);
      }

      const updateData = {
        start_time: editForm.start_time || editingShift.start_time,
        end_time: editForm.end_time || null,
        duration_minutes: duration,
        job_code: editForm.job_code || null,
        status: editForm.status,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('shifts')
        .update(updateData)
        .eq('id', editingShift.id);

      if (error) throw error;

      // Log the action
      await supabase
        .from('audit_logs')
        .insert([{
          business_id: user.id,
          user_id: user.id,
          action: 'shift_updated',
          entity_type: 'shift',
          entity_id: editingShift.id,
          old_data: editingShift,
          new_data: updateData
        }]);

      toast({
        title: 'Shift Updated',
        description: 'Shift hours have been updated successfully.',
      });

      setShowEditDialog(false);
      setEditingShift(null);
      await loadShifts();
    } catch (error) {
      console.error('Error updating shift:', error);
      toast({
        title: 'Error Updating Shift',
        description: 'Failed to update shift. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    await exportData({
      format: 'csv',
      includeEmployees: false,
      includeShifts: true,
      includeTips: false,
      includeAuditLogs: false,
      dateRange: dateFilter !== 'all' ? getDateRange() : undefined
    });
  };

  const getDateRange = () => {
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (dateFilter) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'week':
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      default:
        return undefined;
    }

    return { start: startDate, end: endDate };
  };

  const filteredShifts = shifts.filter(shift => {
    const matchesSearch = 
      shift.employees.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.employees.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.employees.employee_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.job_code?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || shift.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      completed: { color: 'bg-blue-100 text-blue-800', label: 'Completed' },
      pending_review: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.completed;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatDuration = (minutes: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const calculateEarnings = (shift: Shift) => {
    if (!shift.duration_minutes || !shift.employees.hourly_wage) return 0;
    
    const hours = shift.duration_minutes / 60;
    const regularHours = Math.min(hours, 8);
    const overtimeHours = Math.max(0, hours - 8);
    
    const regularPay = regularHours * shift.employees.hourly_wage;
    const overtimePay = overtimeHours * (shift.employees.overtime_rate || shift.employees.hourly_wage * 1.5);
    
    return regularPay + overtimePay;
  };

  const getShiftStats = () => {
    const totalHours = filteredShifts.reduce((sum, shift) => sum + (shift.duration_minutes || 0), 0) / 60;
    const totalEarnings = filteredShifts.reduce((sum, shift) => sum + calculateEarnings(shift), 0);
    const activeShifts = filteredShifts.filter(s => s.status === 'active').length;
    const completedShifts = filteredShifts.filter(s => s.status === 'completed').length;
    
    return {
      totalShifts: filteredShifts.length,
      totalHours: totalHours.toFixed(1),
      totalEarnings: totalEarnings.toFixed(2),
      activeShifts,
      completedShifts,
      averageShiftLength: filteredShifts.length > 0 ? (totalHours / filteredShifts.length).toFixed(1) : '0'
    };
  };

  const stats = getShiftStats();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Time & Labor Management</h1>
          <p className="text-muted-foreground">
            Track active shifts and manage labor hours (no start/stop to prevent conflicts)
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={handleExport} 
            disabled={exportLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Shifts
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Shifts</p>
                <p className="text-2xl font-bold">{stats.totalShifts}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.activeShifts}</p>
              </div>
              <PlayCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completedShifts}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold">{stats.totalHours}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Length</p>
                <p className="text-2xl font-bold">{stats.averageShiftLength}h</p>
              </div>
              <Timer className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Earnings</p>
                <p className="text-2xl font-bold">${stats.totalEarnings}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search shifts..."
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert about no start/stop functionality */}
      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Labor Management Mode:</strong> This page tracks existing shifts and allows hours editing only. 
          Start/stop functionality is disabled to prevent conflicts with payroll data. Use the "Edit Hours" feature 
          to modify existing shift records.
        </AlertDescription>
      </Alert>

      {/* Shifts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shift Records</CardTitle>
          <CardDescription>
            View and manage existing shift records with hours editing capabilities
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
                    <TableHead>Date</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Job Code</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShifts.map((shift) => (
                    <TableRow key={shift.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {shift.employees.first_name} {shift.employees.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {shift.employees.employee_number} • {shift.employees.role}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(shift.start_time).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(shift.start_time).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {shift.end_time ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(shift.end_time).toLocaleTimeString()}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">In Progress</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          {formatDuration(shift.duration_minutes || 0)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {shift.job_code ? (
                          <Badge variant="outline" className="capitalize">
                            {shift.job_code.replace('_', ' ')}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {calculateEarnings(shift).toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(shift.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(shift)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredShifts.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No shifts found for the selected period</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Hours Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Shift Hours</DialogTitle>
            <DialogDescription>
              Modify shift times and details. Changes will be logged for audit purposes.
            </DialogDescription>
          </DialogHeader>
          
          {editingShift && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Employee</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">
                    {editingShift.employees.first_name} {editingShift.employees.last_name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {editingShift.employees.employee_number} • {editingShift.employees.role}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={editForm.start_time}
                    onChange={(e) => setEditForm(prev => ({ ...prev, start_time: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={editForm.end_time}
                    onChange={(e) => setEditForm(prev => ({ ...prev, end_time: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={editForm.duration_minutes}
                    onChange={(e) => setEditForm(prev => ({ ...prev, duration_minutes: e.target.value }))}
                    placeholder="Auto-calculated from times"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobCode">Job Code</Label>
                  <Select value={editForm.job_code} onValueChange={(value) => setEditForm(prev => ({ ...prev, job_code: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job code" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobCodes.map((code) => (
                        <SelectItem key={code.value} value={code.value}>
                          {code.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={editForm.status} onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value as 'active' | 'completed' | 'pending_review' }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending_review">Pending Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Earnings Preview */}
              {editForm.start_time && editForm.end_time && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="h-4 w-4" />
                    <span className="font-medium">Earnings Preview</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>Duration: {formatDuration(calculateDuration(editForm.start_time, editForm.end_time))}</div>
                    <div>Hourly Rate: ${editingShift.employees.hourly_wage.toFixed(2)}</div>
                    <div>Overtime Rate: ${(editingShift.employees.overtime_rate || editingShift.employees.hourly_wage * 1.5).toFixed(2)}</div>
                    <div className="font-medium">
                      Total Earnings: ${(() => {
                        const duration = calculateDuration(editForm.start_time, editForm.end_time);
                        const hours = duration / 60;
                        const regularHours = Math.min(hours, 8);
                        const overtimeHours = Math.max(0, hours - 8);
                        const regularPay = regularHours * editingShift.employees.hourly_wage;
                        const overtimePay = overtimeHours * (editingShift.employees.overtime_rate || editingShift.employees.hourly_wage * 1.5);
                        return (regularPay + overtimePay).toFixed(2);
                      })()}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={saveShiftEdit} disabled={loading}>
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
