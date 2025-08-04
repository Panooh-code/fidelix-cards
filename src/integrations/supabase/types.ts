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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      card_participations: {
        Row: {
          agreed_to_terms: boolean | null
          customer_id: string | null
          id: string
          loyalty_card_id: string | null
          participated_at: string | null
        }
        Insert: {
          agreed_to_terms?: boolean | null
          customer_id?: string | null
          id?: string
          loyalty_card_id?: string | null
          participated_at?: string | null
        }
        Update: {
          agreed_to_terms?: boolean | null
          customer_id?: string | null
          id?: string
          loyalty_card_id?: string | null
          participated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_participations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "card_participations_loyalty_card_id_fkey"
            columns: ["loyalty_card_id"]
            isOneToOne: false
            referencedRelation: "loyalty_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_cards: {
        Row: {
          card_code: string | null
          created_at: string | null
          current_seals: number | null
          customer_id: string | null
          id: string
          is_active: boolean | null
          loyalty_card_id: string | null
          qr_code_url: string | null
          total_rewards_earned: number | null
          updated_at: string | null
        }
        Insert: {
          card_code?: string | null
          created_at?: string | null
          current_seals?: number | null
          customer_id?: string | null
          id?: string
          is_active?: boolean | null
          loyalty_card_id?: string | null
          qr_code_url?: string | null
          total_rewards_earned?: number | null
          updated_at?: string | null
        }
        Update: {
          card_code?: string | null
          created_at?: string | null
          current_seals?: number | null
          customer_id?: string | null
          id?: string
          is_active?: boolean | null
          loyalty_card_id?: string | null
          qr_code_url?: string | null
          total_rewards_earned?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_cards_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customer_cards_loyalty_card_id_fkey"
            columns: ["loyalty_card_id"]
            isOneToOne: false
            referencedRelation: "loyalty_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_cards: {
        Row: {
          background_color: string
          background_pattern: string
          business_address: string | null
          business_country: string
          business_email: string
          business_name: string
          business_phone: string
          business_segment: string
          client_code: string
          created_at: string
          expiration_date: string | null
          id: string
          instructions: string
          is_active: boolean
          is_published: boolean
          is_whatsapp: boolean
          logo_url: string
          max_cards: number | null
          primary_color: string
          public_code: string | null
          public_url: string | null
          qr_code_url: string | null
          reward_description: string
          seal_count: number
          seal_shape: string
          social_network: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          background_color?: string
          background_pattern?: string
          business_address?: string | null
          business_country?: string
          business_email: string
          business_name: string
          business_phone: string
          business_segment: string
          client_code: string
          created_at?: string
          expiration_date?: string | null
          id?: string
          instructions: string
          is_active?: boolean
          is_published?: boolean
          is_whatsapp?: boolean
          logo_url: string
          max_cards?: number | null
          primary_color?: string
          public_code?: string | null
          public_url?: string | null
          qr_code_url?: string | null
          reward_description: string
          seal_count?: number
          seal_shape?: string
          social_network?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          background_color?: string
          background_pattern?: string
          business_address?: string | null
          business_country?: string
          business_email?: string
          business_name?: string
          business_phone?: string
          business_segment?: string
          client_code?: string
          created_at?: string
          expiration_date?: string | null
          id?: string
          instructions?: string
          is_active?: boolean
          is_published?: boolean
          is_whatsapp?: boolean
          logo_url?: string
          max_cards?: number | null
          primary_color?: string
          public_code?: string | null
          public_url?: string | null
          qr_code_url?: string | null
          reward_description?: string
          seal_count?: number
          seal_shape?: string
          social_network?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone_number: string | null
          roles: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone_number?: string | null
          roles?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone_number?: string | null
          roles?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      seal_transactions: {
        Row: {
          business_owner_id: string | null
          customer_card_id: string | null
          id: string
          notes: string | null
          seals_given: number
          transaction_date: string | null
        }
        Insert: {
          business_owner_id?: string | null
          customer_card_id?: string | null
          id?: string
          notes?: string | null
          seals_given: number
          transaction_date?: string | null
        }
        Update: {
          business_owner_id?: string | null
          customer_card_id?: string | null
          id?: string
          notes?: string | null
          seals_given?: number
          transaction_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seal_transactions_business_owner_id_fkey"
            columns: ["business_owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "seal_transactions_customer_card_id_fkey"
            columns: ["customer_card_id"]
            isOneToOne: false
            referencedRelation: "customer_cards"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_role: {
        Args: { user_id_param: string; role_param: string }
        Returns: undefined
      }
      has_user_role: {
        Args: { user_id_param: string; role_param: string }
        Returns: boolean
      }
      remove_user_role: {
        Args: { user_id_param: string; role_param: string }
        Returns: undefined
      }
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
