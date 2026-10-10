import { useEffect, useState } from "react";
import "./App.css";

const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Other"];

const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD, local time

const formatMoney = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const sumOf = (list) => list.reduce((sum, e) => sum + e.money, 0);

const emptyForm = () => ({
  date: today(),
  itemName: "",
  money: "",
  category: "Food",
});

const loadExpenses = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("expenses")) || [];
    return saved.map((e) => ({ ...e, category: e.category || "Other" }));
  } catch {
    return [];
  }
};

function App() {
  const [expenses, setExpenses] = useState(loadExpenses);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const money = Number(form.money);
    if (!form.itemName.trim() || money <= 0) return;

    const data = { ...form, itemName: form.itemName.trim(), money };

    if (editingId) {
      setExpenses(
        expenses.map((x) => (x.id === editingId ? { ...x, ...data } : x))
      );
    } else {
      setExpenses([{ id: Date.now(), ...data }, ...expenses]);
    }
    resetForm();
  };

  const handleEdit = (expense) => {
    const { id, ...fields } = expense;
    setForm(fields);
    setEditingId(id);
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter((x) => x.id !== id));
    if (id === editingId) resetForm();
  };

  const byCategory = (cat) =>
    cat === "All" ? expenses : expenses.filter((x) => x.category === cat);

  const visible = [...byCategory(filter)].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <div className="container">
      <h1 className="header">EXPENSE TRACKER</h1>

      <form className="new-expense-div" onSubmit={handleSubmit}>
        <input
          type="date"
          name="date"
          className="item-date"
          aria-label="Date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="itemName"
          className="name"
          placeholder="Item name"
          aria-label="Item name"
          value={form.itemName}
          onChange={handleChange}
          required
        />
        <select
          name="category"
          className="category"
          aria-label="Category"
          value={form.category}
          onChange={handleChange}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="number"
          name="money"
          className="money"
          placeholder="Amount"
          aria-label="Amount"
          min="0.01"
          step="0.01"
          value={form.money}
          onChange={handleChange}
          required
        />
        <button type="submit" className="add-expense">
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button type="button" className="secondary" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <div className="filters">
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            className={`chip ${filter === cat ? "active" : ""}`}
            onClick={() => setFilter(cat)}
          >
            {cat} · {formatMoney(sumOf(byCategory(cat)))}
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="empty">No expenses to show.</p>
      )}

      {visible.map((expense) => (
        <div
          className={`expense-div ${expense.id === editingId ? "editing" : ""}`}
          key={expense.id}
        >
          <button
            className="delete-expense"
            aria-label={`Delete ${expense.itemName}`}
            onClick={() => handleDelete(expense.id)}
          >
            ×
          </button>
          <p className="expense-date">{expense.date}</p>
          <div className="expense-name">
            {expense.itemName}
            <span className="badge">{expense.category}</span>
          </div>
          <p className="expense-money">{formatMoney(expense.money)}</p>
          <button
            className="secondary"
            aria-label={`Edit ${expense.itemName}`}
            onClick={() => handleEdit(expense)}
          >
            Edit
          </button>
        </div>
      ))}

      <div className="total-expense-div">
        <p className="text">
          {filter === "All" ? "Total Expenses" : `${filter} Total`}
        </p>
        <p className="total-dollars">{formatMoney(sumOf(visible))}</p>
      </div>
    </div>
  );
}

export default App;