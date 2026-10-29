export interface User {
  id: string;
  role?: 'ADMIN' | 'CUSTOMER';
  impersonated?: boolean;
  adminId?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  dateOfBirth?: string;
  gender?: string;
  createdAt?: string;
  kycPhotoUrl?: string;
  kycStatus?: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  kycDocumentType?: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
  clientIp?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface Account {
  id: string;
  accountNumber: string;
  accountType: 'Savings Account' | 'Current Account' | 'Checking Account' | 'Fixed Deposit Account' | 'Off Shore Account';
  currency: 'USD' | 'GBP' | 'EUR' | 'CNY' | 'NGN' | string;
  availableBalance: string;
  ledgerBalance: string;
  savingsBalance?: string;
  bonusBalance?: string;
  investmentEarnings?: string;
  cotCode?: string;
  taxCode?: string;
  imfCode?: string;
  cotRequired?: boolean;
  taxRequired?: boolean;
  imfRequired?: boolean;
  kycStatus?: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  kycDocumentType?: string;
  percentageChange?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DORMANT' | 'FROZEN' | 'CLOSED';
}

export interface Transaction {
  id: string;
  reference: string;
  type: 'CREDIT' | 'DEBIT';
  channel: 'DOMESTIC_TRANSFER' | 'LOCAL_TRANSFER' | 'INTERNATIONAL_WIRE' | 'DEPOSIT' | 'LOAN_DISBURSEMENT' | 'FEE' | 'WALLET_EXCHANGE';
  amount: string;
  fee: string;
  currency: string;
  counterpartyName: string;
  counterpartyBank: string;
  counterpartyAccount: string;
  swift?: string;
  narration?: string;
  status: 'COMPLETED' | 'PENDING' | 'PENDING_APPROVAL' | 'FAILED' | 'REVERSED' | 'REJECTED';
  postDate: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  bank_name: string;
  account_number: string;
  swift_routing?: string;
  bank_address?: string;
  created_at?: string;
}

export interface Card {
  id: string;
  card_number_masked: string;
  card_holder_name: string;
  expiry_date: string;
  cvv?: string;
  card_type: 'DEBIT' | 'CREDIT' | 'VIRTUAL';
  tier?: 'STANDARD' | 'GOLD' | 'PLATINUM' | 'VAULT_BLACK' | 'OBSIDIAN_BLACK';
  brand: 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER';
  spending_limit?: string | number;
  status: 'ACTIVE' | 'INACTIVE' | 'FROZEN';
}

export interface AmortizationEntry {
  month: number;
  installment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface Loan {
  id: string;
  reference: string;
  title: string;
  loanType: 'PERSONAL' | 'CAR_LOAN' | 'MORTGAGE';
  principalAmount: string;
  interestRateApr: string;
  termMonths: number;
  monthlyInstallment: string;
  remainingBalance: string;
  monthlyIncome?: string;
  assetDetails?: any;
  amortizationSchedule?: AmortizationEntry[];
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'SETTLED' | 'DEFAULTED';
  disbursedAt?: string;
  nextDueDate?: string;
  adminRemarks?: string;
  createdAt?: string;
}

export interface Deposit {
  id: string;
  account_id: string;
  account_number?: string;
  amount: string | number;
  currency: string;
  method: 'BANK_TRANSFER' | 'CHECK_DEPOSIT' | 'WIRE_DEPOSIT';
  reference_number: string;
  payer_name?: string;
  payer_bank?: string;
  check_number?: string;
  proof_note?: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  admin_remarks?: string;
  created_at: string;
  reviewed_at?: string;
  user_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface Withdrawal {
  id: string;
  account_id: string;
  user_id: string;
  reference_number: string;
  amount: string | number;
  fee: string | number;
  currency: string;
  method: 'BANK_WIRE' | 'ACH_TRANSFER' | 'SWIFT_WIRE';
  destination_details: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  admin_remarks?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  account_number?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface Grant {
  id: string;
  user_id: string;
  account_id: string;
  reference_number: string;
  programme_name: string;
  category: string;
  amount_requested: string | number;
  business_purpose: string;
  status: 'PROCESSING' | 'APPROVED' | 'REJECTED' | 'DISBURSED';
  admin_remarks?: string;
  disbursed_at?: string;
  created_at: string;
  account_number?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface TaxRefund {
  id: string;
  user_id: string;
  account_id: string;
  filing_id: string;
  tax_year: string;
  ssn_tin_masked: string;
  expected_amount: string | number;
  filing_status: 'SINGLE' | 'MARRIED_JOINT' | 'HEAD_OF_HOUSEHOLD';
  refund_stage: 'RECEIVED' | 'UNDER_REVIEW' | 'APPROVED' | 'DISBURSED';
  notes?: string;
  disbursed_at?: string;
  created_at: string;
  account_number?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  category: string;
  min_amount: string | number;
  max_amount: string | number;
  duration_days: number;
  roi_percent: string | number;
  description: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'ACTIVE' | 'INACTIVE';
}

export interface UserInvestment {
  id: string;
  user_id: string;
  account_id: string;
  plan_id: string;
  plan_name?: string;
  amount_invested: string | number;
  expected_roi: string | number;
  duration_days: number;
  status: 'ACTIVE' | 'COMPLETED' | 'LIQUIDATED';
  start_date: string;
  end_date: string;
  category?: string;
  roi_percent?: string | number;
  first_name?: string;
  last_name?: string;
  account_number?: string;
  email?: string;
}

export interface TradingSignal {
  id: string;
  instrument: string;
  type: 'FOREX' | 'INDICES' | 'COMMODITY';
  direction: 'BUY' | 'SELL';
  entry_price: string | number;
  stop_loss: string | number;
  take_profit: string | number;
  timeframe: string;
  status: 'ACTIVE' | 'TARGET_HIT' | 'STOPPED_OUT' | 'CLOSED';
  created_at: string;
}

export interface CopyMaster {
  id: string;
  trader_name: string;
  strategy_name: string;
  win_rate: string | number;
  monthly_return: string | number;
  copiers_count: number;
  profit_share_percent: string | number;
  risk_score: number;
  avatar_url?: string;
}

export interface CopySubscription {
  id: string;
  user_id: string;
  master_id: string;
  allocated_amount: string | number;
  status: 'ACTIVE' | 'PAUSED' | 'STOPPED';
  trader_name?: string;
  strategy_name?: string;
  win_rate?: string | number;
  monthly_return?: string | number;
  profit_share_percent?: string | number;
  avatar_url?: string;
}

export interface AcademyCourse {
  id: string;
  title: string;
  category: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration_mins: number;
  modules_count: number;
  thumbnail_url?: string;
  description: string;
}

export interface Wallet {
  id: string;
  currency: 'USD' | 'EUR' | 'GBP' | 'NGN' | string;
  balance: string;
  updatedAt?: string;
}

export interface ExchangeRate {
  id?: number;
  from_currency: string;
  to_currency: string;
  rate: number | string;
  updated_at?: string;
}

export interface AdminOverview {
  totalCustomers: number;
  activeCustomers: number;
  totalVaultBalance: number | string;
  pendingDepositsCount: number;
  pendingDepositsAmount: number | string;
  pendingLoansCount: number;
  pendingLoansAmount: number | string;
  recentAudits: any[];
}

export interface DashboardSummary {
  user?: User;
  account: Account;
  audit: {
    lastLoginAt?: string;
    lastLoginIp?: string;
    currentIp?: string;
  };
  metrics: {
    totalInflow: string;
    totalOutflow: string;
    transactionCount: number;
    activeCards: number;
    activeLoans: number;
  };
  recentTransactions: Transaction[];
}

export interface Stage1Response {
  success: boolean;
  status: string;
  nextStep: 'PIN_VERIFICATION';
  preAuthToken: string;
  user: {
    role?: 'ADMIN' | 'CUSTOMER';
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface Stage2Response {
  success: boolean;
  status: string;
  message: string;
  token: string;
  user: User;
  account: Account;
}

export interface LoanCalculation {
  principal: string;
  termYears: number;
  termMonths: number;
  interestRateApr: string;
  monthlyPayment: string;
  totalInterest: string;
  totalRepayable: string;
  schedule?: AmortizationEntry[];
}
