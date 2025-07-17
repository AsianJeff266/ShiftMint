import { createClient } from '@supabase/supabase-js';

// Supabase configuration with real credentials
const supabaseUrl = 'https://dbvczxckpwlzprtnvosn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRidmN6eGNrcHdsenBydG52b3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDYwMzYsImV4cCI6MjA2NTIyMjAzNn0.VpFFLE-7o3PzAJlBXs4r4vIf9MprCD6AHZDlstnVo-0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database type definitions
export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string;
          name: string;
          type: string;
          address: any;
          phone: string;
          website: string;
          ein: string;
          state_of_incorporation: string;
          primary_pos_system: string;
          tip_handling_method: string;
          pay_schedule_frequency: string;
          credit_card_tip_tracking: boolean;
          employee_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          address?: any;
          phone?: string;
          website?: string;
          ein?: string;
          state_of_incorporation?: string;
          primary_pos_system?: string;
          tip_handling_method?: string;
          pay_schedule_frequency?: string;
          credit_card_tip_tracking?: boolean;
          employee_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          address?: any;
          phone?: string;
          website?: string;
          ein?: string;
          state_of_incorporation?: string;
          primary_pos_system?: string;
          tip_handling_method?: string;
          pay_schedule_frequency?: string;
          credit_card_tip_tracking?: boolean;
          employee_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          auth_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          role: string;
          is_business_owner: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string;
          role?: string;
          is_business_owner?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          role?: string;
          is_business_owner?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      employees: {
        Row: {
          id: string;
          business_id: string;
          employee_number: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          role: string;
          hire_date: string;
          termination_date: string;
          status: string;
          hourly_wage: number;
          overtime_rate: number;
          tip_eligible: boolean;
          tax_exemptions: number;
          tax_filing_status: string;
          pay_frequency: string;
          bank_account_number: string;
          routing_number: string;
          invite_sent_at: string;
          invite_accepted_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          employee_number: string;
          first_name: string;
          last_name: string;
          email?: string;
          phone?: string;
          role: string;
          hire_date: string;
          termination_date?: string;
          status?: string;
          hourly_wage?: number;
          overtime_rate?: number;
          tip_eligible?: boolean;
          tax_exemptions?: number;
          tax_filing_status?: string;
          pay_frequency?: string;
          bank_account_number?: string;
          routing_number?: string;
          invite_sent_at?: string;
          invite_accepted_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          employee_number?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          role?: string;
          hire_date?: string;
          termination_date?: string;
          status?: string;
          hourly_wage?: number;
          overtime_rate?: number;
          tip_eligible?: boolean;
          tax_exemptions?: number;
          tax_filing_status?: string;
          pay_frequency?: string;
          bank_account_number?: string;
          routing_number?: string;
          invite_sent_at?: string;
          invite_accepted_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      shifts: {
        Row: {
          id: string;
          employee_id: string;
          business_id: string;
          start_time: string;
          end_time: string;
          duration_minutes: number;
          job_code: string;
          location_id: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          business_id: string;
          start_time: string;
          end_time?: string;
          duration_minutes?: number;
          job_code?: string;
          location_id?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          business_id?: string;
          start_time?: string;
          end_time?: string;
          duration_minutes?: number;
          job_code?: string;
          location_id?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      tip_entries: {
        Row: {
          id: string;
          employee_id: string;
          business_id: string;
          amount: number;
          tip_type: string;
          source: string;
          table_number: string;
          timestamp: string;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          business_id: string;
          amount: number;
          tip_type?: string;
          source?: string;
          table_number?: string;
          timestamp: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          business_id?: string;
          amount?: number;
          tip_type?: string;
          source?: string;
          table_number?: string;
          timestamp?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      payroll_periods: {
        Row: {
          id: string;
          business_id: string;
          period_name: string;
          start_date: string;
          end_date: string;
          pay_date: string;
          status: string;
          total_hours: number;
          total_gross_pay: number;
          total_net_pay: number;
          total_tips: number;
          total_deductions: number;
          created_at: string;
          submitted_at: string;
          submitted_by: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          period_name: string;
          start_date: string;
          end_date: string;
          pay_date: string;
          status?: string;
          total_hours?: number;
          total_gross_pay?: number;
          total_net_pay?: number;
          total_tips?: number;
          total_deductions?: number;
          created_at?: string;
          submitted_at?: string;
          submitted_by?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          period_name?: string;
          start_date?: string;
          end_date?: string;
          pay_date?: string;
          status?: string;
          total_hours?: number;
          total_gross_pay?: number;
          total_net_pay?: number;
          total_tips?: number;
          total_deductions?: number;
          created_at?: string;
          submitted_at?: string;
          submitted_by?: string;
        };
      };
      payroll_entries: {
        Row: {
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
          status: string;
          manual_adjustments: number;
          anomaly_flags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
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
          status?: string;
          manual_adjustments?: number;
          anomaly_flags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          payroll_period_id?: string;
          employee_id?: string;
          regular_hours?: number;
          overtime_hours?: number;
          regular_pay?: number;
          overtime_pay?: number;
          total_tips?: number;
          gross_pay?: number;
          deductions?: number;
          net_pay?: number;
          status?: string;
          manual_adjustments?: number;
          anomaly_flags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          business_id: string;
          user_id: string;
          action: string;
          entity_type: string;
          entity_id: string;
          old_data: any;
          new_data: any;
          ip_address: string;
          user_agent: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          user_id: string;
          action: string;
          entity_type: string;
          entity_id: string;
          old_data?: any;
          new_data?: any;
          ip_address?: string;
          user_agent?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          user_id?: string;
          action?: string;
          entity_type?: string;
          entity_id?: string;
          old_data?: any;
          new_data?: any;
          ip_address?: string;
          user_agent?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
} 