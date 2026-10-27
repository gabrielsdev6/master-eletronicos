
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "acessos": {
                  Row: {
                    "ativo": boolean,"criado_em": string,"email": string,"nome": string,"papel": Database["public"]['Enums']["papel_acesso"],"usuario_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "ativo"?: boolean,"criado_em"?: string,"email": string,"nome": string,"papel"?: Database["public"]['Enums']["papel_acesso"],"usuario_id": string
                  }
                  Update: {
                    "ativo"?: boolean,"criado_em"?: string,"email"?: string,"nome"?: string,"papel"?: Database["public"]['Enums']["papel_acesso"],"usuario_id"?: string
                  }
                  Relationships: [
                    
                  ]
                },"aparelhos": {
                  Row: {
                    "armazenamento": number,"ativo": boolean,"atualizado_em": string,"bateria": number | null,"cor": string,"cor_hex": string,"criado_em": string,"custo": number | null,"destaque": boolean,"estado": Database["public"]['Enums']["estado_aparelho"],"id": string,"modelo": string,"observacao": string | null,"preco": number,"quantidade": number,"slug": string
                  }
                  ComputedFields: never
                  Insert: {
                    "armazenamento": number,"ativo"?: boolean,"atualizado_em"?: string,"bateria"?: number | null,"cor": string,"cor_hex"?: string,"criado_em"?: string,"custo"?: number | null,"destaque"?: boolean,"estado": Database["public"]['Enums']["estado_aparelho"],"id"?: string,"modelo": string,"observacao"?: string | null,"preco": number,"quantidade"?: number,"slug": string
                  }
                  Update: {
                    "armazenamento"?: number,"ativo"?: boolean,"atualizado_em"?: string,"bateria"?: number | null,"cor"?: string,"cor_hex"?: string,"criado_em"?: string,"custo"?: number | null,"destaque"?: boolean,"estado"?: Database["public"]['Enums']["estado_aparelho"],"id"?: string,"modelo"?: string,"observacao"?: string | null,"preco"?: number,"quantidade"?: number,"slug"?: string
                  }
                  Relationships: [
                    
                  ]
                },"fotos": {
                  Row: {
                    "aparelho_id": string,"caminho": string,"criado_em": string,"id": string,"ordem": number
                  }
                  ComputedFields: never
                  Insert: {
                    "aparelho_id": string,"caminho": string,"criado_em"?: string,"id"?: string,"ordem"?: number
                  }
                  Update: {
                    "aparelho_id"?: string,"caminho"?: string,"criado_em"?: string,"id"?: string,"ordem"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "fotos_aparelho_id_fkey"
      columns: ["aparelho_id"]
isOneToOne: false
      referencedRelation: "aparelhos"
      referencedColumns: ["id"]
    }
                  ]
                },"movimentacoes": {
                  Row: {
                    "aparelho_id": string | null,"cliente": string | null,"criado_em": string,"descricao": string,"forma_pagamento": Database["public"]['Enums']["forma_pagamento"] | null,"id": string,"observacao": string | null,"preco_unitario": number | null,"quantidade": number,"tipo": Database["public"]['Enums']["tipo_movimentacao"],"usuario_id": string | null,"usuario_nome": string
                  }
                  ComputedFields: never
                  Insert: {
                    "aparelho_id"?: string | null,"cliente"?: string | null,"criado_em"?: string,"descricao": string,"forma_pagamento"?: Database["public"]['Enums']["forma_pagamento"] | null,"id"?: string,"observacao"?: string | null,"preco_unitario"?: number | null,"quantidade": number,"tipo": Database["public"]['Enums']["tipo_movimentacao"],"usuario_id"?: string | null,"usuario_nome": string
                  }
                  Update: {
                    "aparelho_id"?: string | null,"cliente"?: string | null,"criado_em"?: string,"descricao"?: string,"forma_pagamento"?: Database["public"]['Enums']["forma_pagamento"] | null,"id"?: string,"observacao"?: string | null,"preco_unitario"?: number | null,"quantidade"?: number,"tipo"?: Database["public"]['Enums']["tipo_movimentacao"],"usuario_id"?: string | null,"usuario_nome"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "movimentacoes_aparelho_id_fkey"
      columns: ["aparelho_id"]
isOneToOne: false
      referencedRelation: "aparelhos"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "eh_dono":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"eh_equipe":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"registrar_movimentacao":
{ Args: { "p_aparelho": string,"p_cliente"?: string,"p_forma_pagamento"?: Database["public"]['Enums']["forma_pagamento"],"p_observacao"?: string,"p_preco_unitario"?: number,"p_quantidade": number,"p_tipo": Database["public"]['Enums']["tipo_movimentacao"] }; Returns: number
                           }
          }
          Enums: {
            "estado_aparelho": "novo"|"seminovo","forma_pagamento": "pix"|"cartao"|"dinheiro"|"troca","papel_acesso": "dono"|"funcionario","tipo_movimentacao": "entrada"|"venda"|"ajuste"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "estado_aparelho": ["novo", "seminovo"],"forma_pagamento": ["pix", "cartao", "dinheiro", "troca"],"papel_acesso": ["dono", "funcionario"],"tipo_movimentacao": ["entrada", "venda", "ajuste"]
          }
        }
} as const
