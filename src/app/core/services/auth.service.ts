import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { User, Account, Stage1Response, Stage2Response } from '../models/bank.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly TOKEN_KEY = 'otb_session_token';
  private readonly ADMIN_BACKUP_KEY = 'otb_admin_saved_token';
  private readonly PREAUTH_KEY = 'otb_preauth_token';
  private readonly USER_KEY = 'otb_user_profile';
  private readonly ACCOUNT_KEY = 'otb_user_account';

  // Signals with immediate synchronous hydration from localStorage
  currentUser = signal<User | null>(this.getStoredUser());
  currentAccount = signal<Account | null>(this.getStoredAccount());
  preAuthData = signal<{ token: string; user: { role?: 'ADMIN' | 'CUSTOMER'; firstName: string; lastName: string; email: string } } | null>(null);

  isAuthenticated = computed(() => !!this.currentUser() && !!localStorage.getItem(this.TOKEN_KEY));
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
  isImpersonated = computed(() => !!this.currentUser()?.impersonated || !!localStorage.getItem(this.ADMIN_BACKUP_KEY));

  constructor() {
    this.restoreSession();
  }

  private getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(this.USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  normalizeAccount(raw: any): Account | null {
    if (!raw) return null;
    return {
      id: raw.id,
      accountNumber: raw.accountNumber || raw.account_number || '',
      accountType: raw.accountType || raw.account_type || 'Savings Account',
      currency: raw.currency || 'USD',
      availableBalance: (raw.availableBalance !== undefined && raw.availableBalance !== null ? raw.availableBalance : (raw.available_balance !== undefined && raw.available_balance !== null ? raw.available_balance : '0.00')).toString(),
      ledgerBalance: (raw.ledgerBalance !== undefined && raw.ledgerBalance !== null ? raw.ledgerBalance : (raw.ledger_balance !== undefined && raw.ledger_balance !== null ? raw.ledger_balance : '0.00')).toString(),
      savingsBalance: (raw.savingsBalance !== undefined && raw.savingsBalance !== null ? raw.savingsBalance : (raw.savings_balance !== undefined && raw.savings_balance !== null ? raw.savings_balance : '0.00')).toString(),
      bonusBalance: (raw.bonusBalance !== undefined && raw.bonusBalance !== null ? raw.bonusBalance : (raw.bonus_balance !== undefined && raw.bonus_balance !== null ? raw.bonus_balance : '0.00')).toString(),
      investmentEarnings: (raw.investmentEarnings !== undefined && raw.investmentEarnings !== null ? raw.investmentEarnings : (raw.investment_earnings !== undefined && raw.investment_earnings !== null ? raw.investment_earnings : '0.00')).toString(),
      cotCode: raw.cotCode || raw.cot_code,
      taxCode: raw.taxCode || raw.tax_code,
      imfCode: raw.imfCode || raw.imf_code,
      cotRequired: raw.cotRequired !== undefined ? raw.cotRequired : !!raw.cot_required,
      taxRequired: raw.taxRequired !== undefined ? raw.taxRequired : !!raw.tax_required,
      imfRequired: raw.imfRequired !== undefined ? raw.imfRequired : !!raw.imf_required,
      status: raw.status || 'ACTIVE'
    };
  }

  private getStoredAccount(): Account | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(this.ACCOUNT_KEY);
      return data ? this.normalizeAccount(JSON.parse(data)) : null;
    } catch {
      return null;
    }
  }

  private saveStoredUser(user: User | null): void {
    if (typeof window === 'undefined') return;
    try {
      if (user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.USER_KEY);
      }
    } catch (e) {
      console.warn('Failed to persist user profile', e);
    }
  }

  private saveStoredAccount(account: Account | null): void {
    if (typeof window === 'undefined') return;
    try {
      if (account) {
        localStorage.setItem(this.ACCOUNT_KEY, JSON.stringify(account));
      } else {
        localStorage.removeItem(this.ACCOUNT_KEY);
      }
    } catch (e) {
      console.warn('Failed to persist account data', e);
    }
  }

  private restoreSession(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      // Revalidate in background to fetch fresh balances, KYC status, etc.
      this.loadProfile().subscribe({
        error: (err) => {
          // ONLY clear session if the server explicitly rejected the token as 401 Unauthorized / Token Expired
          if (err?.status === 401) {
            const wasAdmin = this.isAdmin();
            this.clearSession();
            if (wasAdmin) {
              this.router.navigate(['/admin/login']);
            } else {
              this.router.navigate(['/login']);
            }
          }
          // If status is 0 (offline/network error), 500, 502, 503, 504 (cold start / gateway timeout),
          // do NOT clear session! The user stays logged in with their cached profile.
        }
      });
    }

    const savedPreAuth = sessionStorage.getItem(this.PREAUTH_KEY);
    if (savedPreAuth) {
      try {
        this.preAuthData.set(JSON.parse(savedPreAuth));
      } catch {
        sessionStorage.removeItem(this.PREAUTH_KEY);
      }
    }
  }

  // Stage 1: Email & Password verification
  loginStage1(email: string, password: string): Observable<Stage1Response> {
    return this.http.post<Stage1Response>('/api/v1/auth/login-stage1', { email, password }).pipe(
      tap((res) => {
        if (res.status === 'SUCCESS' && res.preAuthToken) {
          const preData = {
            token: res.preAuthToken,
            user: res.user
          };
          this.preAuthData.set(preData);
          sessionStorage.setItem(this.PREAUTH_KEY, JSON.stringify(preData));
        }
      })
    );
  }

  // Stage 2: PIN verification
  verifyPinStage2(pin: string): Observable<Stage2Response> {
    const preAuthToken = this.preAuthData()?.token || sessionStorage.getItem(this.PREAUTH_KEY);
    return this.http.post<Stage2Response>('/api/v1/auth/verify-pin-stage2', { pin, preAuthToken }).pipe(
      tap((res) => {
        if (res.status === 'SUCCESS' && res.token) {
          localStorage.setItem(this.TOKEN_KEY, res.token);
          sessionStorage.removeItem(this.PREAUTH_KEY);
          this.preAuthData.set(null);
          this.currentUser.set(res.user);
          const normalizedAccount = this.normalizeAccount(res.account);
          this.currentAccount.set(normalizedAccount);
          this.saveStoredUser(res.user);
          this.saveStoredAccount(normalizedAccount);
        }
      })
    );
  }

  // Admin Impersonation: jump directly into customer account
  impersonate(customerToken: string, customerUser: User, customerAccount: Account): void {
    const currentAdminToken = this.getToken();
    if (currentAdminToken) {
      localStorage.setItem(this.ADMIN_BACKUP_KEY, currentAdminToken);
    }
    localStorage.setItem(this.TOKEN_KEY, customerToken);
    this.currentUser.set(customerUser);
    const normalizedAccount = this.normalizeAccount(customerAccount);
    this.currentAccount.set(normalizedAccount);
    this.saveStoredUser(customerUser);
    this.saveStoredAccount(normalizedAccount);
    this.router.navigate(['/e-banking/overview']);
  }

  // Return from Impersonation back to Admin Console
  returnToAdmin(): void {
    const adminToken = localStorage.getItem(this.ADMIN_BACKUP_KEY);
    if (adminToken) {
      localStorage.setItem(this.TOKEN_KEY, adminToken);
      localStorage.removeItem(this.ADMIN_BACKUP_KEY);
      this.loadProfile().subscribe({
        next: () => this.router.navigate(['/admin/users']),
        error: () => this.adminLogout()
      });
    } else {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  // Upload KYC Image to Cloudinary via backend
  uploadKycImage(imageData: string, folder?: string): Observable<{ success: boolean; url: string; public_id?: string; message?: string }> {
    return this.http.post<{ success: boolean; url: string; public_id?: string; message?: string }>(
      '/api/v1/upload/kyc',
      { image: imageData, folder }
    );
  }

  // Customer Onboarding (/open-account)
  register(payload: any): Observable<any> {
    return this.http.post('/api/v1/auth/register', payload);
  }

  // Dedicated Admin Direct Login
  adminLogin(email: string, password: string): Observable<any> {
    return this.http.post<any>('/api/v1/auth/admin-login', { email, password }).pipe(
      tap((res) => {
        if (res.success && res.token) {
          localStorage.setItem(this.TOKEN_KEY, res.token);
          this.currentUser.set(res.user);
          this.saveStoredUser(res.user);
        }
      })
    );
  }

  // Update Profile Information
  updateProfile(payload: any): Observable<any> {
    return this.http.put<any>('/api/v1/auth/profile', payload).pipe(
      tap(() => {
        this.loadProfile().subscribe();
      })
    );
  }

  adminLogout(): void {
    this.clearSession();
    this.router.navigate(['/admin/login']);
  }

  // Fetch Current Profile
  loadProfile(): Observable<{ success: boolean; user: any }> {
    return this.http.get<{ success: boolean; user: any }>('/api/v1/auth/me').pipe(
      tap((res) => {
        if (res.user) {
          this.currentUser.set(res.user);
          this.saveStoredUser(res.user);
          if (res.user.account) {
            const normalizedAccount = this.normalizeAccount(res.user.account);
            this.currentAccount.set(normalizedAccount);
            this.saveStoredAccount(normalizedAccount);
          }
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    const wasAdmin = this.isAdmin();
    this.clearSession();
    if (wasAdmin) {
      this.router.navigate(['/admin/login']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ADMIN_BACKUP_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.ACCOUNT_KEY);
    localStorage.removeItem('otb_dashboard_summary');
    sessionStorage.removeItem(this.PREAUTH_KEY);
    this.currentUser.set(null);
    this.currentAccount.set(null);
    this.preAuthData.set(null);
  }
}
