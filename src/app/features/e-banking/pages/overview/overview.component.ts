import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../../../core/services/account.service';
import { AuthService } from '../../../../core/services/auth.service';
import { TourService } from '../../../../core/services/tour.service';
import { DashboardSummary, Transaction } from '../../../../core/models/bank.models';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6 animate-fade-in font-sans">
      
      <!-- Top Welcome & Vault Identity Row -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold font-nunito text-[#003432]">
            Account Overview
          </h2>
          <p class="text-xs text-slate-500">
            Welcome back, <span class="font-bold text-slate-700">{{ authService.currentUser()?.fullName || summary()?.user?.fullName || 'Client' }}</span>. Here is your financial summary.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <!-- Copyable Account Pill -->
          <div class="bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 shadow-xs flex items-center gap-2">
            <span class="text-xs text-slate-500">Vault No:</span>
            <span class="font-mono text-xs font-bold text-slate-900">{{ summary()?.account?.accountNumber || '••••••••••' }}</span>
            <button (click)="copyAccountNumber()" 
                    class="text-[11px] font-bold text-[#0BB4D2] hover:text-[#003432] transition">
              {{ copiedAccount() ? 'Copied!' : 'Copy' }}
            </button>
          </div>

          <span class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>FDIC Insured</span>
          </span>
        </div>
      </div>

      <!-- Inactive Account Banner -->
      @if (summary()?.account?.status === 'INACTIVE') {
        <div class="rounded-2xl p-4 bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3 shadow-sm">
          <svg class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <div class="text-xs sm:text-sm">
            <p class="font-bold text-amber-900">Account Inactive (Read-Only Mode)</p>
            <p class="text-amber-800 mt-0.5">Your account is currently inactive. You can view your statements and ledger history, but deposits, wire transfers, and withdrawals are restricted. Please contact customer support to reactivate transactional access.</p>
          </div>
        </div>
      }

      <!-- Main Balance Hero Card (Deep Forest Teal & Cyan Glow) -->
      <div [class.ring-4]="tourService.isOpen() && tourService.currentTourTargetId() === 'overview'"
           [class.ring-amber-400]="tourService.isOpen() && tourService.currentTourTargetId() === 'overview'"
           [class.shadow-2xl]="tourService.isOpen() && tourService.currentTourTargetId() === 'overview'"
           class="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#003432] via-[#004240] to-[#002625] text-white shadow-lg relative overflow-hidden transition-all duration-300">
        
        @if (tourService.isOpen() && tourService.currentTourTargetId() === 'overview') {
          <div class="absolute top-3 right-3 z-20 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider animate-bounce shadow-lg flex items-center gap-1.5">
            <span>👇</span>
            <span>YOUR BALANCE IS HERE</span>
          </div>
        }
        
        <div class="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          
          <!-- Balance Value -->
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-300">Total Available Balance</span>
              <button (click)="toggleHideBalance()"
                      class="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-slate-200 transition">
                {{ hideBalance() ? '👁 Show' : '👁‍🗨 Hide' }}
              </button>
            </div>

            <div class="flex items-baseline gap-3">
              @if (hideBalance()) {
                <span class="text-3xl sm:text-5xl font-black font-nunito tracking-tight text-white">
                  ••••••••
                </span>
              } @else {
                <span class="text-3xl sm:text-5xl font-black font-nunito tracking-tight text-white">
                  {{ currencySymbol() }}{{ summary()?.account?.availableBalance || '0.00' | number:'1.2-2' }}
                </span>
              }
              <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#0BB4D2]/20 text-[#0BB4D2] border border-[#0BB4D2]/40">
                {{ summary()?.account?.currency || 'USD' }} Vault
              </span>
            </div>

            <div class="text-xs text-slate-300 flex items-center gap-4 pt-1">
              <span>Ledger: <strong class="text-white">{{ hideBalance() ? '••••' : (currencySymbol() + (summary()?.account?.ledgerBalance || '0.00' | number:'1.2-2')) }}</strong></span>
              <span>&bull;</span>
              <span>Status: <strong [ngClass]="summary()?.account?.status === 'INACTIVE' ? 'text-amber-400' : 'text-emerald-400'" class="font-bold uppercase">{{ summary()?.account?.status || 'Active' }}</strong></span>
            </div>
          </div>

          <!-- Quick Action Buttons Inside Card -->
          <div class="flex flex-wrap items-center gap-3">
            <a routerLink="/e-banking/fund-transfer" 
               class="theme_btn apply_btn py-3 px-5 text-xs font-bold rounded-xl shadow-md flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              <span>Send Money</span>
            </a>
            <a routerLink="/e-banking/deposit" 
               class="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-5 text-xs rounded-xl transition flex items-center gap-2 border border-white/20">
              <svg class="w-4 h-4 text-[#0BB4D2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
              <span>Deposit</span>
            </a>
            <a routerLink="/e-banking/cards" 
               class="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-5 text-xs rounded-xl transition flex items-center gap-2 border border-white/20">
              <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>
              <span>My Cards</span>
            </a>
          </div>

        </div>

      </div>

      <!-- 3 Calm Financial Metric Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <!-- Metric 1: Checking Account -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase">Checking Liquid Vault</span>
            <div class="w-8 h-8 rounded-lg bg-teal-50 text-[#003432] flex items-center justify-center font-bold">
              💳
            </div>
          </div>
          <div>
            <div class="text-2xl font-black font-nunito text-[#003432]">
              {{ hideBalance() ? '••••••••' : ('$' + (summary()?.account?.availableBalance || '0.00' | number:'1.2-2')) }}
            </div>
            <p class="text-xs text-slate-400 mt-0.5">Primary checking balance</p>
          </div>
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span class="text-emerald-600 font-bold">Verified Account</span>
            <a routerLink="/e-banking/withdrawals" class="text-[#0BB4D2] hover:text-[#003432] font-bold">Withdraw &rarr;</a>
          </div>
        </div>

        <!-- Metric 2: High-Yield Savings -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase">High-Yield Savings</span>
            <div class="w-8 h-8 rounded-lg bg-cyan-50 text-[#0BB4D2] flex items-center justify-center font-bold">
              💰
            </div>
          </div>
          <div>
            <div class="text-2xl font-black font-nunito text-[#003432]">
              {{ hideBalance() ? '••••••••' : ('$' + (summary()?.account?.savingsBalance || '45200.00' | number:'1.2-2')) }}
            </div>
            <p class="text-xs text-slate-400 mt-0.5">Annual interest: 4.50% APY</p>
          </div>
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span class="text-slate-500">Compounding Monthly</span>
            <a routerLink="/e-banking/investments" class="text-[#0BB4D2] hover:text-[#003432] font-bold">Grow &rarr;</a>
          </div>
        </div>

        <!-- Metric 3: Total Credits / Inflow -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase">Verified Inflow</span>
            <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              📈
            </div>
          </div>
          <div>
            <div class="text-2xl font-black font-nunito text-[#003432]">
              {{ hideBalance() ? '••••••••' : ('$' + (summary()?.metrics?.totalInflow || '18450.00' | number:'1.2-2')) }}
            </div>
            <p class="text-xs text-slate-400 mt-0.5">Total received this cycle</p>
          </div>
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span class="text-emerald-600 font-bold">Cleared Funds</span>
            <a routerLink="/e-banking/statement" class="text-[#0BB4D2] hover:text-[#003432] font-bold">Statement &rarr;</a>
          </div>
        </div>

      </div>

      <!-- Main Content 2-Column Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Left: Recent Transactions Table (8 Cols) -->
        <div class="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          
          <div class="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 class="font-bold font-nunito text-[#003432] text-base">Recent Transactions</h3>
              <p class="text-xs text-slate-500">Click any transaction to view official receipt</p>
            </div>

            <!-- Filter Buttons -->
            <div class="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold">
              <button (click)="filterType.set('ALL')"
                      [ngClass]="filterType() === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                      class="px-3 py-1 rounded-lg transition">
                All
              </button>
              <button (click)="filterType.set('CREDIT')"
                      [ngClass]="filterType() === 'CREDIT' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                      class="px-3 py-1 rounded-lg transition">
                Inflow (+)
              </button>
              <button (click)="filterType.set('DEBIT')"
                      [ngClass]="filterType() === 'DEBIT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                      class="px-3 py-1 rounded-lg transition">
                Outflow (-)
              </button>
            </div>
          </div>

          @if (filteredTransactions().length > 0) {
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th class="py-3.5 px-5">Date</th>
                    <th class="py-3.5 px-5">Description</th>
                    <th class="py-3.5 px-5 text-right">Amount</th>
                    <th class="py-3.5 px-5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  @for (t of filteredTransactions(); track t.id) {
                    <tr (click)="openReceipt(t)" class="hover:bg-slate-50 cursor-pointer transition">
                      <td class="py-3.5 px-5 text-slate-500 whitespace-nowrap">
                        {{ t.postDate | date:'mediumDate' }}
                      </td>
                      <td class="py-3.5 px-5">
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                               [ngClass]="t.type === 'CREDIT' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-700'">
                            @if (t.type === 'CREDIT') {
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                            } @else {
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                            }
                          </div>
                          <div>
                            <div class="font-bold text-slate-900">{{ t.counterpartyName }}</div>
                            <div class="text-[11px] text-slate-500 truncate max-w-xs">{{ t.narration }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="py-3.5 px-5 text-right font-bold text-sm whitespace-nowrap"
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
          } @else {
            <div class="p-12 text-center text-slate-400 text-xs">
              <p>No transactions found for the selected filter.</p>
            </div>
          }

        </div>

        <!-- Right: Side Widgets (4 Cols) -->
        <div class="lg:col-span-4 space-y-6">
          
          <!-- Virtual Card Preview -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="font-bold font-nunito text-[#003432] text-sm">Primary Payment Card</h4>
              <a routerLink="/e-banking/cards" class="text-xs font-bold text-[#0BB4D2] hover:underline">Manage &rarr;</a>
            </div>

            <!-- Card Visual -->
            <div class="w-full rounded-2xl p-5 bg-gradient-to-tr from-[#003432] to-[#0BB4D2] text-white shadow-md relative overflow-hidden flex flex-col justify-between h-44">
              <div class="flex justify-between items-start">
                <span class="text-xs font-black uppercase tracking-wider">Obsidian Trust Bancorp Debit</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 text-white">VISA</span>
              </div>
              <div class="font-mono text-base tracking-widest text-slate-100">
                &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242
              </div>
              <div class="flex justify-between items-center text-xs text-slate-200">
                <span class="uppercase font-semibold">{{ authService.currentUser()?.fullName || summary()?.user?.fullName || 'Client' }}</span>
                <span>12/28</span>
              </div>
            </div>

            <div class="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Contactless Enabled</span>
              <span class="text-emerald-600 font-bold">Active</span>
            </div>
          </div>

          <!-- Multi-Currency Wallets Summary -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3 text-xs">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
              <span class="font-bold font-nunito text-[#003432]">Multi-Currency Balances</span>
              <a routerLink="/e-banking/wallets" class="text-[#0BB4D2] font-bold hover:underline">All &rarr;</a>
            </div>
            
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-slate-600 flex items-center gap-2"><span>🇺🇸</span> USD Vault</span>
                <strong class="text-slate-900">&#36;{{ summary()?.account?.availableBalance || '0.00' | number:'1.2-2' }}</strong>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-600 flex items-center gap-2"><span>🇪🇺</span> EUR Ledger</span>
                <strong class="text-slate-900">&euro;0.00</strong>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-600 flex items-center gap-2"><span>🇬🇧</span> GBP Sterling</span>
                <strong class="text-slate-900">&pound;0.00</strong>
              </div>
            </div>
          </div>

          <!-- Support Card -->
          <div class="bg-[#f4f7f6] p-5 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <h4 class="font-bold text-[#003432] text-sm">Need Help With Your Account?</h4>
            <p class="text-slate-600 leading-relaxed">
              Our Nottingham and London customer desks are available 24/7 to assist with wire clearances, transfers, or card inquiries.
            </p>
            <div class="pt-2 text-[#003432] font-semibold">
              Phone: <strong class="text-[#0BB4D2]">+1 (347) 735 9424</strong>
            </div>
          </div>

        </div>

      </div>

      <!-- TRANSACTION RECEIPT MODAL -->
      @if (selectedTransaction(); as t) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div (click)="closeReceipt()" class="fixed inset-0 bg-black/60 backdrop-blur-xs"></div>
          
          <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-fade-in text-slate-800">
            
            <div class="bg-[#003432] text-white p-6 text-center space-y-2">
              <div class="w-10 h-10 mx-auto rounded-xl bg-[#0BB4D2] text-[#003432] flex items-center justify-center font-bold text-sm">
                OTB
              </div>
              <h3 class="font-bold text-lg">Transaction Receipt</h3>
              <div class="text-2xl font-black font-nunito" [ngClass]="t.type === 'CREDIT' ? 'text-emerald-400' : 'text-white'">
                {{ t.type === 'CREDIT' ? '+' : '-' }}&#36;{{ t.amount | number:'1.2-2' }}
              </div>
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold">
                {{ t.status }}
              </span>
            </div>

            <div class="p-6 space-y-3 text-xs">
              <div class="flex justify-between py-1 border-b border-slate-100">
                <span class="text-slate-500">Reference:</span>
                <strong class="font-mono text-slate-900">{{ t.reference }}</strong>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-100">
                <span class="text-slate-500">Date:</span>
                <span class="text-slate-800">{{ t.postDate | date:'medium' }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-100">
                <span class="text-slate-500">Recipient / Party:</span>
                <strong class="text-slate-900">{{ t.counterpartyName }}</strong>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-100">
                <span class="text-slate-500">Channel:</span>
                <span class="text-slate-800">{{ t.channel.replace('_', ' ') }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-100">
                <span class="text-slate-500">Memo:</span>
                <span class="text-slate-700 italic">{{ t.narration || 'Transfer' }}</span>
              </div>
            </div>

            <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button (click)="printReceipt()" class="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition">
                Print Slip
              </button>
              <button (click)="closeReceipt()" class="theme_btn py-2 px-5 text-xs">
                Close
              </button>
            </div>

          </div>
        </div>
      }

    </div>
  `
})
export class OverviewComponent implements OnInit {
  private accountService = inject(AccountService);
  authService = inject(AuthService);
  tourService = inject(TourService);
  
  summary = signal<DashboardSummary | null>(null);
  copiedAccount = signal(false);
  hideBalance = signal(false);
  filterType = signal<'ALL' | 'CREDIT' | 'DEBIT'>('ALL');
  selectedTransaction = signal<Transaction | null>(null);

  filteredTransactions = computed(() => {
    const s = this.summary();
    if (!s || !s.recentTransactions) return [];
    const filter = this.filterType();
    if (filter === 'ALL') return s.recentTransactions;
    return s.recentTransactions.filter(t => t.type === filter);
  });

  currencySymbol = computed(() => {
    const c = this.summary()?.account?.currency;
    if (c === 'GBP') return '£';
    if (c === 'EUR') return '€';
    if (c === 'NGN') return '₦';
    return '$';
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.accountService.getSummary().subscribe({
      next: (res) => {
        if (res.data) {
          this.summary.set(res.data);
        }
      }
    });
  }

  toggleHideBalance(): void {
    this.hideBalance.update(v => !v);
  }

  copyAccountNumber(): void {
    const accNo = this.summary()?.account?.accountNumber;
    if (accNo && navigator.clipboard) {
      navigator.clipboard.writeText(accNo);
      this.copiedAccount.set(true);
      setTimeout(() => this.copiedAccount.set(false), 2000);
    }
  }

  openReceipt(t: Transaction): void {
    this.selectedTransaction.set(t);
  }

  closeReceipt(): void {
    this.selectedTransaction.set(null);
  }

  printReceipt(): void {
    window.print();
  }
}
