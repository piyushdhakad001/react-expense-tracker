export const categories = ["Food", "Transport", "Shopping", "Bills", "Salary", "Other"];

// Returns today's date like "2026-10-10"
export function today() {
  return new Date().toLocaleDateString("en-CA");
}

// Turns 25.5 into "$25.50"
export function money(number) {
  const text = Math.abs(number).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (number < 0) {
    return "-$" + text;
  }
  return "$" + text;
}

// Adds up the money of all entries of one type ("income" or "expense")
export function getTotal(list, type) {
  let total = 0;
  for (let i = 0; i < list.length; i++) {
    if (list[i].type === type) {
      total = total + list[i].money;
    }
  }
  return total;
}

// Downloads the list as a CSV file
export function exportCSV(list) {
  if (list.length === 0) {
    alert("No data to export!");
    return;
  }

  // first the header line, then one line per entry
  let csv = "ID,Date,Name,Category,Type,Amount\n";
  for (let i = 0; i < list.length; i++) {
    const entry = list[i];
    // a quote inside a name must be written as two quotes in a CSV file
    const safeName = entry.itemName.split('"').join('""');
    csv = csv + entry.id + "," + entry.date + ',"' + safeName + '",';
    csv = csv + entry.category + "," + entry.type + "," + entry.money + "\n";
  }

  // make a temporary download link and click it
  const file = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "expenses.csv";
  link.click();
  URL.revokeObjectURL(url);
}