"use server"

import { createServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function getTransactions() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("transactions").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      throw new Error("Veriler yüklenirken hata oluştu")
    }

    return data || []
  } catch (error) {
    console.error("Get transactions error:", error)
    throw new Error("Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.")
  }
}

export async function createTransaction(formData: FormData) {
  try {
    const supabase = createServerClient()

    const type = formData.get("type") as string
    const amountStr = formData.get("amount") as string
    const description = formData.get("description") as string

    // Validasyon
    if (!type || !amountStr || !description) {
      throw new Error("Tüm alanlar zorunludur")
    }

    const amount = Number.parseFloat(amountStr)

    if (isNaN(amount) || amount <= 0) {
      throw new Error("Geçerli bir tutar girin (0'dan büyük olmalıdır)")
    }

    if (amount > 999999999.99) {
      throw new Error("Tutar çok büyük (maksimum 999,999,999.99)")
    }

    if (description.trim().length < 2) {
      throw new Error("Açıklama en az 2 karakter olmalıdır")
    }

    if (description.length > 500) {
      throw new Error("Açıklama çok uzun (maksimum 500 karakter)")
    }

    // user_id artık tamamen opsiyonel, hiç göndermeyelim
    const { error } = await supabase.from("transactions").insert({
      type,
      amount,
      description: description.trim(),
    })

    if (error) {
      console.error("Database insert error:", error)
      throw new Error("İşlem kaydedilirken hata oluştu")
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Create transaction error:", error)
    throw error instanceof Error ? error : new Error("Beklenmeyen bir hata oluştu")
  }
}

export async function updateTransaction(formData: FormData) {
  try {
    const supabase = createServerClient()

    const id = formData.get("id") as string
    const type = formData.get("type") as string
    const amountStr = formData.get("amount") as string
    const description = formData.get("description") as string

    // Validasyon
    if (!id || !type || !amountStr || !description) {
      throw new Error("Tüm alanlar zorunludur")
    }

    const amount = Number.parseFloat(amountStr)

    if (isNaN(amount) || amount <= 0) {
      throw new Error("Geçerli bir tutar girin (0'dan büyük olmalıdır)")
    }

    if (amount > 999999999.99) {
      throw new Error("Tutar çok büyük (maksimum 999,999,999.99)")
    }

    if (description.trim().length < 2) {
      throw new Error("Açıklama en az 2 karakter olmalıdır")
    }

    const { error } = await supabase
      .from("transactions")
      .update({
        type,
        amount,
        description: description.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      console.error("Database update error:", error)
      throw new Error("İşlem güncellenirken hata oluştu")
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Update transaction error:", error)
    throw error instanceof Error ? error : new Error("Beklenmeyen bir hata oluştu")
  }
}

export async function deleteTransaction(id: string) {
  try {
    const supabase = createServerClient()

    if (!id) {
      throw new Error("İşlem ID'si gereklidir")
    }

    const { error } = await supabase.from("transactions").delete().eq("id", id)

    if (error) {
      console.error("Database delete error:", error)
      throw new Error("İşlem silinirken hata oluştu")
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Delete transaction error:", error)
    throw error instanceof Error ? error : new Error("Beklenmeyen bir hata oluştu")
  }
}
