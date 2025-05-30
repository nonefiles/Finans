"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, DollarSign } from "lucide-react"
import type { Transaction } from "@/lib/types"
import { t } from "@/lib/translations"

interface FinancialSummaryProps {
  transactions: Transaction[]
}

export function FinancialSummary({ transactions }: FinancialSummaryProps) {
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0)

  const netBalance = totalIncome - totalExpenses

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("totalIncome")}</CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {totalIncome.toFixed(2)} {t("currency")}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("totalExpenses")}</CardTitle>
          <ArrowDownIcon className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {totalExpenses.toFixed(2)} {t("currency")}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("netBalance")}</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
            {netBalance.toFixed(2)} {t("currency")}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
