# Expense Tracker (React)

A simple expense tracker built with React. Add expenses with a date, name, category and amount, edit or delete them, filter by category, and see totals update instantly. Data is saved in the browser, so it is still there after a refresh.

This is the React version of my vanilla JavaScript expense list, extended with categories and editing.

**Live demo:** [https://react-expense-tracker-silk-eight.vercel.app/](https://react-expense-tracker-silk-eight.vercel.app/)

## Screenshots

![Expense Tracker - all expenses](screenshot.png)

![Expense Tracker - filtered by category](screenshot-filter.png)

## Features

- Add an expense with a date, item name, category and amount
- Edit any expense (it loads back into the form, with Update and Cancel buttons)
- Delete any expense from the list
- Filter by category, with each filter chip showing its own total
- Bottom total follows the selected filter
- Expenses are sorted by date, newest first
- Amounts are formatted as currency using `Intl.NumberFormat`
- Data is saved in `localStorage` and reloaded when the page opens
- Input validation: an empty name or an amount of zero or less is not accepted
- Responsive layout for desktop and mobile

## Built With

- **React** (functional components and hooks)
- **JavaScript (ES6+)**
- **CSS3** (flexbox, media queries)
- **Web Storage API** (`localStorage`)

## Getting Started

1. Clone the repository:
```
   git clone https://github.com/piyushdhakad001/react-expense-tracker.git
```
2. Go into the folder:
```
   cd react-expense-tracker
```
3. Install dependencies:
```
   npm install
```
4. Start the development server:
```
   npm run dev
```
5. Open the address shown in the terminal (usually `http://localhost:5173`).

## How It Works

- **`useState`** holds the `expenses` array, the `form` object, the `editingId` (null when adding) and the active `filter`. Each expense looks like this:
```js
  { id: 1760000000000, date: "2026-10-09", itemName: "Groceries", money: 42.5, category: "Food" }
```
- **Loading:** `useState(loadExpenses)` reads `localStorage` once on the first render, inside a `try/catch` so bad data can't crash the app. Older expenses saved without a category become "Other".
- **Saving:** a `useEffect` writes the array back to `localStorage` whenever `expenses` changes.
- **One form for add and edit:** `handleSubmit` checks `editingId`. If it is set, `map()` replaces that one expense. Otherwise a new expense with `Date.now()` as its `id` is added to the front of the list.
- **Editing:** `handleEdit` copies the expense into the form and stores its `id`. Cancel resets both.
- **Deleting:** `filter()` keeps every expense except the one with that `id`.
- **Filtering and totals:** `byCategory()` returns the expenses for a category, and `reduce()` adds up the amounts. The chips and the bottom total both use these.
- **Sorting:** a copy of the array (`[...]`) is sorted by date, so the original state is never changed.

## What I Learned

- Using controlled inputs and one `handleChange` for a whole form object
- Reusing one form for both add and edit with an `editingId` state
- Loading `localStorage` safely with lazy state initialization
- Updating arrays without changing the original (spread, `map`, `filter`, `sort` on a copy)
- Deriving values (filtered list, totals) from state instead of storing them
- Rebuilding a vanilla JavaScript project in React

## Known Limitations

- The currency is fixed to USD
- Data is stored only in the current browser, so it is not shared between devices
- Deleting an expense happens immediately, with no confirmation or undo

## Future Improvements

- [ ] Filter by month or date range
- [ ] Add a monthly summary or chart
- [ ] Choose the currency
- [ ] Export expenses to CSV
- [ ] Confirm before deleting