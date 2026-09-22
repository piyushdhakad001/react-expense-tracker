import "./App.css";

function App() {
  return (
    <div className="container">
      <p className="header">
        EXPENSE LIST
      </p>

      <div className="new-expense-div">
        <input
          type="date"
          className="item-date"
        />

        <input
          type="text"
          className="name"
          placeholder="Item Name"
        />

        <input
          type="number"
          className="money"
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