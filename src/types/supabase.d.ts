export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      cache: {
        Row: {
          key: string
          data: Json
          timestamp: string
          expires_in: number | null
          size: number
          created_at: string
        }
        Insert: {
          key: string
          data: Json
          timestamp?: string
          expires_in?: number | null
          size: number
          created_at?: string
        }
        Update: {
          key?: string
          data?: Json
          timestamp?: string
          expires_in?: number | null
          size?: number
          created_at?: string
        }
      }
    }
  }
} 