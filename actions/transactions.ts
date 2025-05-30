"use server"

import { createServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function getTransactions() {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("transactions").select("*").order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function createTransaction(formData: FormData) {
  const supabase = createServerClient()

  const type = formData.get("type") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string

  if (!type || !amount || !description) {
    throw new Error("Tüm alanlar zorunludur")
  }

  const { error } = await supabase.from("transactions").insert({
    user_id: "public-user", // Sabit kullanıcı ID'si
    type,
    amount,
    description,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/")
  return { success: true }
}

export async function updateTransaction(formData: FormData) {
  const supabase = createServerClient()

  const id = formData.get("id") as string
  const type = formData.get("type") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string

  if (!id || !type || !amount || !description) {
    throw new Error("Tüm alanlar zorunludur")
  }

  const { error } = await supabase
    .from("transactions")
    .update({
      type,
      amount,
      description,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/")
  return { success: true }
}

export async function deleteTransaction(id: string) {
  const supabase = createServerClient()

  const { error } = await supabase.from("transactions").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/")
  return { success: true }
}
