export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          child_id: string | null
          created_at: string | null
          hospital_id: string | null
          id: string
          immunization_id: string | null
          scheduled_date: string
        }
        Insert: {
          child_id?: string | null
          created_at?: string | null
          hospital_id?: string | null
          id?: string
          immunization_id?: string | null
          scheduled_date: string
        }
        Update: {
          child_id?: string | null
          created_at?: string | null
          hospital_id?: string | null
          id?: string
          immunization_id?: string | null
          scheduled_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_immunization_id_fkey"
            columns: ["immunization_id"]
            isOneToOne: false
            referencedRelation: "immunizations"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          created_at: string | null
          date_of_birth: string
          gender: string | null
          hospital_id: string | null
          id: string
          name: string
          parent_id: string
          photo_url: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_birth: string
          gender?: string | null
          hospital_id?: string | null
          id?: string
          name: string
          parent_id: string
          photo_url?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_birth?: string
          gender?: string | null
          hospital_id?: string | null
          id?: string
          name?: string
          parent_id?: string
          photo_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "children_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "children_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      immunizations: {
        Row: {
          child_id: string | null
          created_at: string | null
          date_given: string | null
          due_date: string
          id: string
          scheduled_date: string | null
          status: Database["public"]["Enums"]["vaccine_status"]
          vaccine_id: string | null
        }
        Insert: {
          child_id?: string | null
          created_at?: string | null
          date_given?: string | null
          due_date: string
          id?: string
          scheduled_date?: string | null
          status: Database["public"]["Enums"]["vaccine_status"]
          vaccine_id?: string | null
        }
        Update: {
          child_id?: string | null
          created_at?: string | null
          date_given?: string | null
          due_date?: string
          id?: string
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["vaccine_status"]
          vaccine_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "immunization_records_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "immunization_records_vaccine_id_fkey"
            columns: ["vaccine_id"]
            isOneToOne: false
            referencedRelation: "vaccines"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_profile_complete: boolean | null
          location: unknown | null
          name: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_profile_complete?: boolean | null
          location?: unknown | null
          name?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_profile_complete?: boolean | null
          location?: unknown | null
          name?: string | null
          role?: string | null
        }
        Relationships: []
      }
      vaccines: {
        Row: {
          administration_age: string | null
          administration_time_date: number | null
          id: string
          img_url: string
          importance: string | null
          name: string
          protects_against: string | null
          side_effects: string | null
        }
        Insert: {
          administration_age?: string | null
          administration_time_date?: number | null
          id?: string
          img_url: string
          importance?: string | null
          name: string
          protects_against?: string | null
          side_effects?: string | null
        }
        Update: {
          administration_age?: string | null
          administration_time_date?: number | null
          id?: string
          img_url?: string
          importance?: string | null
          name?: string
          protects_against?: string | null
          side_effects?: string | null
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
      vaccine_status: "upcoming" | "scheduled" | "completed" | "overdue"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
