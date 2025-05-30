"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface AccountMovement {
  id: string
  type: "Income" | "Expense"
  category: string
  amount: number
  date: string
}

interface Expense {
  id: string
  type: string
  paymentMethod: "Cash" | "Card" | "Transfer"
  description: string
  date: string
}

export default function FinanceTracker() {
  const [accountMovements, setAccountMovements] = useState<AccountMovement[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])

  // Account Movements form state
  const [movementType, setMovementType] = useState<"Income" | "Expense" | "">("")
  const [movementCategory, setMovementCategory] = useState("")
  const [movementAmount, setMovementAmount] = useState("")

  // Expenses form state
  const [expenseType, setExpenseType] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Card" | "Transfer" | "">("")
  const [expenseDescription, setExpenseDescription] = useState("")

  const handleAccountMovementSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!movementType || !movementCategory || !movementAmount) {
      return
    }

    const newMovement: AccountMovement = {
      id: Date.now().toString(),
      type: movementType,
      category: movementCategory,
      amount: Number.parseFloat(movementAmount),
      date: new Date().toLocaleDateString(),
    }

    setAccountMovements([...accountMovements, newMovement])

    // Reset form
    setMovementType("")
    setMovementCategory("")
    setMovementAmount("")
  }

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!expenseType || !paymentMethod) {
      return
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      type: expenseType,
      paymentMethod: paymentMethod,
      description: expenseDescription,
      date: new Date().toLocaleDateString(),
    }

    setExpenses([...expenses, newExpense])

    // Reset form
    setExpenseType("")
    setPaymentMethod("")
    setExpenseDescription("")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Finance Tracker</h1>
        <p className="text-muted-foreground">Track your account movements and expenses</p>
      </div>

      <Tabs defaultValue="movements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="movements">Account Movements</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="movements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Account Movement</CardTitle>
              <CardDescription>Record income or expense transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAccountMovementSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="movement-type">Movement Type</Label>
                    <Select
                      value={movementType}
                      onValueChange={(value: "Income" | "Expense") => setMovementType(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Income">Income</SelectItem>
                        <SelectItem value="Expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="movement-category">Category</Label>
                    <Input
                      id="movement-category"
                      type="text"
                      placeholder="e.g., Salary, Groceries"
                      value={movementCategory}
                      onChange={(e) => setMovementCategory(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="movement-amount">Amount</Label>
                    <Input
                      id="movement-amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={movementAmount}
                      onChange={(e) => setMovementAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  Add Movement
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Movements History</CardTitle>
              <CardDescription>
                {accountMovements.length} {accountMovements.length === 1 ? "movement" : "movements"} recorded
              </CardDescription>
            </CardHeader>
            <CardContent>
              {accountMovements.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No movements recorded yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accountMovements.map((movement) => (
                        <TableRow key={movement.id}>
                          <TableCell>{movement.date}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                movement.type === "Income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {movement.type}
                            </span>
                          </TableCell>
                          <TableCell>{movement.category}</TableCell>
                          <TableCell
                            className={`text-right font-medium ${
                              movement.type === "Income" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {movement.type === "Income" ? "+" : "-"}
                            {formatCurrency(movement.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Expense</CardTitle>
              <CardDescription>Record your expense details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleExpenseSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expense-type">Expense Type</Label>
                    <Input
                      id="expense-type"
                      type="text"
                      placeholder="e.g., Restaurant, Gas, Shopping"
                      value={expenseType}
                      onChange={(e) => setExpenseType(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Select
                      value={paymentMethod}
                      onValueChange={(value: "Cash" | "Card" | "Transfer") => setPaymentMethod(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Card">Card</SelectItem>
                        <SelectItem value="Transfer">Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expense-description">Description (Optional)</Label>
                  <Textarea
                    id="expense-description"
                    placeholder="Additional details about the expense..."
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  Add Expense
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expenses History</CardTitle>
              <CardDescription>
                {expenses.length} {expenses.length === 1 ? "expense" : "expenses"} recorded
              </CardDescription>
            </CardHeader>
            <CardContent>
              {expenses.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No expenses recorded yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>{expense.date}</TableCell>
                          <TableCell className="font-medium">{expense.type}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {expense.paymentMethod}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {expense.description || (
                              <span className="text-muted-foreground italic">No description</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
