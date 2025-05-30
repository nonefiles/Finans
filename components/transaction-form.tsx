"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit } from "lucide-react"
import { createTransaction, updateTransaction } from "@/actions/transactions"
import { useAuth } from "@/lib/auth"
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
  const [isPending, startTransition] = useTransition()
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !type || !amount || !description) {
      toast({
        title: t("error"),
        description: t("fieldRequired"),
        variant: "destructive",
      })
      return
    }

    const formData = new FormData()
    formData.append("type", type)
    formData.append("amount", amount)
    formData.append("description", description)

    if (editingTransaction) {
      formData.append("id", editingTransaction.id)
    } else {
      formData.append("userId", user.id)
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
        }

        // Reset form if not editing
        if (!editingTransaction) {
          setType("")
          setAmount("")
          setDescription("")
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
            <Label htmlFor="type">{t("transactionType")}</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">{t("income")}</SelectItem>
                <SelectItem value="expense">{t("expense")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">{t("amount")}</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder={t("enterAmount")}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              placeholder={t("enterDescription")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
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
