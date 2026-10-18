import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../../../core/services/admin.service';
import { TourService } from '../../../core/services/tour.service';
import { AdminOverview } from '../../../core/models/bank.models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-6 font-sans">
      
      <!-- Top Title & Controls -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold font-nunito text-[#003432] tracking-tight">Admin Command Center</h1>
          <p class="text-xs text-slate-500 mt-1">Real-time overview of customer deposits, pending loan applications, and liquidity.</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SYSTEM ONLINE &bull; SECURE</span>
          </span>
        </div>
      </div>

      <!-- 4 High-Impact Metric Cards -->
      <div [class.ring-4]="tourService.isOpen() && tourService.currentTourTargetId() === 'admin-overview'"
           [class.ring-amber-400]="tourService.isOpen() && tourService.currentTourTargetId() === 'admin-overview'"
           [class.p-3]="tourService.isOpen() && tourService.currentTourTargetId() === 'admin-overview'"
           [class.rounded-3xl]="tourService.isOpen() && tourService.currentTourTargetId() === 'admin-overview'"
           [class.bg-teal-50]="tourService.isOpen() && tourService.currentTourTargetId() === 'admin-overview'"
           class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 transition-all relative">
        
        @if (tourService.isOpen() && tourService.currentTourTargetId() === 'admin-overview') {
          <div class="col-span-full px-3 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider animate-bounce shadow-md flex items-center justify-center gap-2">
            <span>👇</span>
            <span>YOUR LIVE BANK DEPOSITS &amp; METRICS ARE RIGHT HERE</span>
          </div>
        }
        
        <!-- Total Vault Liquidity -->
        <div class="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Customer Deposits</span>
            <div class="w-9 h-9 rounded-xl bg-teal-50 text-[#003432] flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
          <div>
            <div class="text-2xl font-black font-nunito text-[#003432] font-tabular">
              <span>$</span>{{ overview()?.totalVaultBalance | number:'1.2-2' }}
            </div>
            <div class="text-xs text-slate-500 font-medium mt-1">Across all active accounts</div>
          </div>
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span class="text-emerald-600 font-semibold">100% Reserve Backed</span>
            <a routerLink="/admin/users" class="text-[#0BB4D2] hover:text-[#003432] font-bold">Accounts &rarr;</a>
          </div>
        </div>

        <!-- Pending Deposits Queue -->
        <div class="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Deposits</span>
            <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
            </div>
          </div>
          <div>
            <div class="text-2xl font-black font-nunito text-slate-900 font-tabular">
              {{ overview()?.pendingDepositsCount || 0 }} Requests
            </div>
            <div class="text-xs text-emerald-600 font-bold mt-1">
              <span>$</span>{{ overview()?.pendingDepositsAmount | number:'1.2-2' }} awaiting approval
            </div>
          </div>
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span class="text-slate-500">Requires Audit</span>
            <a routerLink="/admin/deposits" class="text-[#0BB4D2] hover:text-[#003432] font-bold">Approve &rarr;</a>
          </div>
        </div>

        <!-- Pending Loan Applications -->
        <div class="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Loans</span>
            <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
          </div>
          <div>
            <div class="text-2xl font-black font-nunito text-slate-900 font-tabular">
              {{ overview()?.pendingLoansCount || 0 }} Requests
            </div>
            <div class="text-xs text-amber-600 font-bold mt-1">
              <span>$</span>{{ overview()?.pendingLoansAmount | number:'1.2-2' }} awaiting review
            </div>
          </div>
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span class="text-slate-500">Underwriting queue</span>
            <a routerLink="/admin/loans" class="text-amber-600 hover:text-amber-700 font-bold">Review &rarr;</a>
          </div>
        </div>

        <!-- Total Customers -->
        <div class="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Clients</span>
            <div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </div>
          </div>
          <div>
            <div class="text-2xl font-black font-nunito text-[#003432] font-tabular">
              {{ overview()?.activeCustomers || 0 }} <span class="text-xs text-slate-400 font-normal">/ {{ overview()?.totalCustomers || 0 }}</span>
            </div>
            <div class="text-xs text-slate-500 font-medium mt-1">Active verified accounts</div>
          </div>
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span class="text-indigo-600 font-semibold">Tier-1 Accounts</span>
            <a routerLink="/admin/users" class="text-[#0BB4D2] hover:text-[#003432] font-bold">Manage &rarr;</a>
          </div>
        </div>

      </div>

      <!-- Resend Transactional Email Engine Status & Live Test -->
      <div class="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="flex items-start sm:items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-teal-50 text-[#003432] flex items-center justify-center font-bold text-lg shrink-0">
              ✉️
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-sm text-[#003432]">Resend Email API Engine</h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Integrated
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">
                Automated transactional email dispatch for wire debits, deposit credits, login security, and support ticket replies.
              </p>
            </div>
          </div>

          <!-- Quick Test Email Dispatcher -->
          <div class="flex items-center gap-2 w-full lg:w-auto">
            <input type="email" [(ngModel)]="testEmailAddress" placeholder="Enter recipient email..."
                   class="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0BB4D2] flex-1 sm:w-64" />
            <button (click)="sendTestEmail()" [disabled]="isSendingTestEmail() || !testEmailAddress.trim()"
                    class="bg-[#003432] hover:bg-[#002625] text-white px-4 py-2 rounded-xl text-xs font-bold transition disabled:opacity-50 shrink-0 flex items-center gap-1.5 shadow-2xs">
              <span>{{ isSendingTestEmail() ? 'Dispatching...' : 'Test Send' }}</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </div>
        </div>

        @if (testEmailResult()) {
          <div class="mt-3 p-3 rounded-xl text-xs font-semibold flex items-center gap-2"
               [ngClass]="testEmailResult()?.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'">
            <span>{{ testEmailResult()?.success ? '✓' : '⚠️' }}</span>
            <span>{{ testEmailResult()?.message }}</span>
          </div>
        }
      </div>

      <!-- Quick Action Operations Strip -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div class="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wide">
              <span>📥</span>
              <span>Deposit Approvals Queue</span>
            </div>
            <h2 class="text-base font-bold text-slate-900 mt-2">Process Customer Wire &amp; Bank Remittances</h2>
            <p class="text-xs text-slate-500 mt-1">
              Verify customer deposit receipts and proof documents. Approving automatically settles funds into the customer's checking balance and notifies them.
            </p>
          </div>
          <div>
            <a routerLink="/admin/deposits" class="theme_btn apply_btn py-2.5 px-5 text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-2">
              <span>Open Deposit Queue &rarr;</span>
            </a>
          </div>
        </div>

        <div class="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wide">
              <span>📋</span>
              <span>Loan &amp; Financing Applications</span>
            </div>
            <h2 class="text-base font-bold text-slate-900 mt-2">Underwrite Personal, Auto &amp; Mortgage Loans</h2>
            <p class="text-xs text-slate-500 mt-1">
              Review applicant details, credit tiers, and collateral. Approving automatically disburses principal funds and initiates amortization schedules.
            </p>
          </div>
          <div>
            <a routerLink="/admin/loans" class="bg-[#003432] hover:bg-[#002625] text-white py-2.5 px-5 text-xs font-bold rounded-xl transition inline-flex items-center gap-2 shadow-xs">
              <span>Review Loan Applications &rarr;</span>
            </a>
          </div>
        </div>

      </div>

      <!-- Live Audit Trail Log Stream -->
      <div class="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 class="font-bold text-base text-[#003432] font-nunito">Real-Time Security &amp; Activity Ledger</h2>
            <p class="text-xs text-slate-500">Live immutable audit log of logins, transfers, and administrative actions</p>
          </div>
          <span class="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            Real-Time Stream
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th class="py-3 px-5">Timestamp</th>
                <th class="py-3 px-5">Event Category</th>
                <th class="py-3 px-5">Origin IP</th>
                <th class="py-3 px-5">Client Signature / User Agent</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-sans text-xs">
              @for (audit of overview()?.recentAudits; track audit.id) {
                <tr class="hover:bg-slate-50/80 transition">
                  <td class="py-3 px-5 text-slate-500">{{ audit.created_at | date:'medium' }}</td>
                  <td class="py-3 px-5 font-bold text-[#003432]">
                    <span class="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {{ audit.event_type }}
                    </span>
                  </td>
                  <td class="py-3 px-5 text-slate-600 font-mono text-xs">{{ audit.ip_address }}</td>
                  <td class="py-3 px-5 text-slate-500 truncate max-w-xs font-mono text-[11px]">{{ audit.user_agent }}</td>
                </tr>
              }
              @if (!overview()?.recentAudits?.length) {
                <tr>
                  <td colspan="4" class="py-6 text-center text-slate-400">No recent security events recorded</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  tourService = inject(TourService);
  private adminService = inject(AdminService);
  private http = inject(HttpClient);

  overview = signal<AdminOverview | null>(null);

  testEmailAddress: string = '';
  isSendingTestEmail = signal<boolean>(false);
  testEmailResult = signal<{ success: boolean; message: string } | null>(null);

  ngOnInit(): void {
    this.loadOverview();
  }

  loadOverview(): void {
    this.adminService.getOverview().subscribe({
      next: (res) => {
        if (res.data) {
          this.overview.set(res.data);
        }
      }
    });
  }

  sendTestEmail(): void {
    if (!this.testEmailAddress.trim() || this.isSendingTestEmail()) return;

    this.isSendingTestEmail.set(true);
    this.testEmailResult.set(null);

    this.http.post<any>('/api/v1/admin/email/test', { to: this.testEmailAddress.trim() }).subscribe({
      next: (res) => {
        this.isSendingTestEmail.set(false);
        this.testEmailResult.set({
          success: res.success,
          message: res.message || 'Email dispatch completed.'
        });
      },
      error: (err) => {
        this.isSendingTestEmail.set(false);
        this.testEmailResult.set({
          success: false,
          message: err?.error?.message || 'Failed to dispatch test email.'
        });
      }
    });
  }
}
