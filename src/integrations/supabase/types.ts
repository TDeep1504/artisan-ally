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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      business_buyer_profiles: {
        Row: {
          business_name: string
          business_type: string | null
          created_at: string
          gst_number: string | null
          id: string
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          business_name: string
          business_type?: string | null
          created_at?: string
          gst_number?: string | null
          id?: string
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          business_name?: string
          business_type?: string | null
          created_at?: string
          gst_number?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      enquiries: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          message: string
          product_id: string | null
          quantity: number | null
          quoted_price: number | null
          seller_id: string
          seller_response: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          message: string
          product_id?: string | null
          quantity?: number | null
          quoted_price?: number | null
          seller_id: string
          seller_response?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          message?: string
          product_id?: string | null
          quantity?: number | null
          quoted_price?: number | null
          seller_id?: string
          seller_response?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          platform_fee: number | null
          seller_id: string
          seller_payout: number | null
          shipping_address: Json | null
          status: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          platform_fee?: number | null
          seller_id: string
          seller_payout?: number | null
          shipping_address?: Json | null
          status?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          platform_fee?: number | null
          seller_id?: string
          seller_payout?: number | null
          shipping_address?: Json | null
          status?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean | null
          product_id: string
          sort_order: number | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          product_id: string
          sort_order?: number | null
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          product_id?: string
          sort_order?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          ai_generated: boolean | null
          b2b_price: number | null
          b2c_price: number | null
          bulk_order_suitable: boolean | null
          care_instructions: string | null
          category_id: string | null
          created_at: string
          description: string | null
          enquiries: number | null
          export_suitable: boolean | null
          id: string
          is_eco_friendly: boolean | null
          is_handmade: boolean | null
          materials: string | null
          min_bulk_quantity: number | null
          sales: number | null
          seller_id: string
          short_summary: string | null
          status: string | null
          stock: number | null
          tags: string[] | null
          title: string
          updated_at: string
          views: number | null
        }
        Insert: {
          ai_generated?: boolean | null
          b2b_price?: number | null
          b2c_price?: number | null
          bulk_order_suitable?: boolean | null
          care_instructions?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          enquiries?: number | null
          export_suitable?: boolean | null
          id?: string
          is_eco_friendly?: boolean | null
          is_handmade?: boolean | null
          materials?: string | null
          min_bulk_quantity?: number | null
          sales?: number | null
          seller_id: string
          short_summary?: string | null
          status?: string | null
          stock?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          ai_generated?: boolean | null
          b2b_price?: number | null
          b2c_price?: number | null
          bulk_order_suitable?: boolean | null
          care_instructions?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          enquiries?: number | null
          export_suitable?: boolean | null
          id?: string
          is_eco_friendly?: boolean | null
          is_handmade?: boolean | null
          materials?: string | null
          min_bulk_quantity?: number | null
          sales?: number | null
          seller_id?: string
          short_summary?: string | null
          status?: string | null
          stock?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string
          district: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          state: string | null
          updated_at: string
          user_id: string
          village: string | null
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          district?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
          village?: string | null
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          district?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
          village?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          buyer_id: string
          comment: string | null
          created_at: string
          id: string
          product_id: string
          rating: number | null
        }
        Insert: {
          buyer_id: string
          comment?: string | null
          created_at?: string
          id?: string
          product_id: string
          rating?: number | null
        }
        Update: {
          buyer_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          product_id?: string
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_profiles: {
        Row: {
          artisan_story: string | null
          bank_account: string | null
          bank_ifsc: string | null
          bank_name: string | null
          categories: string[] | null
          created_at: string
          id: string
          is_verified: boolean | null
          is_women_led: boolean | null
          profile_completion: number | null
          seller_type: string | null
          store_bio: string | null
          store_name: string
          updated_at: string
          upi_id: string | null
          user_id: string
          verification_status: string | null
        }
        Insert: {
          artisan_story?: string | null
          bank_account?: string | null
          bank_ifsc?: string | null
          bank_name?: string | null
          categories?: string[] | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          is_women_led?: boolean | null
          profile_completion?: number | null
          seller_type?: string | null
          store_bio?: string | null
          store_name: string
          updated_at?: string
          upi_id?: string | null
          user_id: string
          verification_status?: string | null
        }
        Update: {
          artisan_story?: string | null
          bank_account?: string | null
          bank_ifsc?: string | null
          bank_name?: string | null
          categories?: string[] | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          is_women_led?: boolean | null
          profile_completion?: number | null
          seller_type?: string | null
          store_bio?: string | null
          store_name?: string
          updated_at?: string
          upi_id?: string | null
          user_id?: string
          verification_status?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      app_role: "buyer" | "business_buyer" | "seller" | "admin"
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
      app_role: ["buyer", "business_buyer", "seller", "admin"],
    },
  },
} as const
