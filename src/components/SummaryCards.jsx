import { money } from "../utils";

function SummaryCards({ totalIncome, totalExpense, netBalance }) {
  // green-blue when balance is zero or more, yellow when it is below zero
  let balanceClass = "summary-card balance positive";
  if (netBalance < 0) {
    balanceClass = "summary-card balance negative";
  }

  return (
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
  );
}

export default SummaryCards;