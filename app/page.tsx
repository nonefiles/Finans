"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { getTransactions } from "@/actions/transactions"
import type { Transaction } from "@/lib/types"
import { t } from "@/lib/translations"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionList } from "@/components/transaction-list"
import { FinancialSummary } from "@/components/financial-summary"
import { SignIn } from "@/components/auth/sign-in"

export default function HomePage() {
  const { user, loading, signOut } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [loadingTransactions, setLoadingTransactions] = useState(true)

  useEffect(() => {
    if (user) {
      loadTransactions()
    }
  }, [user])

  const loadTransactions = async () => {
    if (!user) return

    try {
      setLoadingTransactions(true)
      const data = await getTransactions(user.id)
      setTransactions(data)
    } catch (error) {
      console.error("Error loading transactions:", error)
    } finally {
      setLoadingTransactions(false)
    }
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
  }

  const handleEditComplete = () => {
    setEditingTransaction(null)
    loadTransactions()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>{t("loading")}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <SignIn />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t("appTitle")}</h1>
            <p className="text-gray-600 dark:text-gray-400">{t("appDescription")}</p>
          </div>
          <Button variant="outline" onClick={signOut} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            {t("signOut")}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Transaction Form */}
          <div className="lg:col-span-1">
            <TransactionForm editingTransaction={editingTransaction} onEditComplete={handleEditComplete} />
          </div>

          {/* Summary and Transactions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Financial Summary */}
            <FinancialSummary transactions={transactions} />

            {/* Transaction List */}
            {loadingTransactions ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>{t("loading")}</p>
              </div>
            ) : (
              <TransactionList transactions={transactions} onEdit={handleEdit} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
