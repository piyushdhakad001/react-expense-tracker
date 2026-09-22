import { useState } from "react";
import "./App.css";

function App() {
  const [date, setDate] = useState("2026-09-21");
  const [itemName, setItemName] = useState("");
  const [money, setMoney] = useState("");

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

        <button className="add-expense">
          Add
        </button>
      </div>

      <div className="expense-div">
        <button className="delete-expense">
          X
        </button>

        <p className="expense-date">
          [2026-09-21]
        </p>

        <p className="expense-name">
          piyush
        </p>

        <p className="expense-money">
          $1
        </p>
      </div>

      <div className="total-expense-div">
        <p className="text">
          Total Expenses
        </p>

        <p className="total-dollars">
          $1.00
        </p>
      </div>
    </div>
  );
}

export default App;