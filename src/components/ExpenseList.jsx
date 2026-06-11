import { formatCurrency, formatDate } from '../utils/formatters.js'

function ExpenseList({ expenses, onDeleteExpense, onEditExpense }) {
  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <h2>No expenses yet</h2>
        <p>Add your first expense to start tracking your spending.</p>
      </div>
    )
  }

  return (
    <div className="expense-table" role="table" aria-label="All expenses">
      <div className="expense-row expense-row--head" role="row">
        <span>Title</span>
        <span>Category</span>
        <span>Date</span>
        <span>Amount</span>
        <span>Actions</span>
      </div>

      {expenses.map((expense) => (
        <article className="expense-row" key={expense.id} role="row">
          <div className="expense-title">
            <h3>{expense.title}</h3>
            {expense.notes && <p>{expense.notes}</p>}
          </div>
          <span>{expense.category}</span>
          <span>{formatDate(expense.date)}</span>
          <strong>{formatCurrency(expense.amount)}</strong>
          <div className="expense-actions">
            <button type="button" onClick={() => onEditExpense(expense)}>
              Edit
            </button>
            <button type="button" onClick={() => onDeleteExpense(expense.id)}>
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

export default ExpenseList
