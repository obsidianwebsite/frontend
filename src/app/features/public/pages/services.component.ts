import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div>
      <!-- Header with Architecture Photography -->
      <section class="relative bg-[#003432] text-white py-16 px-4 sm:px-8 border-b border-[#002625] overflow-hidden">
        <div class="absolute inset-0 z-0 opacity-15 bg-cover bg-center"
             style="background-image: url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80');">
        </div>
        <div class="relative z-10 max-w-4xl mx-auto text-center space-y-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0BB4D2]/20 text-[#0BB4D2] border border-[#0BB4D2]/40 backdrop-blur-sm">
            <span>💳</span>
            <span>Accounts &amp; Solutions</span>
          </span>
          <h1 class="text-3xl sm:text-5xl font-black tracking-tight">Accounts &amp; Banking Services</h1>
          <p class="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-normal">
            Everyday checking, transparent loans, and high-interest savings designed around your life and business.
          </p>
        </div>
      </section>

      <!-- Services List -->
      <section class="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20 space-y-20">
        
        <!-- 1. Checking Accounts -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div class="lg:col-span-6 space-y-5">
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider">
              <span>⚡</span> Everyday Banking
            </span>
            <h2 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Smart Checking Accounts
            </h2>
            <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
              Experience modern banking without surprises. Send and receive money worldwide in seconds, hold multiple currencies under one roof, and spend with a sleek Visa Debit card accepted anywhere.
            </p>
            <ul class="space-y-3 text-xs sm:text-sm text-slate-700">
              <li class="flex items-center gap-2.5">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span>Multi-currency wallets: Hold and switch between USD, GBP, EUR, and NGN</span>
              </li>
              <li class="flex items-center gap-2.5">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span>Fast local and international wire transfers with tracking</span>
              </li>
              <li class="flex items-center gap-2.5">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span>Instant virtual and physical cards with 1-click lock and freeze</span>
              </li>
            </ul>
            <div class="pt-2">
              <a routerLink="/open-account" class="btn-gradient-mountain px-6 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2 shadow-lg">
                <span>Open a Checking Account</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>

          <div class="lg:col-span-6 relative">
            <div class="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-[4/3] group">
              <img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80" 
                   alt="Modern checking account and mobile payments" 
                   class="w-full h-full object-cover group-hover:scale-105 transition duration-700">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              
              <div class="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-lg flex items-center justify-between">
                <div>
                  <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Zero Monthly Fees</span>
                  <span class="text-xs sm:text-sm font-bold text-slate-900">Minimum balance requirement: <span>$</span>0.00</span>
                </div>
                <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  Instant Access
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Personal & Car Loans -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pt-10 border-t border-slate-200">
          <div class="lg:col-span-6 order-2 lg:order-1 relative">
            <div class="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-[4/3] group">
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80" 
                   alt="Car loans and home mortgages" 
                   class="w-full h-full object-cover group-hover:scale-105 transition duration-700">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

              <div class="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-lg flex items-center justify-between">
                <div>
                  <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Fixed Rates From</span>
                  <span class="text-sm font-bold text-slate-900">4.50% APR &bull; Up to 7-year terms</span>
                </div>
                <span class="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                  Quick Approval
                </span>
              </div>
            </div>
          </div>

          <div class="lg:col-span-6 space-y-5 order-1 lg:order-2">
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold uppercase tracking-wider">
              <span>🚗</span> Transparent Borrowing
            </span>
            <h2 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Car Loans &amp; Mortgages
            </h2>
            <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
              Whether you're purchasing a new vehicle, expanding your business, or buying a home, our flexible credit lines offer low fixed interest rates with no hidden fees or early repayment penalties.
            </p>
            <ul class="space-y-3 text-xs sm:text-sm text-slate-700">
              <li class="flex items-center gap-2.5">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span>Borrow from &pound;1,000 to &pound;50,000 with predictable monthly payments</span>
              </li>
              <li class="flex items-center gap-2.5">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span>Instant loan calculator to test monthly payments before applying</span>
              </li>
              <li class="flex items-center gap-2.5">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span>Fast review and same-day direct account funding upon approval</span>
              </li>
            </ul>
            <div class="pt-2 flex flex-wrap items-center gap-4">
              <a routerLink="/calculator" class="btn-gradient-mountain px-6 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2 shadow-lg">
                <span>Try Loan Calculator</span>
                <span>&rarr;</span>
              </a>
              <a routerLink="/open-account" class="text-sm font-bold text-slate-700 hover:text-cyan-700 underline underline-offset-4">
                Apply for a Loan
              </a>
            </div>
          </div>
        </div>

        <!-- 3. High-Yield Savings & Deposits -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pt-10 border-t border-slate-200">
          <div class="lg:col-span-6 space-y-5">
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <span>📈</span> Wealth Growth
            </span>
            <h2 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              High-Yield Savings &amp; Fixed Deposits
            </h2>
            <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
              Grow your money faster with our high-interest savings accounts and fixed term deposits. Lock in guaranteed returns with flexible payout schedules and zero market risk.
            </p>
            <ul class="space-y-3 text-xs sm:text-sm text-slate-700">
              <li class="flex items-center gap-2.5">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span>Guaranteed interest rates up to 5.85% AER</span>
              </li>
              <li class="flex items-center gap-2.5">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span>Flexible terms: 3, 6, 12, or 24-month fixed maturities</span>
              </li>
              <li class="flex items-center gap-2.5">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span>Choose monthly interest payouts or compounded growth at maturity</span>
              </li>
            </ul>
            <div class="pt-2">
              <a routerLink="/open-account" class="theme_btn text-xs font-bold inline-flex items-center gap-2">
                <span>Start a Savings Account</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>

          <div class="lg:col-span-6 relative">
            <div class="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-[4/3] group">
              <img src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1000&q=80" 
                   alt="High yield savings and investment growth" 
                   class="w-full h-full object-cover group-hover:scale-105 transition duration-700">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

              <div class="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-lg">
                <div class="grid grid-cols-3 gap-2 text-center">
                  <div class="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span class="text-[10px] text-slate-500 font-bold block uppercase">3 Months</span>
                    <span class="text-sm font-black text-emerald-600">4.20%</span>
                  </div>
                  <div class="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span class="text-[10px] text-slate-500 font-bold block uppercase">12 Months</span>
                    <span class="text-sm font-black text-emerald-600">5.45%</span>
                  </div>
                  <div class="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span class="text-[10px] text-emerald-800 font-bold block uppercase">24 Months</span>
                    <span class="text-sm font-black text-emerald-700">5.85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  `
})
export class ServicesComponent {}
