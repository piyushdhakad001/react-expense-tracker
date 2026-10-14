import { money } from "../utils";

function ExpenseItem({ entry, isEditing, onEdit, onDelete }) {
  let rowClass = "expense-div " + entry.type;
  if (isEditing) {
    rowClass = rowClass + " editing";
  }

  let sign = "-";
  if (entry.type === "income") {
    sign = "+";
  }

  return (
    <div className={rowClass}>
      <button
        className="delete-expense"
        title="Delete"
        onClick={function () {
          onDelete(entry.id);
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
          onEdit(entry);
        }}
      >
        Edit
      </button>
    </div>
  );
}

export default ExpenseItem;