// src/types/bankingtypes.ts

// Raw row exactly as in the CSV header you provided
export interface RawTransaction {
  "Customer ID": string;
  "First Name": string;
  "Last Name": string;
  "Age": string;
  "Gender": string;
  "Address": string;
  "City": string;
  "Contact Number": string;
  "Email": string;
  "Account Type": string;
  "Account Balance": string;
  "Date Of Account Opening": string;
  "Last Transaction Date": string;
  "TransactionID": string;
  "Transaction Date": string;
  "Transaction Type": string;
  "Transaction Amount": string;
  "Account Balance After Transaction": string;
  "Branch ID": string;
  "Loan ID": string;
  "Loan Amount": string;
  "Loan Type": string;
  "Interest Rate": string;
  "Loan Term": string;
  "Approval/Rejection Date": string;
  "Loan Status": string;
  "CardID": string;
  "Card Type": string;
  "Credit Limit": string;
  "Credit Card Balance": string;
  "Minimum Payment Due": string;
  "Payment Due Date": string;
  "Last Credit Card Payment Date": string;
  "Rewards Points": string;
  "Feedback ID": string;
  "Feedback Date": string;
  "Feedback Type": string;
  "Resolution Status": string;
  "Resolution Date": string;
  "Anomaly": string;
}

// Cleaned + typed record for analytics
export interface CleanedTransaction {
  customerId: number;
  firstName: string | null;
  lastName: string | null;
  customerAge: number;
  customerGender: "Male" | "Female" | "Other";
  city: string | null;
  email: string | null;
  accountType: string | null;
  accountBalance: number;
  accountOpeningDate: Date;
  transactionId: string | null;
  transactionDate: Date;
  transactionType: "deposit" | "withdrawal" | "transfer" | "payment" | "other";
  transactionAmount: number;
  accountBalanceAfter: number;
  branchId: string | null;
  loanId?: string | null;
  loanAmount?: number | null;
  loanStatus?: string | null;
  cardId?: string | null;
  cardType?: string | null;
  creditLimit?: number | null;
  creditCardBalance?: number | null;
  minimumPaymentDue?: number | null;
  paymentDueDate?: Date | null;
  rewardsPoints?: number | null;
  feedbackId?: string | null;
  feedbackType?: string | null;
  resolutionStatus?: string | null;
  anomaly?: string | null;
  transactionMonth: string; // "YYYY-MM"
  accountAgeInMonths: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ProcessingStats {
  totalRecords: number
  validRecords: number
  invalidRecords: number
  duplicateRecords: number
  processingTime: number
  validationErrors: Record<string, number>
  reconciliationIssues: { customerId: number; txIndex: number; expected: number; actual: number }[]
}



