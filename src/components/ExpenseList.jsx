import ExpenseItem from "./ExpenseItem";

function ExpenseList({ list, editId, onEdit, onDelete }) {
  // one row for every entry
  const entryRows = [];
  for (let i = 0; i < list.length; i++) {
    const entry = list[i];

    entryRows.push(
      <ExpenseItem
        key={entry.id}
        entry={entry}
        isEditing={entry.id === editId}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }

  // message when there is nothing to show
  let emptyMessage = null;
  if (list.length === 0) {
    emptyMessage = <p className="empty">No transactions found.</p>;
  }

  return (
    <>
      {emptyMessage}
      <div className="list-container">{entryRows}</div>
    </>
  );
}

export default ExpenseList;