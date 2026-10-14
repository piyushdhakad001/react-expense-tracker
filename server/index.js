const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "expenses.json";

// ----- read and save the list (a simple JSON file) -----
function readExpenses() {
  if (!fs.existsSync(FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function saveExpenses(list) {
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2));
}

// ----- 1. Get all entries -----
app.get("/api/expenses", function (req, res) {
  res.json(readExpenses());
});

// ----- 2. Add an entry -----
app.post("/api/expenses", function (req, res) {
  const list = readExpenses();

  const entry = {
    id: Date.now(),
    type: req.body.type,
    date: req.body.date,
    itemName: req.body.itemName,
    category: req.body.category,
    money: Number(req.body.money),
  };

  list.unshift(entry); // new entry goes first
  saveExpenses(list);
  res.json(entry);
});

// ----- 3. Edit an entry -----
app.put("/api/expenses/:id", function (req, res) {
  const id = Number(req.params.id);
  const list = readExpenses();

  const updated = {
    id: id,
    type: req.body.type,
    date: req.body.date,
    itemName: req.body.itemName,
    category: req.body.category,
    money: Number(req.body.money),
  };

  const newList = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      newList.push(updated);
    } else {
      newList.push(list[i]);
    }
  }

  saveExpenses(newList);
  res.json(updated);
});

// ----- 4. Delete an entry -----
app.delete("/api/expenses/:id", function (req, res) {
  const id = Number(req.params.id);
  const list = readExpenses();

  const newList = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].id !== id) {
      newList.push(list[i]);
    }
  }

  saveExpenses(newList);
  res.json({ success: true });
});

app.listen(5000, function () {
  console.log("Server running on port 5000");
});