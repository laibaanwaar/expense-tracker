import { useEffect, useMemo, useState } from 'react'
import CategoryChart from '../components/CategoryChart.jsx'
import ExpenseForm from '../components/ExpenseForm.jsx'
import ExpenseList from '../components/ExpenseList.jsx'
import SummaryCards from '../components/SummaryCards.jsx'

const STORAGE_KEY = 'personal-expenses'

function loadExpenses() {
  const savedExpenses = localStorage.getItem(STORAGE_KEY)

  if (!savedExpenses) {
    return []
  }

  try {
    return JSON.parse(savedExpenses)
  } catch {
    return []
  }
}

function Dashboard() {
  const [expenses, setExpenses] = useState(loadExpenses)
  const [editingExpense, setEditingExpense] = useState(null)
  const sortedExpenses = useMemo(
    () => [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [expenses],
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
  }, [expenses])

  function saveExpense(expense) {
    setExpenses((current) => {
      const expenseExists = current.some((item) => item.id === expense.id)

      if (expenseExists) {
        return current.map((item) => (item.id === expense.id ? expense : item))
      }

      return [expense, ...current]
    })
    setEditingExpense(null)
  }

  function deleteExpense(expenseId) {
    setExpenses((current) => current.filter((expense) => expense.id !== expenseId))
    setEditingExpense((current) => (current?.id === expenseId ? null : current))
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Expense Tracker</p>
          <h1>Track daily spending and see where your money goes.</h1>
        </div>
      </section>

      <SummaryCards expenses={expenses} />

      <CategoryChart expenses={expenses} />

      <section className="form-section">
        <div className="panel">
          <h2>{editingExpense ? 'Edit expense' : 'Add expense'}</h2>
          <ExpenseForm
            editingExpense={editingExpense}
            onCancelEdit={() => setEditingExpense(null)}
            onSaveExpense={saveExpense}
          />
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>All expenses</h2>
          <span>Most recent first</span>
        </div>
        <ExpenseList
          expenses={sortedExpenses}
          onDeleteExpense={deleteExpense}
          onEditExpense={setEditingExpense}
        />
      </section>
    </main>
  )
}

export default Dashboard
