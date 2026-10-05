# Expense Tracker (React)

A simple expense tracker built with React. Add expenses with a date, name and amount, delete them, and see the running total. Data is saved in the browser, so it is still there after a refresh.

This is the React version of my vanilla JavaScript expense list.

**Live demo:** [https://react-expense-tracker-silk-eight.vercel.app/]

## Screenshot

![Expense Tracker screenshot](screenshot.png)

*(Add a screenshot of the app and save it as `screenshot.png` in the project folder.)*

## Features

- Add an expense with a date, item name and amount
- Delete any expense from the list
- Total expenses update automatically and show 2 decimal places
- Data is saved in `localStorage` and reloaded when the page opens
- Input validation: an empty name or an amount of zero or less is not accepted

## Built With

- **React** (functional components and hooks)
- **JavaScript (ES6+)**
- **CSS3**
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

- **`useState`** holds the form inputs (`date`, `itemName`, `money`) and the `expenses` array. Each expense looks like this:
  ```js
  { id: 1758450000000, date: "2026-09-21", itemName: "Groceries", money: 25.5 }
  ```
- **`useEffect` (load):** runs once when the app starts and reads saved expenses from `localStorage`.
- **`useEffect` (save):** runs whenever `expenses` changes and writes the array back to `localStorage`.
- **`loaded` flag:** stops the save effect from running before the saved data has been read. Without it, the first render would overwrite saved expenses with an empty list.
- **Adding:** `handleClick` checks the inputs, creates a new object with `Date.now()` as its `id`, and adds it with the spread operator.
- **Deleting:** `handleClickDelete` uses `filter()` to keep every expense except the one with that `id`.
- **Total:** `reduce()` adds up all the amounts, and `toFixed(2)` formats the result.

## What I Learned

- Using controlled inputs to manage form state in React
- Using `useEffect` to load and save data
- Avoiding a bug where saved data gets overwritten on the first render
- Updating arrays without changing the original, using spread and `filter`
- Rebuilding a vanilla JavaScript project in React

## Known Limitations

- The currency symbol is fixed to `$`
- Individual amounts are shown as typed (for example `$25.5`), while only the total uses 2 decimal places
- Expenses can't be edited after they are added, only deleted
- Data is stored only in the current browser, so it is not shared between devices

## Future Improvements

- [ ] Edit existing expenses
- [ ] Add categories and filter by category or date
- [ ] Sort expenses by date
- [ ] Format every amount with 2 decimal places
- [ ] Add a monthly summary or chart
- [ ] Export expenses to CSV

