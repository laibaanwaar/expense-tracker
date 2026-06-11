import { useEffect, useState } from 'react'
import { categories } from '../data/categories.js'

const initialForm = {
  title: '',
  amount: '',
  category: categories[0],
  date: new Date().toISOString().slice(0, 10),
  notes: '',
}

function ExpenseForm({ editingExpense, onCancelEdit, onSaveExpense }) {
  const [form, setForm] = useState(initialForm)
  const isEditing = Boolean(editingExpense)

  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title,
        amount: String(editingExpense.amount),
        category: editingExpense.category,
        date: editingExpense.date,
        notes: editingExpense.notes ?? '',
      })
      return
    }

    setForm(initialForm)
  }, [editingExpense])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const amount = Number(form.amount)
    if (!form.title.trim() || Number.isNaN(amount) || amount <= 0) {
      return
    }

    onSaveExpense({
      id: editingExpense?.id ?? crypto.randomUUID(),
      title: form.title.trim(),
      amount,
      category: form.category,
      date: form.date,
      notes: form.notes.trim(),
    })

    setForm(initialForm)
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <label>
        Title
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Dinner with friends"
          required
        />
      </label>

      <label>
        Amount
        <input
          name="amount"
          type="number"
          min="0"
          step="0.01"
          value={form.amount}
          onChange={handleChange}
          placeholder="2200"
          required
        />
      </label>

      <label>
        Category
        <select name="category" value={form.category} onChange={handleChange}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label>
        Date
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Notes
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Optional details"
          rows="4"
        />
      </label>

      <div className="form-actions">
        <button type="submit">{isEditing ? 'Save changes' : 'Add expense'}</button>
        {isEditing && (
          <button className="button-secondary" type="button" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default ExpenseForm
