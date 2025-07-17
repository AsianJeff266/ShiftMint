import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export interface ExportData {
  employees: any[];
  shifts: any[];
  tips: any[];
  payroll: any[];
  businesses: any[];
  auditLogs: any[];
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeEmployees?: boolean;
  includeShifts?: boolean;
  includeTips?: boolean;
  includePayroll?: boolean;
  includeAuditLogs?: boolean;
  employeeIds?: string[];
}

export const useExport = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchExportData = async (options: ExportOptions): Promise<ExportData> => {
    const data: ExportData = {
      employees: [],
      shifts: [],
      tips: [],
      payroll: [],
      businesses: [],
      auditLogs: []
    };

    try {
      // Get current user's business
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Fetch business data
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', user.id)
        .single();

      if (businessError) throw businessError;
      data.businesses = [businessData];

      // Fetch employees data
      if (options.includeEmployees !== false) {
        let employeeQuery = supabase
          .from('employees')
          .select(`
            *,
            users!inner(first_name, last_name, email)
          `)
          .eq('business_id', businessData.id);

        if (options.employeeIds && options.employeeIds.length > 0) {
          employeeQuery = employeeQuery.in('id', options.employeeIds);
        }

        const { data: employeeData, error: employeeError } = await employeeQuery;
        if (employeeError) throw employeeError;
        data.employees = employeeData || [];
      }

      // Fetch shifts data
      if (options.includeShifts !== false) {
        let shiftQuery = supabase
          .from('shifts')
          .select(`
            *,
            employees!inner(first_name, last_name, employee_number, role)
          `)
          .eq('business_id', businessData.id);

        if (options.dateRange) {
          shiftQuery = shiftQuery
            .gte('start_time', options.dateRange.start.toISOString())
            .lte('start_time', options.dateRange.end.toISOString());
        }

        if (options.employeeIds && options.employeeIds.length > 0) {
          shiftQuery = shiftQuery.in('employee_id', options.employeeIds);
        }

        const { data: shiftData, error: shiftError } = await shiftQuery;
        if (shiftError) throw shiftError;
        data.shifts = shiftData || [];
      }

      // Fetch tips data
      if (options.includeTips !== false) {
        let tipQuery = supabase
          .from('tip_entries')
          .select(`
            *,
            employees!inner(first_name, last_name, employee_number, role)
          `)
          .eq('business_id', businessData.id);

        if (options.dateRange) {
          tipQuery = tipQuery
            .gte('timestamp', options.dateRange.start.toISOString())
            .lte('timestamp', options.dateRange.end.toISOString());
        }

        if (options.employeeIds && options.employeeIds.length > 0) {
          tipQuery = tipQuery.in('employee_id', options.employeeIds);
        }

        const { data: tipData, error: tipError } = await tipQuery;
        if (tipError) throw tipError;
        data.tips = tipData || [];
      }

      // Fetch audit logs
      if (options.includeAuditLogs !== false) {
        let auditQuery = supabase
          .from('audit_logs')
          .select('*')
          .eq('business_id', businessData.id)
          .order('created_at', { ascending: false });

        if (options.dateRange) {
          auditQuery = auditQuery
            .gte('created_at', options.dateRange.start.toISOString())
            .lte('created_at', options.dateRange.end.toISOString());
        }

        const { data: auditData, error: auditError } = await auditQuery;
        if (auditError) throw auditError;
        data.auditLogs = auditData || [];
      }

      return data;
    } catch (error) {
      console.error('Error fetching export data:', error);
      throw error;
    }
  };

  const formatEmployeeData = (employees: any[]) => {
    return employees.map(emp => ({
      'Employee ID': emp.employee_number || emp.id,
      'First Name': emp.users?.first_name || emp.first_name,
      'Last Name': emp.users?.last_name || emp.last_name,
      'Email': emp.users?.email || emp.email,
      'Role': emp.role,
      'Hire Date': emp.hire_date,
      'Status': emp.status,
      'Hourly Wage': emp.hourly_wage,
      'Overtime Rate': emp.overtime_rate,
      'Tip Eligible': emp.tip_eligible ? 'Yes' : 'No',
      'Phone': emp.phone,
      'Tax Filing Status': emp.tax_filing_status,
      'Pay Frequency': emp.pay_frequency
    }));
  };

  const formatShiftData = (shifts: any[]) => {
    return shifts.map(shift => ({
      'Shift ID': shift.id,
      'Employee ID': shift.employees?.employee_number || shift.employee_id,
      'Employee Name': `${shift.employees?.first_name || ''} ${shift.employees?.last_name || ''}`.trim(),
      'Role': shift.employees?.role,
      'Start Time': new Date(shift.start_time).toLocaleString(),
      'End Time': shift.end_time ? new Date(shift.end_time).toLocaleString() : 'In Progress',
      'Duration (Minutes)': shift.duration_minutes || 0,
      'Duration (Hours)': shift.duration_minutes ? (shift.duration_minutes / 60).toFixed(2) : '0.00',
      'Job Code': shift.job_code,
      'Status': shift.status,
      'Date': new Date(shift.start_time).toLocaleDateString()
    }));
  };

  const formatTipData = (tips: any[]) => {
    return tips.map(tip => ({
      'Tip ID': tip.id,
      'Employee ID': tip.employees?.employee_number || tip.employee_id,
      'Employee Name': `${tip.employees?.first_name || ''} ${tip.employees?.last_name || ''}`.trim(),
      'Role': tip.employees?.role,
      'Amount': tip.amount,
      'Tip Type': tip.tip_type,
      'Source': tip.source,
      'Table Number': tip.table_number,
      'Date': new Date(tip.timestamp).toLocaleDateString(),
      'Time': new Date(tip.timestamp).toLocaleTimeString(),
      'Notes': tip.notes
    }));
  };

  const formatAuditData = (auditLogs: any[]) => {
    return auditLogs.map(log => ({
      'Log ID': log.id,
      'Action': log.action,
      'Entity Type': log.entity_type,
      'Entity ID': log.entity_id,
      'User ID': log.user_id,
      'IP Address': log.ip_address,
      'User Agent': log.user_agent,
      'Date': new Date(log.created_at).toLocaleDateString(),
      'Time': new Date(log.created_at).toLocaleTimeString(),
      'Changes': log.new_data ? JSON.stringify(log.new_data) : ''
    }));
  };

  const generateCSV = (data: any[], filename: string) => {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma or quote
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = async (options: ExportOptions) => {
    setLoading(true);
    try {
      const data = await fetchExportData(options);
      const timestamp = new Date().toISOString().slice(0, 10);
      
      if (options.includeEmployees !== false && data.employees.length > 0) {
        const employeeCSV = generateCSV(formatEmployeeData(data.employees), 'employees');
        downloadFile(employeeCSV, `shiftmint-employees-${timestamp}.csv`, 'text/csv');
      }

      if (options.includeShifts !== false && data.shifts.length > 0) {
        const shiftCSV = generateCSV(formatShiftData(data.shifts), 'shifts');
        downloadFile(shiftCSV, `shiftmint-shifts-${timestamp}.csv`, 'text/csv');
      }

      if (options.includeTips !== false && data.tips.length > 0) {
        const tipCSV = generateCSV(formatTipData(data.tips), 'tips');
        downloadFile(tipCSV, `shiftmint-tips-${timestamp}.csv`, 'text/csv');
      }

      if (options.includeAuditLogs !== false && data.auditLogs.length > 0) {
        const auditCSV = generateCSV(formatAuditData(data.auditLogs), 'audit');
        downloadFile(auditCSV, `shiftmint-audit-${timestamp}.csv`, 'text/csv');
      }

      toast({
        title: 'Export Complete',
        description: 'Your data has been successfully exported to CSV files.',
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting your data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async (options: ExportOptions) => {
    setLoading(true);
    try {
      // For Excel export, we'll use the same CSV format but with .xlsx extension
      // In a real implementation, you'd use a library like xlsx
      const data = await fetchExportData(options);
      const timestamp = new Date().toISOString().slice(0, 10);
      
             // Create comprehensive Excel export with all data in one file
       const allData: any[] = [];
       
       if (options.includeEmployees !== false && data.employees.length > 0) {
         allData.push(...formatEmployeeData(data.employees).map(row => ({ ...row, 'Data Type': 'Employee' })));
       }

       if (options.includeShifts !== false && data.shifts.length > 0) {
         allData.push(...formatShiftData(data.shifts).map(row => ({ ...row, 'Data Type': 'Shift' })));
       }

       if (options.includeTips !== false && data.tips.length > 0) {
         allData.push(...formatTipData(data.tips).map(row => ({ ...row, 'Data Type': 'Tip' })));
       }

      if (allData.length > 0) {
        const comprehensiveCSV = generateCSV(allData, 'comprehensive');
        downloadFile(comprehensiveCSV, `shiftmint-comprehensive-${timestamp}.csv`, 'text/csv');
      }

      toast({
        title: 'Export Complete',
        description: 'Your comprehensive data has been exported successfully.',
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting your data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async (options: ExportOptions) => {
    setLoading(true);
    try {
      const data = await fetchExportData(options);
      const timestamp = new Date().toISOString().slice(0, 10);
      
      // Create a simple PDF-like report in text format
      // In a real implementation, you'd use a library like jsPDF
      let pdfContent = `SHIFTMINT BUSINESS REPORT\n`;
      pdfContent += `Generated: ${new Date().toLocaleString()}\n`;
      pdfContent += `Business: ${data.businesses[0]?.name || 'Unknown'}\n\n`;
      
      if (options.includeEmployees !== false && data.employees.length > 0) {
        pdfContent += `EMPLOYEES (${data.employees.length})\n`;
        pdfContent += `${'='.repeat(50)}\n`;
        data.employees.forEach(emp => {
          pdfContent += `${emp.users?.first_name || emp.first_name} ${emp.users?.last_name || emp.last_name} - ${emp.role}\n`;
          pdfContent += `  Employee ID: ${emp.employee_number || emp.id}\n`;
          pdfContent += `  Hourly Rate: $${emp.hourly_wage || 'N/A'}\n`;
          pdfContent += `  Status: ${emp.status}\n\n`;
        });
      }

      if (options.includeShifts !== false && data.shifts.length > 0) {
        pdfContent += `SHIFTS (${data.shifts.length})\n`;
        pdfContent += `${'='.repeat(50)}\n`;
        data.shifts.forEach(shift => {
          pdfContent += `${shift.employees?.first_name || ''} ${shift.employees?.last_name || ''}\n`;
          pdfContent += `  Date: ${new Date(shift.start_time).toLocaleDateString()}\n`;
          pdfContent += `  Duration: ${shift.duration_minutes ? (shift.duration_minutes / 60).toFixed(2) : 'N/A'} hours\n`;
          pdfContent += `  Status: ${shift.status}\n\n`;
        });
      }

      if (options.includeTips !== false && data.tips.length > 0) {
        pdfContent += `TIPS (${data.tips.length})\n`;
        pdfContent += `${'='.repeat(50)}\n`;
        const totalTips = data.tips.reduce((sum, tip) => sum + (tip.amount || 0), 0);
        pdfContent += `Total Tips: $${totalTips.toFixed(2)}\n\n`;
        data.tips.forEach(tip => {
          pdfContent += `${tip.employees?.first_name || ''} ${tip.employees?.last_name || ''}\n`;
          pdfContent += `  Amount: $${tip.amount}\n`;
          pdfContent += `  Type: ${tip.tip_type}\n`;
          pdfContent += `  Date: ${new Date(tip.timestamp).toLocaleDateString()}\n\n`;
        });
      }

      downloadFile(pdfContent, `shiftmint-report-${timestamp}.txt`, 'text/plain');

      toast({
        title: 'Report Generated',
        description: 'Your business report has been generated successfully.',
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: 'There was an error generating your report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (options: ExportOptions) => {
    switch (options.format) {
      case 'csv':
        return exportToCSV(options);
      case 'excel':
        return exportToExcel(options);
      case 'pdf':
        return exportToPDF(options);
      default:
        throw new Error('Unsupported export format');
    }
  };

  return {
    exportData,
    loading,
    fetchExportData,
    formatEmployeeData,
    formatShiftData,
    formatTipData,
    formatAuditData
  };
}; 