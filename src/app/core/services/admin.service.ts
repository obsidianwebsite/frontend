import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  AdminOverview, 
  Deposit, 
  Withdrawal, 
  Loan, 
  Grant, 
  TaxRefund, 
  ExchangeRate, 
  UserInvestment 
} from '../models/bank.models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);

  // 1. Overview
  getOverview(): Observable<{ success: boolean; data: AdminOverview }> {
    return this.http.get<{ success: boolean; data: AdminOverview }>('/api/v1/admin/overview');
  }

  // 2. Deposit Approval Queue
  listDeposits(status?: string): Observable<{ success: boolean; data: Deposit[] }> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<{ success: boolean; data: Deposit[] }>('/api/v1/admin/deposits', { params });
  }

  approveDeposit(id: string, adminRemarks?: string): Observable<any> {
    return this.http.post(`/api/v1/admin/deposits/${id}/approve`, { adminRemarks });
  }

  rejectDeposit(id: string, adminRemarks?: string): Observable<any> {
    return this.http.post(`/api/v1/admin/deposits/${id}/reject`, { adminRemarks });
  }

  // 3. Withdrawal Clearance Queue
  listWithdrawals(status?: string): Observable<{ success: boolean; data: Withdrawal[] }> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<{ success: boolean; data: Withdrawal[] }>('/api/v1/admin/withdrawals', { params });
  }

  approveWithdrawal(id: string, adminRemarks?: string): Observable<any> {
    return this.http.post(`/api/v1/admin/withdrawals/${id}/approve`, { adminRemarks });
  }

  rejectWithdrawal(id: string, adminRemarks?: string): Observable<any> {
    return this.http.post(`/api/v1/admin/withdrawals/${id}/reject`, { adminRemarks });
  }

  // 4. Loan Review Center
  listLoans(status?: string, type?: string): Observable<{ success: boolean; data: Loan[] }> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (type) params = params.set('type', type);
    return this.http.get<{ success: boolean; data: Loan[] }>('/api/v1/admin/loans', { params });
  }

  approveLoan(id: string, adminRemarks?: string): Observable<any> {
    return this.http.post(`/api/v1/admin/loans/${id}/approve`, { adminRemarks });
  }

  rejectLoan(id: string, adminRemarks?: string): Observable<any> {
    return this.http.post(`/api/v1/admin/loans/${id}/reject`, { adminRemarks });
  }

  // 5. Grant Review Center
  listGrants(status?: string): Observable<{ success: boolean; data: Grant[] }> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<{ success: boolean; data: Grant[] }>('/api/v1/admin/grants', { params });
  }

  reviewGrant(id: string, action: 'APPROVE' | 'REJECT' | 'DISBURSE', adminRemarks?: string): Observable<any> {
    return this.http.post(`/api/v1/admin/grants/${id}/review`, { action, adminRemarks });
  }

  // 6. Tax Refund Management Center
  listTaxClaims(stage?: string): Observable<{ success: boolean; data: TaxRefund[] }> {
    let params = new HttpParams();
    if (stage) params = params.set('stage', stage);
    return this.http.get<{ success: boolean; data: TaxRefund[] }>('/api/v1/admin/tax-refunds', { params });
  }

  updateTaxStage(id: string, stage: string, notes?: string): Observable<any> {
    return this.http.patch(`/api/v1/admin/tax-refunds/${id}/stage`, { stage, notes });
  }

  // 7. Investments Desk
  listAllInvestments(): Observable<{ success: boolean; data: UserInvestment[] }> {
    return this.http.get<{ success: boolean; data: UserInvestment[] }>('/api/v1/admin/investments');
  }

  publishSignal(payload: {
    instrument: string;
    type?: string;
    direction: 'BUY' | 'SELL';
    entryPrice: number;
    stopLoss: number;
    takeProfit: number;
    timeframe?: string;
  }): Observable<any> {
    return this.http.post('/api/v1/admin/trading/signals', payload);
  }

  deleteSignal(id: string): Observable<any> {
    return this.http.delete(`/api/v1/admin/trading/signals/${id}`);
  }

  // 8. User & Account Management
  listUsers(): Observable<{ success: boolean; data: any[] }> {
    return this.http.get<{ success: boolean; data: any[] }>('/api/v1/admin/users');
  }

  toggleUserStatus(id: string, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'): Observable<any> {
    return this.http.patch(`/api/v1/admin/users/${id}/status`, { status });
  }

  updateUserKyc(id: string, kycStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED'): Observable<any> {
    return this.http.patch(`/api/v1/admin/users/${id}/kyc`, { kycStatus });
  }

  updateClearanceCodes(userId: string, payload: { 
    cotCode?: string; 
    taxCode?: string; 
    imfCode?: string;
    cotRequired?: boolean;
    taxRequired?: boolean;
    imfRequired?: boolean;
  }): Observable<any> {
    return this.http.patch(`/api/v1/admin/users/${userId}/clearance-codes`, payload);
  }

  adjustBalance(userId: string, payload: {
    accountId: string;
    type: 'CREDIT' | 'DEBIT';
    amount: number | string;
    narration?: string;
    balanceType?: 'MAIN' | 'SAVINGS' | 'BONUS' | 'EARNINGS';
  }): Observable<any> {
    return this.http.post(`/api/v1/admin/users/${userId}/balance`, payload);
  }

  resetUserPin(userId: string, newPin: string): Observable<any> {
    return this.http.post(`/api/v1/admin/users/${userId}/reset-pin`, { newPin });
  }

  // 9. Admin Impersonation
  impersonateUser(userId: string): Observable<any> {
    return this.http.post(`/api/v1/admin/impersonate/${userId}`, {});
  }

  // 10. Exchange Rate Manager
  listExchangeRates(): Observable<{ success: boolean; data: ExchangeRate[] }> {
    return this.http.get<{ success: boolean; data: ExchangeRate[] }>('/api/v1/admin/rates');
  }

  updateExchangeRate(fromCurrency: string, toCurrency: string, rate: number): Observable<any> {
    return this.http.put('/api/v1/admin/rates', { fromCurrency, toCurrency, rate });
  }

  // 11. Send Customizable Email to User
  sendCustomEmail(payload: {
    recipientEmail: string;
    customerName?: string;
    subject: string;
    headline?: string;
    bodyText: string;
    callToActionLabel?: string;
    callToActionUrl?: string;
    senderOfficerName?: string;
    priority?: string;
    badgeText?: string;
  }): Observable<any> {
    return this.http.post('/api/v1/admin/email/send-custom', payload);
  }

  // 12. Transaction History Generator & Custom Historical Entry
  generateTransactionHistory(userId: string, payload: {
    startDate?: string;
    endDate?: string;
    count?: number;
    minAmount?: number;
    maxAmount?: number;
    distribution?: string;
    updateBalance?: boolean;
    customTransactions?: any[];
  }): Observable<any> {
    return this.http.post(`/api/v1/admin/users/${userId}/generate-history`, payload);
  }

  insertCustomTransaction(userId: string, payload: {
    type: 'CREDIT' | 'DEBIT';
    amount: number;
    channel?: string;
    counterpartyName?: string;
    counterpartyBank?: string;
    counterpartyAccount?: string;
    narration?: string;
    referenceNumber?: string;
    status?: string;
    postDate?: string;
    updateBalance?: boolean;
  }): Observable<any> {
    return this.http.post(`/api/v1/admin/users/${userId}/custom-transaction`, payload);
  }

  getUserTransactions(userId: string): Observable<{ success: boolean; data: any[] }> {
    return this.http.get<{ success: boolean; data: any[] }>(`/api/v1/admin/users/${userId}/transactions`);
  }

  deleteTransaction(transactionId: string, reverseBalance: boolean = false): Observable<any> {
    return this.http.delete(`/api/v1/admin/transactions/${transactionId}`, { body: { reverseBalance } });
  }
}
