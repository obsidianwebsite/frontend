import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-savings',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      
      <!-- HERO BANNER -->
      <section class="relative bg-slate-950 text-white py-16 sm:py-24 px-5 sm:px-8 border-b border-slate-800 overflow-hidden">
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-5xl mx-auto text-center space-y-5 relative z-10">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-xs">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="font-bold text-emerald-400">4.50% Annual Percentage Yield</span>
            <span class="text-slate-600">&bull;</span>
            <span>Over 10x National Average</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Put your savings to work with 
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              4.50% APY.
            </span>
          </h1>

          <p class="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Watch your money compound daily. No lock-up periods, no monthly service charges, and complete liquidity whenever you need your funds.
          </p>

          <div class="pt-2 flex flex-wrap justify-center items-center gap-4">
            <a routerLink="/open-account" 
               class="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-950/60 transition transform hover:-translate-y-0.5">
              Start Saving with 4.50% APY
            </a>
            <a routerLink="/login" 
               class="px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm sm:text-base transition">
              Client Sign In &rarr;
            </a>
          </div>
        </div>
      </section>

      <!-- INTERACTIVE COMPOUND INTEREST CALCULATOR WIDGET -->
      <section class="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div class="obsidian-card p-6 sm:p-10 lg:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-2xl space-y-8">
          
          <div class="text-center max-w-2xl mx-auto space-y-2">
            <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest">Interactive Projection</span>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Calculate your compound interest earnings
            </h2>
            <p class="text-xs sm:text-sm text-slate-500">
              See how much your balance will grow at 4.50% APY with daily compounding.
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <!-- Controls (Left 7 Cols) -->
            <div class="lg:col-span-7 space-y-6">
              
              <!-- Initial Deposit -->
              <div class="space-y-2">
                <div class="flex justify-between items-center text-xs">
                  <label class="font-extrabold text-slate-700 uppercase tracking-wider">Initial Deposit Amount</label>
                  <span class="text-xl font-black text-slate-900 font-tabular">&#36;{{ initialDeposit | number }}</span>
                </div>
                <input type="range" min="1000" max="100000" step="1000" 
                       [(ngModel)]="initialDeposit" (ngModelChange)="recalculate()"
                       class="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500">
                <div class="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>$1,000</span>
                  <span>$50,000</span>
                  <span>$100,000</span>
                </div>
              </div>

              <!-- Monthly Contribution -->
              <div class="space-y-2">
                <div class="flex justify-between items-center text-xs">
                  <label class="font-extrabold text-slate-700 uppercase tracking-wider">Monthly Recurring Savings</label>
                  <span class="text-xl font-black text-emerald-600 font-tabular">+&#36;{{ monthlyDeposit | number }}/mo</span>
                </div>
                <input type="range" min="0" max="5000" step="100" 
                       [(ngModel)]="monthlyDeposit" (ngModelChange)="recalculate()"
                       class="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500">
                <div class="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>$0</span>
                  <span>$2,500</span>
                  <span>$5,000</span>
                </div>
              </div>

              <!-- Time Horizon -->
              <div class="space-y-2">
                <div class="flex justify-between items-center text-xs">
                  <label class="font-extrabold text-slate-700 uppercase tracking-wider">Time Horizon (Years)</label>
                  <span class="text-xl font-black text-cyan-700 font-tabular">{{ years }} {{ years === 1 ? 'Year' : 'Years' }}</span>
                </div>
                <input type="range" min="1" max="10" step="1" 
                       [(ngModel)]="years" (ngModelChange)="recalculate()"
                       class="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-cyan-600">
                <div class="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>1 Year</span>
                  <span>5 Years</span>
                  <span>10 Years</span>
                </div>
              </div>

            </div>

            <!-- Result Card (Right 5 Cols) -->
            <div class="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-slate-950 text-white shadow-xl border border-slate-800 space-y-6">
              <div>
                <span class="text-[10px] uppercase tracking-widest text-emerald-400 font-extrabold block">Estimated Future Balance</span>
                <div class="text-3xl sm:text-4xl font-black font-tabular text-white tracking-tight mt-1">
                  &#36;{{ totalBalance | number:'1.2-2' }}
                </div>
                <div class="text-xs text-slate-400 mt-1">
                  Compounded daily at <strong class="text-emerald-400">4.50% APY</strong>
                </div>
              </div>

              <!-- Breakdown Strip -->
              <div class="space-y-3 pt-4 border-t border-slate-800 text-xs">
                <div class="flex justify-between items-center">
                  <span class="text-slate-400">Total Money Deposited:</span>
                  <span class="font-mono font-bold text-slate-200">&#36;{{ totalContributed | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-emerald-400 font-bold">Total Interest Earned:</span>
                  <span class="font-mono font-black text-emerald-400">+&#36;{{ totalInterest | number:'1.2-2' }}</span>
                </div>
              </div>

              <!-- Ratio bar -->
              <div class="space-y-1.5 pt-1">
                <div class="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div class="bg-slate-400" [style.width.%]="(totalContributed / totalBalance) * 100"></div>
                  <div class="bg-emerald-400" [style.width.%]="(totalInterest / totalBalance) * 100"></div>
                </div>
                <div class="flex justify-between text-[10px] text-slate-400">
                  <span>Principal ({{ ((totalContributed / totalBalance) * 100) | number:'1.0-0' }}%)</span>
                  <span class="text-emerald-400 font-bold">Pure Yield ({{ ((totalInterest / totalBalance) * 100) | number:'1.0-0' }}%)</span>
                </div>
              </div>

              <a routerLink="/open-account" 
                 class="block w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-center font-bold text-xs transition shadow-lg shadow-emerald-950/60">
                Lock In 4.50% APY Today &rarr;
              </a>
            </div>

          </div>

        </div>
      </section>

      <!-- BIG BANK COMPARISON -->
      <section class="bg-slate-50 py-20 border-t border-b border-slate-200">
        <div class="max-w-5xl mx-auto px-5 sm:px-8 space-y-12">
          
          <div class="text-center max-w-2xl mx-auto space-y-3">
            <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest">Rate Comparison</span>
            <h2 class="text-3xl font-black text-slate-900 tracking-tight">
              See how much more you earn with VaultProvenance
            </h2>
            <p class="text-sm text-slate-600">
              National average savings rates are stuck at 0.01% to 0.40%. Here's the difference on a $25,000 deposit over 1 year:
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            
            <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <span class="text-xs font-bold text-slate-400 uppercase">Typical Traditional Bank</span>
              <div class="text-3xl font-black text-slate-400 font-tabular">&#36;2.50</div>
              <p class="text-[11px] text-slate-500">Based on standard 0.01% APY national baseline</p>
            </div>

            <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <span class="text-xs font-bold text-slate-500 uppercase">Average High-Yield Bank</span>
              <div class="text-3xl font-black text-slate-700 font-tabular">&#36;500.00</div>
              <p class="text-[11px] text-slate-500">Based on standard 2.00% APY market tier</p>
            </div>

            <div class="p-6 rounded-3xl bg-slate-950 text-white border-2 border-emerald-500 shadow-xl space-y-3 relative overflow-hidden">
              <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-xl"></div>
              <span class="text-xs font-black text-emerald-400 uppercase tracking-wider">VaultProvenance Bank</span>
              <div class="text-4xl font-black text-emerald-400 font-tabular">&#36;1,125.00</div>
              <p class="text-[11px] text-slate-300 font-medium">Earn over 450x more interest on your cash</p>
            </div>

          </div>

        </div>
      </section>

      <!-- CERTIFICATES OF DEPOSIT TIERS -->
      <section class="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span class="text-xs font-bold text-cyan-600 uppercase tracking-widest">Fixed-Term Wealth</span>
          <h2 class="text-3xl font-black text-slate-900 tracking-tight">
            Certificate of Deposit (CD) Accounts
          </h2>
          <p class="text-slate-600 text-sm">
            Lock in guaranteed, fixed interest rates for a set duration with full FDIC protection.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-4">
            <span class="text-xs font-bold text-slate-500 uppercase">6-Month Fixed CD</span>
            <div class="text-4xl font-black text-slate-900 font-tabular">4.75% <span class="text-xs text-slate-500 font-normal">APY</span></div>
            <p class="text-xs text-slate-500">Short-term liquidity preservation with guaranteed high returns.</p>
            <div class="text-[11px] text-emerald-700 font-bold bg-emerald-50 py-1 px-3 rounded-lg inline-block">Min. $1,000 Deposit</div>
          </div>

          <div class="p-6 rounded-3xl bg-white border-2 border-cyan-500 shadow-lg text-center space-y-4">
            <span class="text-xs font-bold text-cyan-700 uppercase">12-Month Treasury CD</span>
            <div class="text-4xl font-black text-cyan-700 font-tabular">5.10% <span class="text-xs text-slate-500 font-normal">APY</span></div>
            <p class="text-xs text-slate-500">Our flagship yield rate. Maximize annual earnings with predictable compound interest.</p>
            <div class="text-[11px] text-cyan-800 font-bold bg-cyan-50 py-1 px-3 rounded-lg inline-block">Min. $2,500 Deposit</div>
          </div>

          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-4">
            <span class="text-xs font-bold text-slate-500 uppercase">24-Month Long Horizon</span>
            <div class="text-4xl font-black text-slate-900 font-tabular">4.85% <span class="text-xs text-slate-500 font-normal">APY</span></div>
            <p class="text-xs text-slate-500">Protect against future central bank rate cuts by locking in current peak yield.</p>
            <div class="text-[11px] text-emerald-700 font-bold bg-emerald-50 py-1 px-3 rounded-lg inline-block">Min. $5,000 Deposit</div>
          </div>
        </div>
      </section>

      <!-- CALL TO ACTION -->
      <section class="py-20 bg-slate-950 text-white text-center">
        <div class="max-w-3xl mx-auto px-5 sm:px-8 space-y-6">
          <h2 class="text-3xl sm:text-4xl font-black tracking-tight">Stop letting your savings sit idle.</h2>
          <p class="text-slate-400 text-sm sm:text-base">
            Open a High-Yield Savings Account today with zero fees and start earning 4.50% APY immediately.
          </p>
          <div class="pt-2">
            <a routerLink="/open-account" 
               class="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base shadow-xl transition inline-block">
              Open High-Yield Savings
            </a>
          </div>
        </div>
      </section>

    </div>
  `
})
export class SavingsComponent {
  initialDeposit: number = 25000;
  monthlyDeposit: number = 500;
  years: number = 3;
  rate: number = 0.045; // 4.50%

  totalContributed: number = 0;
  totalInterest: number = 0;
  totalBalance: number = 0;

  constructor() {
    this.recalculate();
  }

  recalculate(): void {
    const P = Number(this.initialDeposit) || 0;
    const PMT = Number(this.monthlyDeposit) || 0;
    const t = Number(this.years) || 1;
    const r = this.rate;
    const n = 12; // monthly compounding

    // Formula: A = P(1 + r/n)^(nt) + PMT * [ ((1 + r/n)^(nt) - 1) / (r/n) ]
    const compoundFactor = Math.pow(1 + r / n, n * t);
    const futureFromPrincipal = P * compoundFactor;
    const futureFromAnnuity = PMT > 0 ? PMT * ((compoundFactor - 1) / (r / n)) : 0;

    this.totalBalance = Math.round((futureFromPrincipal + futureFromAnnuity) * 100) / 100;
    this.totalContributed = P + (PMT * 12 * t);
    this.totalInterest = Math.max(0, Math.round((this.totalBalance - this.totalContributed) * 100) / 100);
  }
}
