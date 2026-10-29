import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  DashboardSummary, 
  Deposit, 
  Withdrawal, 
  Loan, 
  Grant, 
  TaxRefund, 
  InvestmentPlan, 
  UserInvestment, 
  TradingSignal, 
  CopyMaster, 
  CopySubscription, 
  AcademyCourse, 
  Wallet, 
  ExchangeRate 
} from '../models/bank.models';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);

  getSummary(): Observable<{ success: boolean; data: DashboardSummary }> {
    return this.http.get<{ success: boolean; data: DashboardSummary }>('/api/v1/accounts/summary');
  }

  getStatement(params?: { from?: string; to?: string; type?: string; channel?: string; search?: string; limit?: number; offset?: number }): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          httpParams = httpParams.set(key, val.toString());
        }
      });
    }
    return this.http.get('/api/v1/accounts/statement', { params: httpParams });
  }

  // Official PDF Statement Export
  downloadStatementPdf(): Observable<Blob> {
    return this.http.get('/api/v1/accounts/statement/pdf', { responseType: 'blob' });
  }

  // Deposit Simulator (Customer -> Admin Queue)
  createDeposit(payload: {
    amount: number | string;
    method: 'BANK_TRANSFER' | 'CHECK_DEPOSIT' | 'WIRE_DEPOSIT';
    payerName?: string;
    payerBank?: string;
    checkNumber?: string;
    proofNote?: string;
  }): Observable<any> {
    return this.http.post('/api/v1/deposits', payload);
  }

  listUserDeposits(): Observable<{ success: boolean; data: Deposit[] }> {
    return this.http.get<{ success: boolean; data: Deposit[] }>('/api/v1/deposits');
  }

  // Withdrawal Module
  createWithdrawal(payload: {
    amount: number | string;
    method: 'BANK_WIRE' | 'ACH_TRANSFER' | 'SWIFT_WIRE';
    destinationDetails: string;
  }): Observable<any> {
    return this.http.post('/api/v1/withdrawals', payload);
  }

  listUserWithdrawals(): Observable<{ success: boolean; data: Withdrawal[] }> {
    return this.http.get<{ success: boolean; data: Withdrawal[] }>('/api/v1/withdrawals');
  }

  // Loans & Credit Facilities (Car Loans, Mortgages, Personal)
  listLoans(): Observable<{ success: boolean; data: Loan[] }> {
    return this.http.get<{ success: boolean; data: Loan[] }>('/api/v1/loans');
  }

  applyLoan(payload: {
    loanType: 'CAR_LOAN' | 'MORTGAGE' | 'PERSONAL';
    principalAmount: number | string;
    termMonths: number;
    monthlyIncome?: number | string;
    assetDetails?: any;
  }): Observable<any> {
    return this.http.post('/api/v1/loans/apply', payload);
  }

  // Grant Applications
  applyGrant(payload: {
    programmeName: string;
    category?: string;
    amountRequested: number | string;
    businessPurpose: string;
  }): Observable<any> {
    return this.http.post('/api/v1/grants', payload);
  }

  listUserGrants(): Observable<{ success: boolean; data: Grant[] }> {
    return this.http.get<{ success: boolean; data: Grant[] }>('/api/v1/grants');
  }

  // Tax Refund Claim & Tracker
  claimTaxRefund(payload: {
    taxYear: string;
    ssnTinMasked?: string;
    expectedAmount: number | string;
    filingStatus?: 'SINGLE' | 'MARRIED_JOINT' | 'HEAD_OF_HOUSEHOLD';
    notes?: string;
  }): Observable<any> {
    return this.http.post('/api/v1/tax-refunds', payload);
  }

  listUserTaxRefunds(): Observable<{ success: boolean; data: TaxRefund[] }> {
    return this.http.get<{ success: boolean; data: TaxRefund[] }>('/api/v1/tax-refunds');
  }

  // Institutional Investment Plans
  listInvestmentPlans(): Observable<{ success: boolean; data: InvestmentPlan[] }> {
    return this.http.get<{ success: boolean; data: InvestmentPlan[] }>('/api/v1/investments/plans');
  }

  subscribeInvestmentPlan(planId: string, amount: number | string): Observable<any> {
    return this.http.post('/api/v1/investments/subscribe', { planId, amount });
  }

  listUserInvestments(): Observable<{ success: boolean; data: UserInvestment[] }> {
    return this.http.get<{ success: boolean; data: UserInvestment[] }>('/api/v1/investments/my');
  }

  // MT4 Copy Trading & Signals
  listTradingSignals(): Observable<{ success: boolean; data: TradingSignal[] }> {
    return this.http.get<{ success: boolean; data: TradingSignal[] }>('/api/v1/trading/signals');
  }

  listCopyMasters(): Observable<{ success: boolean; data: CopyMaster[] }> {
    return this.http.get<{ success: boolean; data: CopyMaster[] }>('/api/v1/trading/masters');
  }

  subscribeCopyMaster(masterId: string, allocatedAmount: number | string): Observable<any> {
    return this.http.post('/api/v1/trading/copy', { masterId, allocatedAmount });
  }

  listUserCopySubscriptions(): Observable<{ success: boolean; data: CopySubscription[] }> {
    return this.http.get<{ success: boolean; data: CopySubscription[] }>('/api/v1/trading/my-subscriptions');
  }

  // Academy Courses
  listAcademyCourses(category?: string): Observable<{ success: boolean; data: AcademyCourse[] }> {
    let params = new HttpParams();
    if (category) params = params.set('category', category);
    return this.http.get<{ success: boolean; data: AcademyCourse[] }>('/api/v1/academy/courses', { params });
  }

  // Multi-Currency Wallets (USD, EUR, GBP, NGN)
  listWallets(): Observable<{ success: boolean; data: { wallets: Wallet[]; exchangeRates: ExchangeRate[] } }> {
    return this.http.get<{ success: boolean; data: { wallets: Wallet[]; exchangeRates: ExchangeRate[] } }>('/api/v1/wallets');
  }

  convertCurrency(payload: { fromCurrency: string; toCurrency: string; amount: number | string }): Observable<any> {
    return this.http.post('/api/v1/wallets/convert', payload);
  }

  // Funds Transfer (Standard & Internal Peer-to-Peer)
  createTransfer(payload: {
    rname: string;
    rbank: string;
    iban?: string;
    accno: string;
    swift?: string;
    type: 'DT' | 'LT' | 'IT';
    amt: string | number;
    comment?: string;
    saveBeneficiary?: boolean;
    cotCode?: string;
    taxCode?: string;
    imfCode?: string;
  }): Observable<any> {
    return this.http.post('/api/v1/transfers', payload);
  }

  createInternalTransfer(payload: {
    recipientIdentifier: string;
    amount: string | number;
    narration?: string;
  }): Observable<any> {
    return this.http.post('/api/v1/transfers/internal', payload);
  }

  changePassword(payload: { oldPassword: string; newPassword: string; confirmPassword: string }): Observable<any> {
    return this.http.post('/api/v1/settings/change-password', payload);
  }

  changePin(payload: { oldPin: string; newPin: string; confirmPin: string }): Observable<any> {
    return this.http.post('/api/v1/settings/change-pin', payload);
  }
}
