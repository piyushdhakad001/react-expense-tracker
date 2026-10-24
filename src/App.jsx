import { useState, useEffect } from "react";
import "./App.css";

import SummaryCards from "./components/SummaryCards";
import EntryForm from "./components/EntryForm";
import FilterBar from "./components/FilterBar";
import ExpenseList from "./components/ExpenseList";
import { today, getTotal, exportCSV } from "./utils";

const API = "https://react-expense-tracker-bovu.onrender.com";

function App() {
  // ---------- state: data that can change ----------
  const [expenses, setExpenses] = useState([]);

  // what is typed in the form
  const [type, setType] = useState("expense");
  const [date, setDate] = useState(today());
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");

  // null means "adding a new entry", a number means "editing that entry"
  const [editId, setEditId] = useState(null);

  // list controls
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // ---------- load entries from the server (runs once, when the app opens) ----------
  useEffect(function () {
    fetch(API + "/api/expenses")
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        setExpenses(data);
      });
  }, []);

  // ---------- functions that run when the user does something ----------
  function clearForm() {
    setType("expense");
    setDate(today());
    setName("");
    setCategory("Food");
    setAmount("");
    setEditId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault(); // stops the page from reloading

    const cleanName = name.trim();
    const amountNumber = Number(amount);

    // do nothing if the name is empty or the amount is not above zero
    if (cleanName === "") {
      return;
    }
    if (amountNumber <= 0) {
      return;
    }

    // the data we send to the server (the server creates the id)
    const entry = {
      type: type,
      date: date,
      itemName: cleanName,
      category: category,
      money: amountNumber,
    };

    if (editId === null) {
      // ADD: send to the server, then put the saved entry first
      const res = await fetch(API + "/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      const savedEntry = await res.json();

      setExpenses([savedEntry, ...expenses]);
    } else {
      // EDIT: send to the server, then replace that entry in our list
      const res = await fetch(API + "/api/expenses/" + editId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      const savedEntry = await res.json();

      const newList = [];
      for (let i = 0; i < expenses.length; i++) {
        if (expenses[i].id === editId) {
          newList.push(savedEntry);
        } else {
          newList.push(expenses[i]);
        }
      }
      setExpenses(newList);
    }

    clearForm();
  }

  function handleEdit(entry) {
    // put the entry's values back into the form
    setType(entry.type);
    setDate(entry.date);
    setName(entry.itemName);
    setCategory(entry.category);
    setAmount(entry.money);
    setEditId(entry.id);
    window.scrollTo(0, 0);
  }

  async function handleDelete(id) {
    await fetch(API + "/api/expenses/" + id, { method: "DELETE" });

    // copy every entry except the one we are deleting
    const newList = [];
    for (let i = 0; i < expenses.length; i++) {
      if (expenses[i].id !== id) {
        newList.push(expenses[i]);
      }
    }
    setExpenses(newList);

    if (id === editId) {
      clearForm();
    }
  }

  // ---------- numbers worked out from the list ----------
  const totalIncome = getTotal(expenses, "income");
  const totalExpense = getTotal(expenses, "expense");
  const netBalance = totalIncome - totalExpense;

  // ---------- the entries to show, after filter and search ----------
  const visible = [];
  for (let i = 0; i < expenses.length; i++) {
    const entry = expenses[i];

    let categoryMatches = false;
    if (filter === "All" || entry.category === filter) {
      categoryMatches = true;
    }

    let searchMatches = false;
    if (entry.itemName.toLowerCase().includes(search.toLowerCase())) {
      searchMatches = true;
    }

    if (categoryMatches && searchMatches) {
      visible.push(entry);
    }
  }

  // newest date first
  visible.sort(function (a, b) {
    return b.date.localeCompare(a.date);
  });

  // ---------- what appears on the screen ----------
  return (
    <div className="container">
      <div className="app-header">
        <h1 className="header">Expense Tracker</h1>
        <button
          className="export-btn"
          onClick={function () {
            exportCSV(expenses);
          }}
        >
          Export CSV
        </button>
      </div>

      <SummaryCards
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        netBalance={netBalance}
      />

      <EntryForm
        type={type} setType={setType}
        date={date} setDate={setDate}
        name={name} setName={setName}
        category={category} setCategory={setCategory}
        amount={amount} setAmount={setAmount}
        editId={editId}
        onSubmit={handleSubmit}
        onCancel={clearForm}
      />

      <FilterBar
        search={search} setSearch={setSearch}
        filter={filter} setFilter={setFilter}
      />

      <ExpenseList
        list={visible}
        editId={editId}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
