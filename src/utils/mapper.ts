
// This file maps a generic CSV row/object into a RawTransaction type.
// It makes sure every field is a string (never undefined), so later code doesn't break.

import type { RawTransaction } from "../types/bankingtypes";

// Converts a row (from CSV or any source) into a RawTransaction object
export function mapToRawTransaction(row: any): RawTransaction {
  // Helper: always return a string, never undefined/null
  const r = (k: string) => (row[k] !== undefined && row[k] !== null ? String(row[k]) : "");
  // Build the RawTransaction object, field by field
  return {
    "Customer ID": r("Customer ID"),
    "First Name": r("First Name"),
    "Last Name": r("Last Name"),
    "Age": r("Age"),
    "Gender": r("Gender"),
    "Address": r("Address"),
    "City": r("City"),
    "Contact Number": r("Contact Number"),
    "Email": r("Email"),
    "Account Type": r("Account Type"),
    "Account Balance": r("Account Balance"),
    "Date Of Account Opening": r("Date Of Account Opening"),
    "Last Transaction Date": r("Last Transaction Date"),
    "TransactionID": r("TransactionID"),
    "Transaction Date": r("Transaction Date"),
    "Transaction Type": r("Transaction Type"),
    "Transaction Amount": r("Transaction Amount"),
    "Account Balance After Transaction": r("Account Balance After Transaction"),
    "Branch ID": r("Branch ID"),
    "Loan ID": r("Loan ID"),
    "Loan Amount": r("Loan Amount"),
    "Loan Type": r("Loan Type"),
    "Interest Rate": r("Interest Rate"),
    "Loan Term": r("Loan Term"),
    "Approval/Rejection Date": r("Approval/Rejection Date"),
    "Loan Status": r("Loan Status"),
    "CardID": r("CardID"),
    "Card Type": r("Card Type"),
    "Credit Limit": r("Credit Limit"),
    "Credit Card Balance": r("Credit Card Balance"),
    "Minimum Payment Due": r("Minimum Payment Due"),
    "Payment Due Date": r("Payment Due Date"),
    "Last Credit Card Payment Date": r("Last Credit Card Payment Date"),
    "Rewards Points": r("Rewards Points"),
    "Feedback ID": r("Feedback ID"),
    "Feedback Date": r("Feedback Date"),
    "Feedback Type": r("Feedback Type"),
    "Resolution Status": r("Resolution Status"),
    "Resolution Date": r("Resolution Date"),
    "Anomaly": r("Anomaly"),
  } as RawTransaction;
}
