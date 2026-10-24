import { money } from "../utils";

function SummaryCards({ totalIncome, totalExpense, netBalance }) {
  // the balance turns red when it is below zero
  let balanceClass = "summary-balance positive";
  if (netBalance < 0) {
    balanceClass = "summary-balance negative";
  }

  return (
    <section className="summary" aria-label="Summary">
      <div>
        <p className="summary-label">Net balance</p>
        <p className={balanceClass}>{money(netBalance)}</p>
      </div>

      <dl className="summary-lines">
        <div className="summary-line">
          <dt>Income</dt>
          <dd className="income">{money(totalIncome)}</dd>
        </div>
        <div className="summary-line">
          <dt>Expenses</dt>
          <dd className="expense">{money(totalExpense)}</dd>
        </div>
      </dl>
    </section>
  );
}

export default SummaryCards;
