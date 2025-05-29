"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import type { Transaction } from "@/lib/types"
import { t } from "@/lib/translations"

interface FinancialSummaryProps {
  transactions: Transaction[]
}

export function FinancialSummary({ transactions }: FinancialSummaryProps) {
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0)

  const netBalance = totalIncome - totalExpenses

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const getBalanceIcon = () => {
    if (netBalance > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (netBalance < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <DollarSign className="h-4 w-4 text-gray-600" />
  }

  const getBalanceColor = () => {
    if (netBalance > 0) return "text-green-600"
    if (netBalance < 0) return "text-red-600"
    return "text-gray-600"
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">{t("totalIncome")}</CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatAmount(totalIncome)} {t("currency")}
          </div>
          <p className="text-xs text-green-700 dark:text-green-300 mt-1">
            {transactions.filter((t) => t.type === "income").length} gelir işlemi
          </p>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">{t("totalExpenses")}</CardTitle>
          <ArrowDownIcon className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatAmount(totalExpenses)} {t("currency")}
          </div>
          <p className="text-xs text-red-700 dark:text-red-300 mt-1">
            {transactions.filter((t) => t.type === "expense").length} gider işlemi
          </p>
        </CardContent>
      </Card>

      <Card
        className={`border-2 ${netBalance >= 0 ? "border-green-200 bg-green-50/50 dark:bg-green-950/20" : "border-red-200 bg-red-50/50 dark:bg-red-950/20"}`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle
            className={`text-sm font-medium ${netBalance >= 0 ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}`}
          >
            {t("netBalance")}
          </CardTitle>
          {getBalanceIcon()}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getBalanceColor()}`}>
            {netBalance >= 0 ? "+" : ""}
            {formatAmount(netBalance)} {t("currency")}
          </div>
          <p
            className={`text-xs mt-1 ${netBalance >= 0 ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}
          >
            {netBalance >= 0 ? "Pozitif bakiye" : "Negatif bakiye"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
