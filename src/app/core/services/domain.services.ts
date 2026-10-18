import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Beneficiary, Card, Loan, LoanCalculation } from '../models/bank.models';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {
  private http = inject(HttpClient);

  listBeneficiaries(): Observable<{ success: boolean; data: Beneficiary[] }> {
    return this.http.get<{ success: boolean; data: Beneficiary[] }>('/api/v1/beneficiaries');
  }

  addBeneficiary(payload: { name: string; bankName: string; accountNumber: string; swiftRouting?: string; bankAddress?: string }): Observable<any> {
    return this.http.post('/api/v1/beneficiaries', payload);
  }

  deleteBeneficiary(id: string): Observable<any> {
    return this.http.delete(`/api/v1/beneficiaries/${id}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private http = inject(HttpClient);

  listCards(): Observable<{ success: boolean; data: Card[] }> {
    return this.http.get<{ success: boolean; data: Card[] }>('/api/v1/cards');
  }

  toggleCardStatus(id: string, status: 'ACTIVE' | 'FROZEN'): Observable<any> {
    return this.http.patch(`/api/v1/cards/${id}/status`, { status });
  }

  requestCard(payload: {
    cardType?: 'DEBIT' | 'CREDIT' | 'VIRTUAL';
    brand?: 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER';
    tier?: 'STANDARD' | 'GOLD' | 'PLATINUM' | 'VAULT_BLACK' | 'OBSIDIAN_BLACK';
    spendingLimit?: number;
  }): Observable<any> {
    return this.http.post('/api/v1/cards/request', payload);
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private http = inject(HttpClient);

  listLoans(): Observable<{ success: boolean; data: Loan[] }> {
    return this.http.get<{ success: boolean; data: Loan[] }>('/api/v1/loans');
  }

  calculateLoan(amount: number, termYears: number, apr: number): Observable<{ success: boolean; data: LoanCalculation }> {
    return this.http.post<{ success: boolean; data: LoanCalculation }>('/api/v1/loans/calculate', { amount, termYears, apr });
  }
}

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  private http = inject(HttpClient);

  submitContact(payload: { name: string; email: string; phone?: string; subject: string; message: string }): Observable<any> {
    return this.http.post('/api/v1/support/contact', payload);
  }
}
