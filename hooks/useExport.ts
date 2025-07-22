import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  const generateCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      return `${filename.toUpperCase()}\nNo data available for export\n`;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // Escape quotes and wrap in quotes if contains comma or quote
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
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

  const fetchExportData = async (options: ExportOptions, businessId?: string): Promise<ExportData> => {
    const data: ExportData = {
      employees: [],
      shifts: [],
      tips: [],
      payroll: [],
      businesses: [],
      auditLogs: []
    };

    if (!businessId) {
      console.warn('No business ID provided for export');
      return data;
    }

    try {
      // Fetch employees data
      if (options.includeEmployees !== false) {
        const { data: employeeData, error: employeeError } = await supabase
          .from('employees')
          .select('*')
          .eq('business_id', businessId)
          .limit(100);

        if (employeeError) {
          console.error('Error fetching employees:', employeeError);
        } else {
          data.employees = employeeData || [];
        }
      }

      // Fetch shifts data
      if (options.includeShifts !== false) {
        const { data: shiftData, error: shiftError } = await supabase
          .from('shifts')
          .select('*')
          .eq('business_id', businessId)
          .limit(100);

        if (shiftError) {
          console.error('Error fetching shifts:', shiftError);
        } else {
          data.shifts = shiftData || [];
        }
      }

      // Fetch tips data
      if (options.includeTips !== false) {
        const { data: tipData, error: tipError } = await supabase
          .from('tip_entries')
          .select('*')
          .eq('business_id', businessId)
          .limit(100);

        if (tipError) {
          console.error('Error fetching tips:', tipError);
        } else {
          data.tips = tipData || [];
        }
      }

      return data;
    } catch (error) {
      console.error('Error fetching export data:', error);
      return data;
    }
  };

  const exportData = async (options: ExportOptions, businessId?: string) => {
    setLoading(true);
    try {
      const data = await fetchExportData(options, businessId);
      const timestamp = new Date().toISOString().slice(0, 10);
      
      let hasData = false;
      let csvContent = '';

      if (options.includeEmployees !== false) {
        const employeeCSV = generateCSV(data.employees, 'employees');
        csvContent += employeeCSV + '\n\n';
        hasData = hasData || data.employees.length > 0;
      }

      if (options.includeShifts !== false) {
        const shiftCSV = generateCSV(data.shifts, 'shifts');
        csvContent += shiftCSV + '\n\n';
        hasData = hasData || data.shifts.length > 0;
      }

      if (options.includeTips !== false) {
        const tipCSV = generateCSV(data.tips, 'tips');
        csvContent += tipCSV + '\n\n';
        hasData = hasData || data.tips.length > 0;
      }

      if (!hasData) {
        csvContent = `SHIFTMINT DATA EXPORT\nGenerated: ${new Date().toLocaleString()}\n\nNo data available for export.\nPlease add employees, shifts, or tips to export data.`;
      }

      const filename = `shiftmint-export-${timestamp}.csv`;
      downloadFile(csvContent, filename, 'text/csv');

      toast({
        title: 'Export Complete',
        description: `Data exported successfully as ${filename}`,
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

  return {
    exportData,
    loading,
    fetchExportData,
  };
}; 