import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoanService } from '../../../core/services/domain.services';

@Component({
  selector: 'app-loan-calculator',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div>
      <!-- Header Banner with Photography -->
      <section class="relative bg-[#003432] text-white py-16 px-4 sm:px-8 border-b border-[#002625] overflow-hidden">
        <div class="absolute inset-0 z-0 opacity-15 bg-cover bg-center"
             style="background-image: url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80');">
        </div>
        <div class="relative z-10 max-w-4xl mx-auto text-center space-y-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0BB4D2]/20 text-[#0BB4D2] border border-[#0BB4D2]/40 backdrop-blur-sm">
            <span>📊</span>
            <span>Planning Tools</span>
          </span>
          <h1 class="text-3xl sm:text-5xl font-black tracking-tight">Loan Repayment Calculator</h1>
          <p class="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-normal">
            Estimate your monthly payment in seconds. Choose how much you want to borrow and how long you need to pay it back.
          </p>
        </div>
      </section>

      <section class="max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div class="obsidian-card p-6 sm:p-10 bg-white border border-slate-200/90 shadow-xl rounded-3xl">
          
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pb-10 border-b border-slate-100">
            
            <!-- Sliders & Inputs -->
            <div class="lg:col-span-7 space-y-7">
              
              <!-- Amount Slider -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <label class="text-xs font-bold uppercase tracking-wider text-slate-700">How much do you need?</label>
                  <span class="text-2xl font-black text-cyan-700 font-tabular">&#36;{{ amount | number }}</span>
                </div>
                <input type="range" min="1000" max="50000" step="500" 
                       [(ngModel)]="amount" (ngModelChange)="compute()"
                       class="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-cyan-600">
                <div class="flex justify-between text-xs text-slate-400 font-medium">
                  <span>&#36;1,000</span>
                  <span>&#36;25,000</span>
                  <span>&#36;50,000</span>
                </div>
              </div>

              <!-- Term Slider -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <label class="text-xs font-bold uppercase tracking-wider text-slate-700">How long do you need to repay?</label>
                  <span class="text-xl font-black text-slate-900 font-tabular">{{ years }} {{ years === 1 ? 'Year' : 'Years' }} ({{ years * 12 }} months)</span>
                </div>
                <input type="range" min="1" max="7" step="1" 
                       [(ngModel)]="years" (ngModelChange)="compute()"
                       class="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900">
                <div class="flex justify-between text-xs text-slate-400 font-medium">
                  <span>1 Year</span>
                  <span>3 Years</span>
                  <span>5 Years</span>
                  <span>7 Years</span>
                </div>
              </div>

              <!-- APR Indicator -->
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <strong class="text-slate-800 font-bold block text-sm">Fixed Representative APR</strong>
                  <span class="text-slate-500">Rate is guaranteed for the entire loan term</span>
                </div>
                <span class="text-base font-black text-emerald-600 font-tabular bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                  {{ apr }}% Fixed
                </span>
              </div>

            </div>

            <!-- Result Summary Card -->
            <div class="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#003432] via-[#002625] to-slate-900 text-white shadow-2xl space-y-6 relative overflow-hidden">
              <div class="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#0BB4D2]/10 blur-2xl pointer-events-none"></div>

              <div>
                <span class="text-[11px] uppercase tracking-wider text-[#0BB4D2] font-bold block mb-1">Estimated Monthly Payment</span>
                <div class="text-4xl sm:text-5xl font-black text-white font-tabular">
                  &#36;{{ monthlyPayment | number:'1.2-2' }}<span class="text-xs text-slate-400 font-normal">/mo</span>
                </div>
              </div>

              <div class="space-y-3 pt-4 border-t border-white/10 text-xs">
                <div class="flex justify-between text-slate-300">
                  <span>Borrowing amount:</span>
                  <strong class="font-tabular text-white font-semibold">&#36;{{ amount | number:'1.2-2' }}</strong>
                </div>
                <div class="flex justify-between text-slate-300">
                  <span>Total interest:</span>
                  <strong class="font-tabular text-[#0BB4D2] font-semibold">&#36;{{ totalInterest | number:'1.2-2' }}</strong>
                </div>
                <div class="flex justify-between text-slate-300 pt-2 border-t border-white/10">
                  <span class="font-semibold text-white">Total amount to pay back:</span>
                  <strong class="font-tabular text-emerald-400 font-bold text-sm">&#36;{{ totalRepayable | number:'1.2-2' }}</strong>
                </div>
              </div>

              <a routerLink="/open-account" 
                 class="btn-gradient-mountain w-full py-3.5 rounded-xl text-center font-bold block text-sm shadow-lg">
                Apply for This Loan &rarr;
              </a>
            </div>

          </div>

          <!-- Amortization Annual Schedule Preview -->
          <div class="pt-8">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-base sm:text-lg font-bold text-slate-900">Year-by-Year Payment Breakdown</h3>
                <p class="text-xs text-slate-500">How your balance reduces over the life of your loan</p>
              </div>
            </div>

            <div class="overflow-x-auto rounded-2xl border border-slate-200">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th class="py-3 px-4">Period</th>
                    <th class="py-3 px-4">Principal Paid</th>
                    <th class="py-3 px-4">Interest Paid</th>
                    <th class="py-3 px-4">Ending Balance</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 bg-white">
                  @for (row of schedule; track row.year) {
                    <tr class="hover:bg-slate-50/70 transition">
                      <td class="py-3 px-4 font-bold text-slate-900">Year {{ row.year }}</td>
                      <td class="py-3 px-4 font-tabular text-slate-700">&#36;{{ row.principalPaid | number:'1.2-2' }}</td>
                      <td class="py-3 px-4 font-tabular text-slate-500">&#36;{{ row.interestPaid | number:'1.2-2' }}</td>
                      <td class="py-3 px-4 font-tabular font-bold text-emerald-600">&#36;{{ row.balance | number:'1.2-2' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>
    </div>
  `
})
export class LoanCalculatorComponent {
  private loanService = inject(LoanService);

  amount: number = 20000;
  years: number = 3;
  apr: number = 4.5;

  monthlyPayment: number = 0;
  totalInterest: number = 0;
  totalRepayable: number = 0;
  schedule: Array<{ year: number; principalPaid: number; interestPaid: number; balance: number }> = [];

  constructor() {
    this.compute();
  }

  compute(): void {
    const P = this.amount;
    const n = this.years * 12;
    const r = (this.apr / 100) / 12;

    if (r === 0) {
      this.monthlyPayment = P / n;
    } else {
      this.monthlyPayment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    this.totalRepayable = this.monthlyPayment * n;
    this.totalInterest = this.totalRepayable - P;

    // Build Amortization Schedule
    this.schedule = [];
    let balance = P;
    for (let y = 1; y <= this.years; y++) {
      let annualInterest = 0;
      let annualPrincipal = 0;

      for (let m = 1; m <= 12; m++) {
        const interest = balance * r;
        const principal = this.monthlyPayment - interest;
        annualInterest += interest;
        annualPrincipal += principal;
        balance = Math.max(0, balance - principal);
      }

      this.schedule.push({
        year: y,
        principalPaid: annualPrincipal,
        interestPaid: annualInterest,
        balance: balance
      });
    }
  }
}
