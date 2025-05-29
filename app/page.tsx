"use client"

import { useEffect, useState } from "react"
import { getTransactions } from "@/actions/transactions"
import type { Transaction } from "@/lib/types"
import { t } from "@/lib/translations"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionList } from "@/components/transaction-list"
import { FinancialSummary } from "@/components/financial-summary"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Wifi, WifiOff } from "lucide-react"

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    loadTransactions()

    // Online/offline durumunu takip et
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getTransactions()
      setTransactions(data)
    } catch (error) {
      console.error("Error loading transactions:", error)
      setError(error instanceof Error ? error.message : "Veriler yüklenirken hata oluştu")
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

  // Auto-refresh every 10 seconds when online
  useEffect(() => {
    if (!isOnline) return

    const interval = setInterval(() => {
      loadTransactions()
    }, 10000)

    return () => clearInterval(interval)
  }, [isOnline])

  if (error && loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Bağlantı Hatası</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={loadTransactions} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Tekrar Dene
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t("appTitle")}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t("appDescription")}</p>

          {/* Bağlantı durumu */}
          <div className="flex items-center justify-center gap-2 mt-2">
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Çevrimiçi - Veriler senkronize ediliyor</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600">Çevrimdışı - İnternet bağlantısı yok</span>
              </>
            )}
          </div>
        </div>

        {/* Hata mesajı */}
        {error && !loading && (
          <div className="mb-6">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                  <button
                    onClick={loadTransactions}
                    className="ml-auto px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Tekrar Dene
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
