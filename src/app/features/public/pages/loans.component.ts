import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loans-public',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="bg-slate-50 min-h-screen text-slate-800">
      
      <!-- HERO BANNER -->
      <section class="relative bg-[#003432] text-white py-20 px-5 sm:px-8 overflow-hidden border-b border-[#002625]">
        <div class="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
             style="background-image: url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80');">
        </div>
        <div class="relative z-10 max-w-5xl mx-auto text-center space-y-4">
          <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#0BB4D2]/20 text-[#0BB4D2] border border-[#0BB4D2]/40 backdrop-blur-sm">
            <span>🏛️</span>
            <span>Transparent Credit Solutions</span>
          </span>
          <h1 class="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Loans with fixed rates.<br class="hidden sm:inline" />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-cyan-200 to-emerald-400">
              No hidden fees. No early penalty.
            </span>
          </h1>
          <p class="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal">
            Whether purchasing a family home, acquiring an executive vehicle, or consolidating credit, secure fast funding with fixed monthly payments.
          </p>
          <div class="pt-4 flex flex-wrap justify-center gap-4">
            <a routerLink="/open-account" class="btn-gradient-mountain px-8 py-4 rounded-xl font-bold text-sm shadow-xl inline-flex items-center gap-2">
              <span>Apply for a Loan</span>
              <span>&rarr;</span>
            </a>
            <a routerLink="/calculator" class="px-7 py-4 rounded-xl bg-[#002625] hover:bg-[#001c1b] border border-teal-800/40 text-white font-bold text-sm transition shadow-lg">
              Open Repayment Calculator &rarr;
            </a>
          </div>
        </div>
      </section>

      <!-- 4 LOAN CATEGORIES -->
      <section class="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div class="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span class="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider">
            Loan Portfolio
          </span>
          <h2 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Financing designed for every milestone
          </h2>
          <p class="text-sm sm:text-base text-slate-600">
            Compare our fixed-rate loan facilities tailored to your personal and professional needs.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <!-- Product 1: Personal Flex Loan -->
          <div class="obsidian-card p-6 bg-white flex flex-col justify-between space-y-6">
            <div class="space-y-4">
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl font-bold">
                💳
              </div>
              <div>
                <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider">Unsecured</span>
                <h3 class="text-xl font-bold text-slate-900">Personal Loan</h3>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Ideal for home renovations, wedding expenses, or debt consolidation into one simple payment.
              </p>
              <div class="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div class="flex justify-between">
                  <span class="text-slate-500">Fixed APR:</span>
                  <strong class="font-tabular text-emerald-600 font-bold">From 5.25%</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Borrow:</span>
                  <strong class="font-tabular text-slate-900">&#36;2,500 – &#36;50,000</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Term:</span>
                  <strong class="text-slate-900">1 to 5 Years</strong>
                </div>
              </div>
            </div>
            <a routerLink="/open-account" class="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-center font-bold text-xs block transition shadow-sm">
              Apply Now &rarr;
            </a>
          </div>

          <!-- Product 2: Prime Auto Financing -->
          <div class="obsidian-card p-6 bg-white flex flex-col justify-between space-y-6">
            <div class="space-y-4">
              <div class="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-2xl font-bold">
                🚗
              </div>
              <div>
                <span class="text-xs font-bold text-cyan-600 uppercase tracking-wider">Vehicle</span>
                <h3 class="text-xl font-bold text-slate-900">Auto Financing</h3>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Competitive dealer-independent auto financing for new and certified pre-owned vehicles.
              </p>
              <div class="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div class="flex justify-between">
                  <span class="text-slate-500">Fixed APR:</span>
                  <strong class="font-tabular text-emerald-600 font-bold">From 4.80%</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Borrow:</span>
                  <strong class="font-tabular text-slate-900">Up to &#36;100,000</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Term:</span>
                  <strong class="text-slate-900">2 to 6 Years</strong>
                </div>
              </div>
            </div>
            <a routerLink="/open-account" class="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-center font-bold text-xs block transition shadow-sm">
              Apply Now &rarr;
            </a>
          </div>

          <!-- Product 3: Prime Home Mortgage -->
          <div class="obsidian-card p-6 bg-white flex flex-col justify-between space-y-6 border-2 border-emerald-500/30 relative">
            <div class="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider">
              Most Popular
            </div>
            <div class="space-y-4">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">
                🏡
              </div>
              <div>
                <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider">Residential</span>
                <h3 class="text-xl font-bold text-slate-900">Home Mortgage</h3>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Purchase your primary residence or refinance existing loans with fixed monthly payments.
              </p>
              <div class="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div class="flex justify-between">
                  <span class="text-slate-500">Fixed APR:</span>
                  <strong class="font-tabular text-emerald-600 font-bold">From 4.20%</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Borrow:</span>
                  <strong class="font-tabular text-slate-900">Up to &#36;1,500,000</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Term:</span>
                  <strong class="text-slate-900">10 to 30 Years</strong>
                </div>
              </div>
            </div>
            <a routerLink="/calculator" class="w-full py-2.5 rounded-xl btn-gradient-mountain text-white text-center font-bold text-xs block shadow-sm">
              Calculate &amp; Apply &rarr;
            </a>
          </div>

          <!-- Product 4: Commercial Expansion Bridge -->
          <div class="obsidian-card p-6 bg-white flex flex-col justify-between space-y-6">
            <div class="space-y-4">
              <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold">
                🏢
              </div>
              <div>
                <span class="text-xs font-bold text-amber-600 uppercase tracking-wider">Business</span>
                <h3 class="text-xl font-bold text-slate-900">Commercial Term</h3>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Working capital and equipment financing for expanding enterprises and institutional clients.
              </p>
              <div class="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div class="flex justify-between">
                  <span class="text-slate-500">Fixed APR:</span>
                  <strong class="font-tabular text-emerald-600 font-bold">From 6.10%</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Borrow:</span>
                  <strong class="font-tabular text-slate-900">Up to &#36;3,000,000</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Term:</span>
                  <strong class="text-slate-900">1 to 10 Years</strong>
                </div>
              </div>
            </div>
            <a routerLink="/contact" class="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-center font-bold text-xs block transition shadow-sm">
              Contact Treasury &rarr;
            </a>
          </div>

        </div>
      </section>

      <!-- INTERACTIVE ESTIMATOR -->
      <section class="max-w-7xl mx-auto px-5 sm:px-8 py-12">
        <div class="obsidian-card p-8 sm:p-12 bg-white rounded-3xl border border-slate-200/90 shadow-xl">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div class="lg:col-span-7 space-y-6">
              <span class="px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wider">
                Quick Estimator
              </span>
              <h3 class="text-2xl sm:text-3xl font-black text-slate-900">
                Estimate your monthly payment right now
              </h3>
              <p class="text-sm text-slate-600">
                Adjust the sliders below to see estimated monthly payments for a personal or auto loan.
              </p>

              <!-- Sliders -->
              <div class="space-y-6 pt-4">
                <div class="space-y-2">
                  <div class="flex justify-between items-center text-sm">
                    <span class="font-bold text-slate-700">Loan Amount:</span>
                    <strong class="text-2xl font-black text-cyan-700 font-tabular">&#36;{{ loanAmount | number }}</strong>
                  </div>
                  <input type="range" min="2000" max="75000" step="1000"
                         [(ngModel)]="loanAmount" (ngModelChange)="recalc()"
                         class="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-cyan-600">
                  <div class="flex justify-between text-xs text-slate-400">
                    <span>&#36;2,000</span>
                    <span>&#36;35,000</span>
                    <span>&#36;75,000</span>
                  </div>
                </div>

                <div class="space-y-2">
                  <div class="flex justify-between items-center text-sm">
                    <span class="font-bold text-slate-700">Repayment Period:</span>
                    <strong class="text-xl font-black text-slate-900 font-tabular">{{ loanYears }} Years ({{ loanYears * 12 }} Mo)</strong>
                  </div>
                  <input type="range" min="1" max="6" step="1"
                         [(ngModel)]="loanYears" (ngModelChange)="recalc()"
                         class="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900">
                  <div class="flex justify-between text-xs text-slate-400">
                    <span>1 Year</span>
                    <span>3 Years</span>
                    <span>6 Years</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estimated Monthly Output -->
            <div class="lg:col-span-5 rounded-3xl p-8 bg-gradient-to-br from-[#003432] via-[#002625] to-slate-900 text-white shadow-2xl space-y-6">
              <div>
                <span class="text-xs uppercase tracking-wider text-[#0BB4D2] font-bold block mb-1">Estimated Monthly Cost</span>
                <div class="text-4xl sm:text-5xl font-black text-white font-tabular">
                  &#36;{{ monthlyInstallment | number:'1.2-2' }}<span class="text-xs text-slate-400 font-normal">/mo</span>
                </div>
              </div>

              <div class="space-y-3 pt-4 border-t border-white/10 text-xs">
                <div class="flex justify-between text-slate-300">
                  <span>Interest rate (APR):</span>
                  <strong class="font-tabular text-white font-semibold">5.25% Fixed</strong>
                </div>
                <div class="flex justify-between text-slate-300">
                  <span>Total repayable:</span>
                  <strong class="font-tabular text-emerald-400 font-bold text-sm">&#36;{{ totalRepayment | number:'1.2-2' }}</strong>
                </div>
              </div>

              <div class="pt-2">
                <a routerLink="/calculator" class="w-full py-3.5 rounded-xl btn-gradient-mountain text-center font-bold block text-xs shadow-md">
                  View Full Amortization Schedule &rarr;
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- 3-STEP PROCESS -->
      <section class="max-w-7xl mx-auto px-5 sm:px-8 py-20 border-t border-slate-200/80">
        <div class="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Fast &amp; Simple
          </span>
          <h2 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How our loan approval works
          </h2>
          <p class="text-sm sm:text-base text-slate-600">
            No endless paperwork or branch visits. Apply online in three transparent steps.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div class="obsidian-card p-8 bg-white space-y-4">
            <div class="w-10 h-10 rounded-xl bg-slate-900 text-white font-black flex items-center justify-center text-sm">
              1
            </div>
            <h3 class="text-lg font-bold text-slate-900">Check your rate</h3>
            <p class="text-xs text-slate-600 leading-relaxed">
              Complete our 2-minute online check. We run a soft credit check that will not affect your credit score.
            </p>
          </div>

          <div class="obsidian-card p-8 bg-white space-y-4">
            <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm">
              2
            </div>
            <h3 class="text-lg font-bold text-slate-900">Verify your details</h3>
            <p class="text-xs text-slate-600 leading-relaxed">
              Upload your proof of income and government photo ID directly through our encrypted customer portal.
            </p>
          </div>

          <div class="obsidian-card p-8 bg-white space-y-4">
            <div class="w-10 h-10 rounded-xl bg-cyan-600 text-white font-black flex items-center justify-center text-sm">
              3
            </div>
            <h3 class="text-lg font-bold text-slate-900">Same-day funding</h3>
            <p class="text-xs text-slate-600 leading-relaxed">
              Once approved, funds are deposited directly into your Obsidian Trust Bancorp checking account within 24 business hours.
            </p>
          </div>

        </div>
      </section>

      <!-- FREQUENTLY ASKED QUESTIONS -->
      <section class="max-w-4xl mx-auto px-5 sm:px-8 py-16 border-t border-slate-200/80">
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 text-center mb-10 tracking-tight">
          Borrowing Questions &amp; Answers
        </h2>

        <div class="space-y-4">
          <div class="obsidian-card p-6 bg-white space-y-2">
            <h4 class="font-bold text-slate-900 text-sm">Can I pay off my loan early without penalty?</h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              Yes, absolutely. Obsidian Trust Bancorp never charges prepayment or early termination fees. Pay off all or part of your balance anytime to save on interest.
            </p>
          </div>

          <div class="obsidian-card p-6 bg-white space-y-2">
            <h4 class="font-bold text-slate-900 text-sm">Will checking my rate affect my credit score?</h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              No. When you submit an initial estimate, we perform a soft inquiry that is invisible to other lenders and has zero impact on your credit rating.
            </p>
          </div>

          <div class="obsidian-card p-6 bg-white space-y-2">
            <h4 class="font-bold text-slate-900 text-sm">Are rates fixed or variable?</h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              All personal, auto, and home loans feature fully locked fixed interest rates. Your monthly payment remains identical from day one through the final installment.
            </p>
          </div>
        </div>
      </section>

    </div>
  `
})
export class LoansComponent {
  loanAmount: number = 25000;
  loanYears: number = 3;
  monthlyInstallment: number = 0;
  totalRepayment: number = 0;

  constructor() {
    this.recalc();
  }

  recalc(): void {
    const P = this.loanAmount;
    const n = this.loanYears * 12;
    const r = (5.25 / 100) / 12;

    this.monthlyInstallment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    this.totalRepayment = this.monthlyInstallment * n;
  }
}
