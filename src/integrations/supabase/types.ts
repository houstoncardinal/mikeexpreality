export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          author_name: string | null
          category_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          published_at: string | null
          read_time: number | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          category_id?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          read_time?: number | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          category_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          read_time?: number | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          converted_at: string | null
          created_at: string
          email: string
          id: string
          lead_source: string | null
          message: string | null
          name: string
          notes: string | null
          phone: string | null
          property_address: string | null
          property_id: string | null
          status: string | null
        }
        Insert: {
          converted_at?: string | null
          created_at?: string
          email: string
          id?: string
          lead_source?: string | null
          message?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          property_address?: string | null
          property_id?: string | null
          status?: string | null
        }
        Update: {
          converted_at?: string | null
          created_at?: string
          email?: string
          id?: string
          lead_source?: string | null
          message?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          property_address?: string | null
          property_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
      mls_sync_logs: {
        Row: {
          completed_at: string | null
          error_message: string | null
          id: string
          records_added: number | null
          records_failed: number | null
          records_processed: number | null
          records_updated: number | null
          started_at: string
          status: string
          sync_type: string
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          records_added?: number | null
          records_failed?: number | null
          records_processed?: number | null
          records_updated?: number | null
          started_at?: string
          status: string
          sync_type: string
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          records_added?: number | null
          records_failed?: number | null
          records_processed?: number | null
          records_updated?: number | null
          started_at?: string
          status?: string
          sync_type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address_line1: string
          address_line2: string | null
          amenities: string[] | null
          bathrooms: number | null
          bedrooms: number | null
          buyer_agent_id: string | null
          city: string
          co_listing_agent_id: string | null
          country: string | null
          created_at: string
          days_on_market: number | null
          description: string | null
          expiration_date: string | null
          features: string[] | null
          garage_spaces: number | null
          hoa_fee: number | null
          id: string
          images: string[] | null
          inquiries_count: number | null
          latitude: number | null
          listing_agent_id: string | null
          listing_date: string | null
          longitude: number | null
          lot_size: number | null
          metadata: Json | null
          mls_number: string | null
          original_price: number | null
          parking_spaces: number | null
          price: number
          property_type: Database["public"]["Enums"]["property_type"]
          showings_count: number | null
          sold_date: string | null
          sold_price: number | null
          sqft: number | null
          state: string
          status: Database["public"]["Enums"]["property_status"]
          tax_amount: number | null
          tax_year: number | null
          title: string
          updated_at: string
          video_url: string | null
          views_count: number | null
          virtual_tour_url: string | null
          year_built: number | null
          zip_code: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          amenities?: string[] | null
          bathrooms?: number | null
          bedrooms?: number | null
          buyer_agent_id?: string | null
          city: string
          co_listing_agent_id?: string | null
          country?: string | null
          created_at?: string
          days_on_market?: number | null
          description?: string | null
          expiration_date?: string | null
          features?: string[] | null
          garage_spaces?: number | null
          hoa_fee?: number | null
          id?: string
          images?: string[] | null
          inquiries_count?: number | null
          latitude?: number | null
          listing_agent_id?: string | null
          listing_date?: string | null
          longitude?: number | null
          lot_size?: number | null
          metadata?: Json | null
          mls_number?: string | null
          original_price?: number | null
          parking_spaces?: number | null
          price: number
          property_type?: Database["public"]["Enums"]["property_type"]
          showings_count?: number | null
          sold_date?: string | null
          sold_price?: number | null
          sqft?: number | null
          state?: string
          status?: Database["public"]["Enums"]["property_status"]
          tax_amount?: number | null
          tax_year?: number | null
          title: string
          updated_at?: string
          video_url?: string | null
          views_count?: number | null
          virtual_tour_url?: string | null
          year_built?: number | null
          zip_code: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          amenities?: string[] | null
          bathrooms?: number | null
          bedrooms?: number | null
          buyer_agent_id?: string | null
          city?: string
          co_listing_agent_id?: string | null
          country?: string | null
          created_at?: string
          days_on_market?: number | null
          description?: string | null
          expiration_date?: string | null
          features?: string[] | null
          garage_spaces?: number | null
          hoa_fee?: number | null
          id?: string
          images?: string[] | null
          inquiries_count?: number | null
          latitude?: number | null
          listing_agent_id?: string | null
          listing_date?: string | null
          longitude?: number | null
          lot_size?: number | null
          metadata?: Json | null
          mls_number?: string | null
          original_price?: number | null
          parking_spaces?: number | null
          price?: number
          property_type?: Database["public"]["Enums"]["property_type"]
          showings_count?: number | null
          sold_date?: string | null
          sold_price?: number | null
          sqft?: number | null
          state?: string
          status?: Database["public"]["Enums"]["property_status"]
          tax_amount?: number | null
          tax_year?: number | null
          title?: string
          updated_at?: string
          video_url?: string | null
          views_count?: number | null
          virtual_tour_url?: string | null
          year_built?: number | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_buyer_agent_id_fkey"
            columns: ["buyer_agent_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_co_listing_agent_id_fkey"
            columns: ["co_listing_agent_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_listing_agent_id_fkey"
            columns: ["listing_agent_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      showings: {
        Row: {
          agent_id: string | null
          created_at: string
          duration_minutes: number | null
          feedback: string | null
          id: string
          lead_id: string | null
          notes: string | null
          property_id: string
          rating: number | null
          scheduled_at: string
          status: string
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          property_id: string
          rating?: number | null
          scheduled_at: string
          status?: string
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          property_id?: string
          rating?: number | null
          scheduled_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "showings_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "showings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "showings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          avatar_url: string | null
          bio: string | null
          commission_rate: number | null
          created_at: string
          email: string
          first_name: string
          hire_date: string | null
          id: string
          is_active: boolean | null
          languages: string[] | null
          last_name: string
          license_expiry: string | null
          license_number: string | null
          performance_metrics: Json | null
          phone: string | null
          role: Database["public"]["Enums"]["staff_role"]
          social_links: Json | null
          specializations: string[] | null
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          commission_rate?: number | null
          created_at?: string
          email: string
          first_name: string
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          languages?: string[] | null
          last_name: string
          license_expiry?: string | null
          license_number?: string | null
          performance_metrics?: Json | null
          phone?: string | null
          role?: Database["public"]["Enums"]["staff_role"]
          social_links?: Json | null
          specializations?: string[] | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          commission_rate?: number | null
          created_at?: string
          email?: string
          first_name?: string
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          languages?: string[] | null
          last_name?: string
          license_expiry?: string | null
          license_number?: string | null
          performance_metrics?: Json | null
          phone?: string | null
          role?: Database["public"]["Enums"]["staff_role"]
          social_links?: Json | null
          specializations?: string[] | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          lead_id: string | null
          notes: string | null
          priority: string
          property_id: string | null
          status: string
          task_type: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          priority?: string
          property_id?: string | null
          status?: string
          task_type?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          priority?: string
          property_id?: string | null
          status?: string
          task_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          buyer_agent_id: string | null
          closing_date: string | null
          commission_buyer_side: number | null
          commission_listing_side: number | null
          commission_total: number | null
          contract_date: string | null
          created_at: string
          documents: Json | null
          escrow_company: string | null
          id: string
          lead_id: string | null
          lender: string | null
          list_price: number | null
          listing_agent_id: string | null
          milestones: Json | null
          notes: string | null
          property_id: string | null
          sale_price: number | null
          status: string
          title_company: string | null
          transaction_type: string
          updated_at: string
        }
        Insert: {
          buyer_agent_id?: string | null
          closing_date?: string | null
          commission_buyer_side?: number | null
          commission_listing_side?: number | null
          commission_total?: number | null
          contract_date?: string | null
          created_at?: string
          documents?: Json | null
          escrow_company?: string | null
          id?: string
          lead_id?: string | null
          lender?: string | null
          list_price?: number | null
          listing_agent_id?: string | null
          milestones?: Json | null
          notes?: string | null
          property_id?: string | null
          sale_price?: number | null
          status?: string
          title_company?: string | null
          transaction_type?: string
          updated_at?: string
        }
        Update: {
          buyer_agent_id?: string | null
          closing_date?: string | null
          commission_buyer_side?: number | null
          commission_listing_side?: number | null
          commission_total?: number | null
          contract_date?: string | null
          created_at?: string
          documents?: Json | null
          escrow_company?: string | null
          id?: string
          lead_id?: string | null
          lender?: string | null
          list_price?: number | null
          listing_agent_id?: string | null
          milestones?: Json | null
          notes?: string | null
          property_id?: string | null
          sale_price?: number | null
          status?: string
          title_company?: string | null
          transaction_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_buyer_agent_id_fkey"
            columns: ["buyer_agent_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_listing_agent_id_fkey"
            columns: ["listing_agent_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      property_status:
        | "active"
        | "pending"
        | "sold"
        | "off_market"
        | "coming_soon"
      property_type:
        | "single_family"
        | "condo"
        | "townhouse"
        | "multi_family"
        | "land"
        | "commercial"
      staff_role: "realtor" | "admin" | "manager" | "assistant" | "marketing"
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
    Enums: {
      app_role: ["admin", "user"],
      property_status: [
        "active",
        "pending",
        "sold",
        "off_market",
        "coming_soon",
      ],
      property_type: [
        "single_family",
        "condo",
        "townhouse",
        "multi_family",
        "land",
        "commercial",
      ],
      staff_role: ["realtor", "admin", "manager", "assistant", "marketing"],
    },
  },
} as const
