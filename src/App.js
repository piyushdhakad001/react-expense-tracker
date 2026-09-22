import { useState } from "react";
import "./App.css";

function App() {
  const [date, setDate] = useState("2026-09-21");
  const [itemName, setItemName] = useState("");
  const [money, setMoney] = useState("");
  const [expenses, setExpenses] = useState([]);

  const handleClick = () => {
    const newExpense = {
      id: Date.now(),
      date: date,
      itemName: itemName,
      money: Number(money),
    };

    setExpenses([...expenses, newExpense]);

    setItemName("");
    setMoney("");
  };

  return (
    <div className="container">
      <p className="header">
        EXPENSE LIST
      </p>

      <div className="new-expense-div">
        <input
          type="date"
          className="item-date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="text"
          className="name"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />

        <input
          type="number"
          className="money"
          value={money}
          onChange={(e) => setMoney(e.target.value)}
        />

        <button
          className="add-expense"
          onClick={handleClick}
        >
          Add
        </button>
      </div>

      {expenses.map((expense) => (
        <div
          className="expense-div"
          key={expense.id}
        >
          <button className="delete-expense">
            X
          </button>

          <p className="expense-date">
            [{expense.date}]
          </p>

          <p className="expense-name">
            {expense.itemName}
          </p>

          <p className="expense-money">
            ${expense.money}
          </p>
        </div>
      ))}

      <div className="total-expense-div">
        <p className="text">
          Total Expenses
        </p>

        <p className="total-dollars">
          $0.00
        </p>
      </div>
    </div>
  );
}

export default App;