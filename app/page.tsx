"use client"

import { useEffect, useState } from "react"
import { getTransactions } from "@/actions/transactions"
import type { Transaction } from "@/lib/types"
import { t } from "@/lib/translations"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionList } from "@/components/transaction-list"
import { FinancialSummary } from "@/components/financial-summary"

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const data = await getTransactions()
      setTransactions(data)
    } catch (error) {
      console.error("Error loading transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
  }

  const handleEditComplete = () => {
    setEditingTransaction(null)
    loadTransactions()
  }

  // Auto-refresh every 5 seconds to show new transactions from other devices
  useEffect(() => {
    const interval = setInterval(() => {
      loadTransactions()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t("appTitle")}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t("appDescription")}</p>
          <p className="text-sm text-gray-500 mt-2">
            💡 Veriler tüm cihazlarda senkronize edilir - başka cihazlardan da görüntüleyebilirsiniz
          </p>
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
            {loading ? (
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
