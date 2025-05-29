export interface Transaction {
  id: string
  user_id: string
  type: "income" | "expense"
  amount: number
  description: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  full_name?: string
}
