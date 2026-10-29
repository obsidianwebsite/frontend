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

  // Signals
  currentUser = signal<User | null>(null);
  currentAccount = signal<Account | null>(null);
  preAuthData = signal<{ token: string; user: { role?: 'ADMIN' | 'CUSTOMER'; firstName: string; lastName: string; email: string } } | null>(null);

  isAuthenticated = computed(() => !!this.currentUser() && !!localStorage.getItem(this.TOKEN_KEY));
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
  isImpersonated = computed(() => !!this.currentUser()?.impersonated || !!localStorage.getItem(this.ADMIN_BACKUP_KEY));

  constructor() {
    this.restoreSession();
  }

  private restoreSession(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      this.loadProfile().subscribe({
        error: () => this.clearSession()
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
          this.currentAccount.set(res.account);
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
    this.currentAccount.set(customerAccount);
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
        error: () => this.logout()
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
          if (res.user.account) {
            this.currentAccount.set(res.user.account);
          }
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ADMIN_BACKUP_KEY);
    sessionStorage.removeItem(this.PREAUTH_KEY);
    this.currentUser.set(null);
    this.currentAccount.set(null);
    this.preAuthData.set(null);
  }
}
