import { categories } from "../utils";

function EntryForm({
  type, setType,
  date, setDate,
  name, setName,
  category, setCategory,
  amount, setAmount,
  editId,
  onSubmit,
  onCancel,
}) {
  // options of the category dropdown
  const categoryOptions = [];
  for (let i = 0; i < categories.length; i++) {
    categoryOptions.push(<option key={categories[i]}>{categories[i]}</option>);
  }

  // button text changes while editing, and a Cancel button appears
  let submitText = "Add Entry";
  let cancelButton = null;
  if (editId !== null) {
    submitText = "Update";
    cancelButton = (
      <button type="button" className="secondary" onClick={onCancel}>
        Cancel
      </button>
    );
  }

  return (
    <form className="new-expense-div" onSubmit={onSubmit}>
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
  );
}

export default EntryForm;