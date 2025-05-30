"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowDownIcon, ArrowUpIcon, DollarSign, Edit, Trash2 } from "lucide-react"
import { deleteTransaction } from "@/actions/transactions"
import type { Transaction } from "@/lib/types"
import { t } from "@/lib/translations"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface TransactionListProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
}

export function TransactionList({ transactions, onEdit }: TransactionListProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      try {
        await deleteTransaction(id)
        toast({
          title: t("success"),
          description: t("transactionDeleted"),
        })
      } catch (error) {
        toast({
          title: t("error"),
          description: error instanceof Error ? error.message : "Bir hata oluştu",
          variant: "destructive",
        })
      }
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return t("today")
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t("yesterday")
    } else {
      return date.toLocaleDateString("tr-TR")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("recentTransactions")}</CardTitle>
        <CardDescription>
          {transactions.length === 0 ? t("noTransactions") : `${transactions.length} işlem kaydedildi`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t("noTransactions")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <div key={transaction.id}>
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === "income" ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpIcon className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={transaction.type === "income" ? "default" : "destructive"}>
                          {t(transaction.type)}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(transaction.created_at)}
                        </span>
                      </div>
                      <p className="font-medium">{transaction.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-lg font-bold ${
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {transaction.amount.toFixed(2)} {t("currency")}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(transaction)}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-600"
                            disabled={isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("confirmDelete")}</AlertDialogTitle>
                            <AlertDialogDescription>{t("deleteConfirmation")}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(transaction.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {t("delete")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
                {index < transactions.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
