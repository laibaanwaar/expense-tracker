import { formatCurrency } from '../utils/formatters.js'

function SummaryCards({ expenses }) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const categories = new Set(expenses.map((expense) => expense.category))

  return (
    <section className="summary-grid" aria-label="Expense summary">
      <div className="summary-card">
        <span>Total spent</span>
        <strong>{formatCurrency(total)}</strong>
      </div>
      <div className="summary-card">
        <span>Transactions</span>
        <strong>{expenses.length}</strong>
      </div>
      <div className="summary-card">
        <span>Categories</span>
        <strong>{categories.size}</strong>
      </div>
    </section>
  )
}

export default SummaryCards
