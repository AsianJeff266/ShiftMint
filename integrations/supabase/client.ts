import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for better TypeScript support
export type Database = {
  public: {
    Tables: {
      employees: {
        Row: {
          id: string
          business_id: string
          employee_number: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          hire_date: string
          termination_date: string | null
          status: 'active' | 'inactive' | 'terminated'
          hourly_wage: number
          overtime_rate: number | null
          tax_exemptions: number
          tax_filing_status: 'single' | 'married' | 'head_of_household'
          pay_frequency: 'weekly' | 'biweekly' | 'monthly'
          bank_account_number: string | null
          routing_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          employee_number: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          hire_date?: string
          termination_date?: string | null
          status?: 'active' | 'inactive' | 'terminated'
          hourly_wage?: number
          overtime_rate?: number | null
          tax_exemptions?: number
          tax_filing_status?: 'single' | 'married' | 'head_of_household'
          pay_frequency?: 'weekly' | 'biweekly' | 'monthly'
          bank_account_number?: string | null
          routing_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          employee_number?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          hire_date?: string
          termination_date?: string | null
          status?: 'active' | 'inactive' | 'terminated'
          hourly_wage?: number
          overtime_rate?: number | null
          tax_exemptions?: number
          tax_filing_status?: 'single' | 'married' | 'head_of_household'
          pay_frequency?: 'weekly' | 'biweekly' | 'monthly'
          bank_account_number?: string | null
          routing_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      business_configurations: {
        Row: {
          id: string
          business_id: string
          business_name: string
          address: any | null
          tax_settings: any | null
          tip_pooling_rules: any | null
          payroll_settings: any | null
          pos_integration: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          business_name: string
          address?: any | null
          tax_settings?: any | null
          tip_pooling_rules?: any | null
          payroll_settings?: any | null
          pos_integration?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          business_name?: string
          address?: any | null
          tax_settings?: any | null
          tip_pooling_rules?: any | null
          payroll_settings?: any | null
          pos_integration?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      tip_entries: {
        Row: {
          id: string
          employee_id: string
          business_id: string
          shift_id: string | null
          amount: number
          tip_type: 'cash' | 'credit' | 'pos_import'
          source: 'manual' | 'pos' | 'hourly_rate' | 'table'
          table_number: string | null
          notes: string | null
          timestamp: string
          confirmed_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          business_id: string
          shift_id?: string | null
          amount: number
          tip_type: 'cash' | 'credit' | 'pos_import'
          source: 'manual' | 'pos' | 'hourly_rate' | 'table'
          table_number?: string | null
          notes?: string | null
          timestamp?: string
          confirmed_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          business_id?: string
          shift_id?: string | null
          amount?: number
          tip_type?: 'cash' | 'credit' | 'pos_import'
          source?: 'manual' | 'pos' | 'hourly_rate' | 'table'
          table_number?: string | null
          notes?: string | null
          timestamp?: string
          confirmed_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Export typed client
export type SupabaseClient = ReturnType<typeof createClient<Database>>
