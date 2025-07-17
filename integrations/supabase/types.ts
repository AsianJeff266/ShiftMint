export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      business_configurations: {
        Row: {
          address: Json | null
          business_id: string
          business_name: string
          created_at: string
          id: string
          payroll_settings: Json | null
          pos_integration: Json | null
          tax_settings: Json | null
          tip_pooling_rules: Json | null
          updated_at: string
        }
        Insert: {
          address?: Json | null
          business_id: string
          business_name: string
          created_at?: string
          id?: string
          payroll_settings?: Json | null
          pos_integration?: Json | null
          tax_settings?: Json | null
          tip_pooling_rules?: Json | null
          updated_at?: string
        }
        Update: {
          address?: Json | null
          business_id?: string
          business_name?: string
          created_at?: string
          id?: string
          payroll_settings?: Json | null
          pos_integration?: Json | null
          tax_settings?: Json | null
          tip_pooling_rules?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      calculation_events: {
        Row: {
          calculation_data: Json
          created_at: string
          entity_id: string
          entity_type: string
          event_type: string
          id: string
          result_data: Json | null
          triggered_by: string | null
        }
        Insert: {
          calculation_data: Json
          created_at?: string
          entity_id: string
          entity_type: string
          event_type: string
          id?: string
          result_data?: Json | null
          triggered_by?: string | null
        }
        Update: {
          calculation_data?: Json
          created_at?: string
          entity_id?: string
          entity_type?: string
          event_type?: string
          id?: string
          result_data?: Json | null
          triggered_by?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          bank_account_number: string | null
          business_id: string
          created_at: string
          email: string
          employee_number: string
          first_name: string
          hire_date: string
          hourly_wage: number
          id: string
          last_name: string
          overtime_rate: number | null
          pay_frequency: string | null
          phone: string | null
          routing_number: string | null
          status: string
          tax_exemptions: number | null
          tax_filing_status: string | null
          termination_date: string | null
          updated_at: string
        }
        Insert: {
          bank_account_number?: string | null
          business_id: string
          created_at?: string
          email: string
          employee_number: string
          first_name: string
          hire_date?: string
          hourly_wage?: number
          id?: string
          last_name: string
          overtime_rate?: number | null
          pay_frequency?: string | null
          phone?: string | null
          routing_number?: string | null
          status?: string
          tax_exemptions?: number | null
          tax_filing_status?: string | null
          termination_date?: string | null
          updated_at?: string
        }
        Update: {
          bank_account_number?: string | null
          business_id?: string
          created_at?: string
          email?: string
          employee_number?: string
          first_name?: string
          hire_date?: string
          hourly_wage?: number
          id?: string
          last_name?: string
          overtime_rate?: number | null
          pay_frequency?: string | null
          phone?: string | null
          routing_number?: string | null
          status?: string
          tax_exemptions?: number | null
          tax_filing_status?: string | null
          termination_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      flag_events: {
        Row: {
          created_ts: string | null
          description: string | null
          id: string
          resolution_note: string | null
          resolved_ts: string | null
          resolver_id: string | null
          rule_id: string | null
          severity: string | null
          shift_id: string | null
        }
        Insert: {
          created_ts?: string | null
          description?: string | null
          id?: string
          resolution_note?: string | null
          resolved_ts?: string | null
          resolver_id?: string | null
          rule_id?: string | null
          severity?: string | null
          shift_id?: string | null
        }
        Update: {
          created_ts?: string | null
          description?: string | null
          id?: string
          resolution_note?: string | null
          resolved_ts?: string | null
          resolver_id?: string | null
          rule_id?: string | null
          severity?: string | null
          shift_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flag_events_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_entries: {
        Row: {
          created_at: string
          employee_id: string
          federal_tax: number | null
          fica_tax: number | null
          gross_pay: number | null
          id: string
          net_pay: number | null
          overtime_hours: number | null
          overtime_pay: number | null
          payroll_period_id: string
          regular_hours: number | null
          regular_pay: number | null
          state_tax: number | null
          total_deductions: number | null
          total_tips: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          federal_tax?: number | null
          fica_tax?: number | null
          gross_pay?: number | null
          id?: string
          net_pay?: number | null
          overtime_hours?: number | null
          overtime_pay?: number | null
          payroll_period_id: string
          regular_hours?: number | null
          regular_pay?: number | null
          state_tax?: number | null
          total_deductions?: number | null
          total_tips?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          federal_tax?: number | null
          fica_tax?: number | null
          gross_pay?: number | null
          id?: string
          net_pay?: number | null
          overtime_hours?: number | null
          overtime_pay?: number | null
          payroll_period_id?: string
          regular_hours?: number | null
          regular_pay?: number | null
          state_tax?: number | null
          total_deductions?: number | null
          total_tips?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_entries_payroll_period_id_fkey"
            columns: ["payroll_period_id"]
            isOneToOne: false
            referencedRelation: "payroll_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_periods: {
        Row: {
          business_id: string
          created_at: string
          id: string
          period_end: string
          period_start: string
          status: string
          total_gross_pay: number | null
          total_net_pay: number | null
          total_taxes: number | null
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          period_end: string
          period_start: string
          status?: string
          total_gross_pay?: number | null
          total_net_pay?: number | null
          total_taxes?: number | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          period_end?: string
          period_start?: string
          status?: string
          total_gross_pay?: number | null
          total_net_pay?: number | null
          total_taxes?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      punch_events: {
        Row: {
          employee_id: string
          id: string
          inserted_at: string | null
          job_code: string
          location_id: string
          punch_type: string | null
          raw_payload: Json
          source: string | null
          ts_utc: string
        }
        Insert: {
          employee_id: string
          id?: string
          inserted_at?: string | null
          job_code: string
          location_id: string
          punch_type?: string | null
          raw_payload: Json
          source?: string | null
          ts_utc: string
        }
        Update: {
          employee_id?: string
          id?: string
          inserted_at?: string | null
          job_code?: string
          location_id?: string
          punch_type?: string | null
          raw_payload?: Json
          source?: string | null
          ts_utc?: string
        }
        Relationships: []
      }
      rule_learning: {
        Row: {
          created_at: string | null
          employee_id: string | null
          id: string
          last_adjustment: string | null
          location_id: string | null
          resolution_count: number | null
          rule_id: string
          threshold_adjustments: Json | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          last_adjustment?: string | null
          location_id?: string | null
          resolution_count?: number | null
          rule_id: string
          threshold_adjustments?: Json | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          last_adjustment?: string | null
          location_id?: string | null
          resolution_count?: number | null
          rule_id?: string
          threshold_adjustments?: Json | null
        }
        Relationships: []
      }
      shift_overrides: {
        Row: {
          after_state: Json | null
          before_state: Json | null
          created_ts: string | null
          id: string
          reason: string | null
          resolver_id: string | null
          shift_id: string | null
        }
        Insert: {
          after_state?: Json | null
          before_state?: Json | null
          created_ts?: string | null
          id?: string
          reason?: string | null
          resolver_id?: string | null
          shift_id?: string | null
        }
        Update: {
          after_state?: Json | null
          before_state?: Json | null
          created_ts?: string | null
          id?: string
          reason?: string | null
          resolver_id?: string | null
          shift_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shift_overrides_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      shifts: {
        Row: {
          duration_min: number | null
          employee_id: string
          end_ts: string | null
          id: string
          inserted_at: string | null
          job_code: string
          location_id: string
          start_ts: string
          status: string | null
        }
        Insert: {
          duration_min?: number | null
          employee_id: string
          end_ts?: string | null
          id?: string
          inserted_at?: string | null
          job_code: string
          location_id: string
          start_ts: string
          status?: string | null
        }
        Update: {
          duration_min?: number | null
          employee_id?: string
          end_ts?: string | null
          id?: string
          inserted_at?: string | null
          job_code?: string
          location_id?: string
          start_ts?: string
          status?: string | null
        }
        Relationships: []
      }
      tip_entries: {
        Row: {
          amount: number
          created_at: string
          employee_id: string
          id: string
          processed: boolean | null
          processed_at: string | null
          shift_id: string | null
          source: string
          table_number: string | null
          timestamp: string
          tip_type: string
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          employee_id: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          shift_id?: string | null
          source: string
          table_number?: string | null
          timestamp?: string
          tip_type: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          employee_id?: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          shift_id?: string | null
          source?: string
          table_number?: string | null
          timestamp?: string
          tip_type?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tip_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tip_entries_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_rules: {
        Row: {
          created_ts: string | null
          id: number
          location_id: string | null
          rule_id: string | null
          threshold: Json | null
        }
        Insert: {
          created_ts?: string | null
          id?: number
          location_id?: string | null
          rule_id?: string | null
          threshold?: Json | null
        }
        Update: {
          created_ts?: string | null
          id?: number
          location_id?: string | null
          rule_id?: string | null
          threshold?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
