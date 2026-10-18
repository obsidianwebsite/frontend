import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../../core/services/account.service';
import { Transaction } from '../../../../core/models/bank.models';

@Component({
  selector: 'app-statement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 sm:space-y-8 animate-fade-in">
      
      <!-- Top Title & Official Export Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-[#003432] tracking-tight">Account Statement &amp; General Ledger</h1>
          <p class="text-xs text-slate-500 mt-1">Official double-entry postings, certified PDF downloads, and verified wire settlement statements.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2.5 self-start">
          <button (click)="downloadPdf()" [disabled]="downloadingPdf"
                  class="bg-[#003432] hover:bg-[#002625] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs">
            @if (downloadingPdf) {
              <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating PDF...</span>
            } @else {
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <span>Download Certified PDF Statement</span>
            }
          </button>
          <button (click)="printStatement()"
                  class="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-2 shadow-xs">
            <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            <span>Print View</span>
          </button>
        </div>
      </div>

      <!-- Audit Context Strip -->
      @if (auditContext(); as audit) {
        <div class="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3 shadow-xs print:hidden">
          <div class="flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>You have logged in from IP: <strong class="font-mono text-[#003432] bg-slate-100 px-1.5 py-0.5 rounded">{{ audit.currentIp || '127.0.0.1' }}</strong></span>
          </div>
          <div class="text-slate-500">
            Your Last Log In: <strong class="text-slate-700">{{ audit.lastLoginAt ? (audit.lastLoginAt | date:'medium') : 'Active Session' }}</strong>
          </div>
        </div>
      }

      <!-- Filter Controls Card -->
      <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs print:hidden space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          
          <div>
            <label class="block font-bold text-slate-700 uppercase mb-1">From Date</label>
            <input type="date" [(ngModel)]="filters.from" (ngModelChange)="loadTransactions()" 
                   class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
          </div>

          <div>
            <label class="block font-bold text-slate-700 uppercase mb-1">To Date</label>
            <input type="date" [(ngModel)]="filters.to" (ngModelChange)="loadTransactions()" 
                   class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
          </div>

          <div>
            <label class="block font-bold text-slate-700 uppercase mb-1">Transaction Type</label>
            <select [(ngModel)]="filters.type" (ngModelChange)="loadTransactions()" 
                    class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none font-medium">
              <option value="ALL">All Entries (Credits &amp; Debits)</option>
              <option value="CREDIT">Credits Only (+ Inflow)</option>
              <option value="DEBIT">Debits Only (- Outflow)</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 uppercase mb-1">Keyword Search</label>
            <input type="text" [(ngModel)]="filters.search" (ngModelChange)="loadTransactions()" 
                   placeholder="Search reference or payee..." 
                   class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
          </div>

        </div>
      </div>

      <!-- Ledger Table (Desktop + Mobile Views) -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        
        <div class="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-[#0BB4D2]"></span>
            <span>Displaying <strong>{{ transactions().length }}</strong> verified ledger records</span>
          </div>
          <span class="font-bold text-[#003432] bg-teal-50 px-2 py-0.5 rounded border border-teal-100">Settlement Base: USD ($)</span>
        </div>

        @if (transactions().length > 0) {
          
          <!-- Desktop Table -->
          <div class="hidden sm:block overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th class="py-3.5 px-5">Date</th>
                  <th class="py-3.5 px-5">Reference</th>
                  <th class="py-3.5 px-5">Counterparty Details</th>
                  <th class="py-3.5 px-5">Channel</th>
                  <th class="py-3.5 px-5 text-right">Fee</th>
                  <th class="py-3.5 px-5 text-right">Amount</th>
                  <th class="py-3.5 px-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (t of transactions(); track t.id) {
                  <tr class="hover:bg-slate-50/80 transition">
                    <td class="py-3.5 px-5 font-mono text-slate-500 whitespace-nowrap">
                      {{ t.postDate | date:'yyyy-MM-dd HH:mm' }}
                    </td>
                    <td class="py-3.5 px-5 font-mono font-bold text-slate-700 whitespace-nowrap">
                      {{ t.reference }}
                    </td>
                    <td class="py-3.5 px-5">
                      <div class="font-bold text-[#003432]">{{ t.counterpartyName }}</div>
                      <div class="text-[11px] text-slate-500">{{ t.counterpartyBank }} &bull; {{ t.counterpartyAccount }}</div>
                      @if (t.narration) {
                        <div class="text-[10px] text-slate-400 italic mt-0.5">{{ t.narration }}</div>
                      }
                    </td>
                    <td class="py-3.5 px-5 text-slate-600 whitespace-nowrap">
                      <span class="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                        {{ t.channel.replace('_', ' ') }}
                      </span>
                    </td>
                    <td class="py-3.5 px-5 text-right font-tabular text-slate-400">
                      <span>$</span>{{ t.fee | number:'1.2-2' }}
                    </td>
                    <td class="py-3.5 px-5 text-right font-tabular font-bold text-sm whitespace-nowrap"
                        [ngClass]="t.type === 'CREDIT' ? 'text-emerald-600' : 'text-slate-900'">
                      {{ t.type === 'CREDIT' ? '+' : '-' }}<span>$</span>{{ t.amount | number:'1.2-2' }}
                    </td>
                    <td class="py-3.5 px-5 text-center whitespace-nowrap">
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                            [ngClass]="t.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'">
                        {{ t.status }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Mobile Modern Card Feed -->
          <div class="sm:hidden divide-y divide-slate-100">
            @for (t of transactions(); track t.id) {
              <div class="p-4 space-y-2 hover:bg-slate-50 transition">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <div class="font-bold text-xs text-[#003432]">{{ t.counterpartyName }}</div>
                    <div class="text-[11px] text-slate-500 font-mono">{{ t.reference }}</div>
                  </div>
                  <div class="text-right">
                    <div class="font-tabular font-bold text-sm"
                         [ngClass]="t.type === 'CREDIT' ? 'text-emerald-600' : 'text-slate-900'">
                      {{ t.type === 'CREDIT' ? '+' : '-' }}<span>$</span>{{ t.amount | number:'1.2-2' }}
                    </div>
                    <span class="px-2 py-0.2 rounded-full text-[9px] font-bold"
                          [ngClass]="t.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'">
                      {{ t.status }}
                    </span>
                  </div>
                </div>

                <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>{{ t.postDate | date:'mediumDate' }} &bull; {{ t.channel.replace('_', ' ') }}</span>
                  <span>Fee: <span>$</span>{{ t.fee | number:'1.2-2' }}</span>
                </div>
              </div>
            }
          </div>

        } @else {
          <div class="p-12 text-center text-slate-500 text-xs">
            <svg class="w-10 h-10 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            <p>No transaction records match the specified filters.</p>
          </div>
        }

      </div>

    </div>
  `
})
export class StatementComponent implements OnInit {
  private accountService = inject(AccountService);

  transactions = signal<Transaction[]>([]);
  auditContext = signal<any>(null);

  filters = {
    from: '',
    to: '',
    type: 'ALL',
    search: ''
  };

  ngOnInit(): void {
    this.loadTransactions();
    this.loadAudit();
  }

  loadAudit(): void {
    this.accountService.getSummary().subscribe({
      next: (res) => {
        if (res.data?.audit) {
          this.auditContext.set(res.data.audit);
        }
      }
    });
  }

  loadTransactions(): void {
    this.accountService.getStatement(this.filters).subscribe({
      next: (res) => {
        if (res.data?.transactions) {
          this.transactions.set(res.data.transactions);
        }
      }
    });
  }

  downloadingPdf = false;

  downloadPdf(): void {
    this.downloadingPdf = true;
    this.accountService.downloadStatementPdf().subscribe({
      next: (blob) => {
        this.downloadingPdf = false;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `VaultAtlantic_Bank_Statement_${Date.now()}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.downloadingPdf = false;
        alert('Failed to generate statement PDF.');
      }
    });
  }

  printStatement(): void {
    window.print();
  }
}
