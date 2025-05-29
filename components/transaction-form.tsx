"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, AlertCircle } from "lucide-react"
import { createTransaction, updateTransaction } from "@/actions/transactions"
import { t } from "@/lib/translations"
import type { Transaction } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface TransactionFormProps {
  editingTransaction?: Transaction | null
  onEditComplete?: () => void
}

export function TransactionForm({ editingTransaction, onEditComplete }: TransactionFormProps) {
  const [type, setType] = useState(editingTransaction?.type || "")
  const [amount, setAmount] = useState(editingTransaction?.amount?.toString() || "")
  const [description, setDescription] = useState(editingTransaction?.description || "")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!type) {
      newErrors.type = "İşlem türü seçilmelidir"
    }

    if (!amount) {
      newErrors.amount = "Tutar girilmelidir"
    } else {
      const numAmount = Number.parseFloat(amount)
      if (isNaN(numAmount) || numAmount <= 0) {
        newErrors.amount = "Geçerli bir tutar girin (0'dan büyük)"
      } else if (numAmount > 999999999.99) {
        newErrors.amount = "Tutar çok büyük (maks. 999,999,999.99)"
      }
    }

    if (!description.trim()) {
      newErrors.description = "Açıklama girilmelidir"
    } else if (description.trim().length < 2) {
      newErrors.description = "Açıklama en az 2 karakter olmalıdır"
    } else if (description.length > 500) {
      newErrors.description = "Açıklama çok uzun (maks. 500 karakter)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const formData = new FormData()
    formData.append("type", type)
    formData.append("amount", amount)
    formData.append("description", description.trim())

    if (editingTransaction) {
      formData.append("id", editingTransaction.id)
    }

    startTransition(async () => {
      try {
        if (editingTransaction) {
          await updateTransaction(formData)
          toast({
            title: t("success"),
            description: t("transactionUpdated"),
          })
          onEditComplete?.()
        } else {
          await createTransaction(formData)
          toast({
            title: t("success"),
            description: t("transactionAdded"),
          })
          // Reset form
          setType("")
          setAmount("")
          setDescription("")
          setErrors({})
        }
      } catch (error) {
        toast({
          title: t("error"),
          description: error instanceof Error ? error.message : "Bir hata oluştu",
          variant: "destructive",
        })
      }
    })
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Sadece sayı ve nokta karakterlerine izin ver
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
      if (errors.amount) {
        setErrors({ ...errors, amount: "" })
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {editingTransaction ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          {editingTransaction ? t("editTransaction") : t("addTransaction")}
        </CardTitle>
        <CardDescription>
          {editingTransaction ? "İşlem bilgilerini güncelleyin" : "Gelir veya gider detaylarını girin"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">{t("transactionType")} *</Label>
            <Select
              value={type}
              onValueChange={(value) => {
                setType(value)
                if (errors.type) setErrors({ ...errors, type: "" })
              }}
            >
              <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                <SelectValue placeholder={t("selectType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">{t("income")}</SelectItem>
                <SelectItem value="expense">{t("expense")}</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {errors.type}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">{t("amount")} * (₺)</Label>
            <Input
              id="amount"
              type="text"
              placeholder={t("enterAmount")}
              value={amount}
              onChange={handleAmountChange}
              className={errors.amount ? "border-red-500" : ""}
            />
            {errors.amount && (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {errors.amount}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("description")} *</Label>
            <Textarea
              id="description"
              placeholder={t("enterDescription")}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                if (errors.description) setErrors({ ...errors, description: "" })
              }}
              rows={3}
              className={errors.description ? "border-red-500" : ""}
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              {errors.description && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {errors.description}
                </div>
              )}
              <div className="text-xs text-gray-500 ml-auto">{description.length}/500</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? t("loading") : editingTransaction ? t("save") : t("addTransaction")}
            </Button>
            {editingTransaction && (
              <Button type="button" variant="outline" onClick={onEditComplete}>
                {t("cancel")}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
