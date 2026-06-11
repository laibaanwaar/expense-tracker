import { formatCurrency } from '../utils/formatters.js'

const chartColors = ['#2563eb', '#14b8a6', '#f97316', '#a855f7', '#22c55e', '#f43f5e', '#eab308']

function getCategoryBreakdown(expenses) {
  return Object.values(
    expenses.reduce((groups, expense) => {
      const current = groups[expense.category] ?? {
        category: expense.category,
        amount: 0,
      }

      groups[expense.category] = {
        ...current,
        amount: current.amount + expense.amount,
      }

      return groups
    }, {}),
  )
    .sort((a, b) => b.amount - a.amount)
    .map((item, index) => ({
      ...item,
      color: chartColors[index % chartColors.length],
    }))
}

function getDonutGradient(breakdown, total) {
  let currentPercent = 0

  return breakdown
    .map((item) => {
      const start = currentPercent
      const end = start + (item.amount / total) * 100
      currentPercent = end
      return `${item.color} ${start}% ${end}%`
    })
    .join(', ')
}

function CategoryChart({ expenses }) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const breakdown = getCategoryBreakdown(expenses)
  const maxAmount = Math.max(...breakdown.map((item) => item.amount), 0)
  const donutGradient = total > 0 ? getDonutGradient(breakdown, total) : '#e2e8f0 0% 100%'

  if (breakdown.length === 0) {
    return (
      <section className="visualization-grid">
        <div className="visual-card">
          <h2>By category</h2>
          <div className="empty-state">
            <h2>No summary yet</h2>
            <p>Add expenses to see category-wise spending.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="visualization-grid" aria-label="Spending visualizations">
      <div className="visual-card">
        <h2>By category</h2>
        <div className="donut-wrap">
          <div
            className="donut-chart"
            style={{ background: `conic-gradient(${donutGradient})` }}
            aria-label="Category spending donut chart"
          >
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
        <div className="chart-legend">
          {breakdown.map((item) => (
            <span key={item.category}>
              <i style={{ background: item.color }} />
              {item.category}
            </span>
          ))}
        </div>
      </div>

      <div className="visual-card">
        <h2>Category totals</h2>
        <div className="bar-chart">
          <div className="bar-grid" aria-hidden="true">
            <span>{Math.ceil(maxAmount)}</span>
            <span>{Math.ceil(maxAmount * 0.75)}</span>
            <span>{Math.ceil(maxAmount * 0.5)}</span>
            <span>{Math.ceil(maxAmount * 0.25)}</span>
            <span>0</span>
          </div>
          <div className="bar-series">
            {breakdown.map((item) => {
              const height = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0

              return (
                <div className="bar-item" key={item.category}>
                  <div className="bar-column">
                    <span
                      style={{ height: `${height}%`, background: item.color }}
                      title={`${item.category}: ${formatCurrency(item.amount)}`}
                    />
                  </div>
                  <strong>{item.category}</strong>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="visual-card visual-card--compact">
        <h2>Breakdown details</h2>
        <div className="category-chart">
          {breakdown.map((item) => {
            const percentage = total > 0 ? (item.amount / total) * 100 : 0

            return (
              <div className="chart-row" key={item.category}>
                <div className="chart-row__meta">
                  <span>{item.category}</span>
                  <strong>{formatCurrency(item.amount)}</strong>
                </div>
                <div className="chart-track" aria-label={`${item.category} ${percentage.toFixed(0)}%`}>
                  <span style={{ width: `${percentage}%`, background: item.color }} />
                </div>
                <small>{percentage.toFixed(1)}%</small>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CategoryChart
