import { useState, useEffect } from "react";
import "./App.css";

const categories = ["Food", "Transport", "Shopping", "Bills", "Salary", "Other"];

// Returns today's date like "2026-10-10"
function today() {
  return new Date().toLocaleDateString("en-CA");
}

// Turns 25.5 into "$25.50"
function money(number) {
  return "$" + number.toFixed(2);
}

// Reads saved entries from the browser (runs once, when the app opens)
function loadExpenses() {
  try {
    const saved = localStorage.getItem("expenses");
    if (saved === null) {
      return [];
    }

    const list = JSON.parse(saved);
    // entries saved by older versions of the app may miss some values
    for (let i = 0; i < list.length; i++) {
      if (!list[i].category) {
        list[i].category = "Other";
      }
      if (!list[i].type) {
        list[i].type = "expense";
      }
    }
    return list;
  } catch (error) {
    // if the saved data is broken, start with an empty list
    return [];
  }
}

// Adds up the money of all entries of one type ("income" or "expense")
function getTotal(list, type) {
  let total = 0;
  for (let i = 0; i < list.length; i++) {
    if (list[i].type === type) {
      total = total + list[i].money;
    }
  }
  return total;
}

function App() {
  // ---------- state: data that can change ----------
  const [expenses, setExpenses] = useState(loadExpenses);

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

  // ---------- save to the browser whenever the list changes ----------
  useEffect(
    function () {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    },
    [expenses]
  );

  // ---------- functions that run when the user does something ----------
  function clearForm() {
    setType("expense");
    setDate(today());
    setName("");
    setCategory("Food");
    setAmount("");
    setEditId(null);
  }

  function handleSubmit(event) {
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

    const newList = [];

    if (editId === null) {
      // ADD: the new entry goes first, then all the old ones
      const newEntry = {
        id: Date.now(),
        type: type,
        date: date,
        itemName: cleanName,
        category: category,
        money: amountNumber,
      };
      newList.push(newEntry);
      for (let i = 0; i < expenses.length; i++) {
        newList.push(expenses[i]);
      }
    } else {
      // EDIT: copy every entry, but replace the one we are editing
      for (let i = 0; i < expenses.length; i++) {
        if (expenses[i].id === editId) {
          const updatedEntry = {
            id: editId,
            type: type,
            date: date,
            itemName: cleanName,
            category: category,
            money: amountNumber,
          };
          newList.push(updatedEntry);
        } else {
          newList.push(expenses[i]);
        }
      }
    }

    setExpenses(newList);
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

  function handleDelete(id) {
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

  function handleExport() {
    if (expenses.length === 0) {
      alert("No data to export!");
      return;
    }

    // build the file text: first the header line, then one line per entry
    let csv = "ID,Date,Name,Category,Type,Amount\n";
    for (let i = 0; i < expenses.length; i++) {
      const entry = expenses[i];
      // a quote inside a name must be written as two quotes in a CSV file
      const safeName = entry.itemName.split('"').join('""');
      csv = csv + entry.id + "," + entry.date + ',"' + safeName + '",';
      csv = csv + entry.category + "," + entry.type + "," + entry.money + "\n";
    }

    // make a temporary download link and click it
    const file = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "expenses.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  // ---------- numbers worked out from the list ----------
  const totalIncome = getTotal(expenses, "income");
  const totalExpense = getTotal(expenses, "expense");
  const netBalance = totalIncome - totalExpense;

  // green-blue when balance is zero or more, yellow when it is below zero
  let balanceClass = "summary-card balance positive";
  if (netBalance < 0) {
    balanceClass = "summary-card balance negative";
  }

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

  // ---------- build the pieces of the page ----------

  // options of the category dropdown
  const categoryOptions = [];
  for (let i = 0; i < categories.length; i++) {
    categoryOptions.push(<option key={categories[i]}>{categories[i]}</option>);
  }

  // filter buttons: All, Food, Transport...
  const filterNames = ["All"].concat(categories);
  const filterButtons = [];
  for (let i = 0; i < filterNames.length; i++) {
    const filterName = filterNames[i];

    let buttonClass = "chip";
    if (filter === filterName) {
      buttonClass = "chip active";
    }

    filterButtons.push(
      <button
        key={filterName}
        className={buttonClass}
        onClick={function () {
          setFilter(filterName);
        }}
      >
        {filterName}
      </button>
    );
  }

  // one row for every visible entry
  const entryRows = [];
  for (let i = 0; i < visible.length; i++) {
    const entry = visible[i];

    let rowClass = "expense-div " + entry.type;
    if (entry.id === editId) {
      rowClass = rowClass + " editing";
    }

    let sign = "-";
    if (entry.type === "income") {
      sign = "+";
    }

    entryRows.push(
      <div className={rowClass} key={entry.id}>
        <button
          className="delete-expense"
          title="Delete"
          onClick={function () {
            handleDelete(entry.id);
          }}
        >
          ×
        </button>
        <p className="expense-date">{entry.date}</p>
        <div className="expense-name">
          {entry.itemName}
          <span className="badge">{entry.category}</span>
        </div>
        <p className={"expense-money " + entry.type}>
          {sign}
          {money(entry.money)}
        </p>
        <button
          className="secondary edit-btn"
          onClick={function () {
            handleEdit(entry);
          }}
        >
          Edit
        </button>
      </div>
    );
  }

  // message when there is nothing to show
  let emptyMessage = null;
  if (visible.length === 0) {
    emptyMessage = <p className="empty">No transactions found.</p>;
  }

  // button text changes while editing, and a Cancel button appears
  let submitText = "Add Entry";
  let cancelButton = null;
  if (editId !== null) {
    submitText = "Update";
    cancelButton = (
      <button type="button" className="secondary" onClick={clearForm}>
        Cancel
      </button>
    );
  }

  // ---------- what appears on the screen ----------
  return (
    <div className="container">
      <div className="app-header">
        <h1 className="header">EXPENSE TRACKER</h1>
        <button className="export-btn" onClick={handleExport}>
          Export CSV
        </button>
      </div>

      <div className="summary-grid">
        <div className="summary-card income">
          <p>Total Income</p>
          <h3>{money(totalIncome)}</h3>
        </div>
        <div className="summary-card expense">
          <p>Total Expenses</p>
          <h3>{money(totalExpense)}</h3>
        </div>
        <div className={balanceClass}>
          <p>Net Balance</p>
          <h3>{money(netBalance)}</h3>
        </div>
      </div>

      <form className="new-expense-div" onSubmit={handleSubmit}>
        <select
          className="type-select"
          value={type}
          onChange={function (event) {
            setType(event.target.value);
          }}
        >
          <option value="expense">Expense (-)</option>
          <option value="income">Income (+)</option>
        </select>

        <input
          type="date"
          className="item-date"
          value={date}
          onChange={function (event) {
            setDate(event.target.value);
          }}
          required
        />

        <input
          type="text"
          className="name"
          placeholder="Description (e.g. Salary, Groceries)"
          value={name}
          onChange={function (event) {
            setName(event.target.value);
          }}
          required
        />

        <select
          className="category"
          value={category}
          onChange={function (event) {
            setCategory(event.target.value);
          }}
        >
          {categoryOptions}
        </select>

        <input
          type="number"
          className="money"
          placeholder="Amount"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={function (event) {
            setAmount(event.target.value);
          }}
          required
        />

        <button type="submit" className="add-expense">
          {submitText}
        </button>
        {cancelButton}
      </form>

      <div className="controls-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search transactions..."
          value={search}
          onChange={function (event) {
            setSearch(event.target.value);
          }}
        />
      </div>

      <div className="filters">{filterButtons}</div>

      {emptyMessage}

      <div className="list-container">{entryRows}</div>
    </div>
  );
}

export default App;