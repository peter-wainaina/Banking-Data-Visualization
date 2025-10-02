
// This file is all about cleaning up raw banking transaction data and making it usable for analysis.
// We take messy CSV rows and turn them into beautiful, type-safe objects for our dashboard.

import type { RawTransaction, CleanedTransaction } from "../types/bankingtypes";
import {
  parseAmount, // turns currency strings into numbers
  parseDate, // parses dates in various formats
  parseCustomerId, // extracts numeric customer IDs
  parseCustomerAge, // gets a valid age
  normalizeGender, // standardizes gender values
  normalizeTransactionType, // standardizes transaction types
  formatDateForGrouping, // makes YYYY-MM strings for grouping
  getMonthsBetween, // calculates account age in months
} from "./parser";


// Cleans a single raw transaction row and returns a nice CleanedTransaction object
// Returns null if required fields are missing or invalid
export function cleanTransaction(raw: RawTransaction): CleanedTransaction | null {
  // --- Step 1: Parse all the critical fields we need ---
  const customerId = parseCustomerId(raw["Customer ID"]); // must be a valid number
  const customerAge = parseCustomerAge(raw["Age"]); // must be a valid age
  const transactionDate = parseDate(raw["Transaction Date"]) || parseDate(raw["Last Transaction Date"]); // fallback to last tx date
  const accountOpeningDate = parseDate(raw["Date Of Account Opening"]);

  // If any required field is missing, bail out
  if (!customerId || !customerAge || !transactionDate || !accountOpeningDate) return null;

  // --- Step 2: Parse all the other fields, with sensible defaults ---
  const transactionAmount = parseAmount(raw["Transaction Amount"]);
  const accountBalance = parseAmount(raw["Account Balance"]);
  const accountBalanceAfter = parseAmount(raw["Account Balance After Transaction"]);
  const txType = normalizeTransactionType(raw["Transaction Type"]);
  const gender = normalizeGender(raw["Gender"]);

  // --- Step 3: Build the cleaned transaction object ---
  const ct: CleanedTransaction = {
    customerId,
    firstName: raw["First Name"] || null,
    lastName: raw["Last Name"] || null,
    customerAge,
    customerGender: gender,
    city: raw["City"] || null,
    email: raw["Email"] || null,
    accountType: raw["Account Type"] || null,
    accountBalance,
    accountOpeningDate,
    transactionId: raw["TransactionID"] || null,
    transactionDate,
    transactionType: txType,
    transactionAmount,
    accountBalanceAfter,
    branchId: raw["Branch ID"] || null,
    loanId: raw["Loan ID"] || undefined,
    loanAmount: raw["Loan Amount"] ? parseAmount(raw["Loan Amount"]) : undefined,
    loanStatus: raw["Loan Status"] || undefined,
    cardId: raw["CardID"] || undefined,
    cardType: raw["Card Type"] || undefined,
    creditLimit: raw["Credit Limit"] ? parseAmount(raw["Credit Limit"]) : undefined,
    creditCardBalance: raw["Credit Card Balance"] ? parseAmount(raw["Credit Card Balance"]) : undefined,
    minimumPaymentDue: raw["Minimum Payment Due"] ? parseAmount(raw["Minimum Payment Due"]) : undefined,
    paymentDueDate: raw["Payment Due Date"] ? parseDate(raw["Payment Due Date"]) : undefined,
    rewardsPoints: raw["Rewards Points"] ? Number(raw["Rewards Points"]) : undefined,
    feedbackId: raw["Feedback ID"] || undefined,
    feedbackType: raw["Feedback Type"] || undefined,
    resolutionStatus: raw["Resolution Status"] || undefined,
    anomaly: raw["Anomaly"] || undefined,
    transactionMonth: formatDateForGrouping(transactionDate), // e.g. "2025-10"
    accountAgeInMonths: Math.max(0, getMonthsBetween(accountOpeningDate, transactionDate)), // how long account has existed
  };

  // --- Step 4: Basic sanity check ---
  // If transaction amounts are not numbers, we can't use this row
  if (Number.isNaN(ct.transactionAmount) || Number.isNaN(ct.accountBalanceAfter)) return null;

  // All good! Return the cleaned transaction
  return ct;
}
