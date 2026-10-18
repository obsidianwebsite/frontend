import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checking',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      
      <!-- HERO BANNER -->
      <section class="relative bg-slate-950 text-white py-16 sm:py-24 px-5 sm:px-8 border-b border-slate-800 overflow-hidden">
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-5xl mx-auto text-center space-y-5 relative z-10">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-xs">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="font-bold text-emerald-400">Zero Monthly Maintenance Fees</span>
            <span class="text-slate-600">&bull;</span>
            <span>FDIC Insured Up to $250,000</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Checking accounts designed for 
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              effortless daily living.
            </span>
          </h1>

          <p class="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            No minimum balances, no maintenance fees, and instant access to over 55,000 surcharge-free ATMs nationwide. Open your account online in under 3 minutes.
          </p>

          <div class="pt-2 flex flex-wrap justify-center items-center gap-4">
            <a routerLink="/open-account" 
               class="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-950/60 transition transform hover:-translate-y-0.5">
              Open a Checking Account
            </a>
            <a routerLink="/login" 
               class="px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm sm:text-base transition">
              Sign In to Your Account &rarr;
            </a>
          </div>
        </div>
      </section>

      <!-- 3 TIER CHECKING COMPARISON -->
      <section class="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest">Choose Your Plan</span>
          <h2 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Three simple ways to bank with VaultAtlantic
          </h2>
          <p class="text-slate-600 text-sm sm:text-base">
            Whether you need simple everyday debit, international multi-currency tools, or bespoke corporate treasury accounts.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          <!-- Tier 1: Everyday Checking -->
          <div class="obsidian-card p-8 rounded-3xl bg-white border border-slate-200 shadow-lg flex flex-col justify-between space-y-8">
            <div class="space-y-4">
              <span class="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700">
                Most Popular
              </span>
              <h3 class="text-2xl font-black text-slate-900">Everyday Checking</h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                Ideal for personal budgeting, recurring bill payments, direct deposits, and daily contactless spending.
              </p>
              
              <div class="pt-4 border-t border-slate-100">
                <span class="text-4xl font-black text-slate-900 font-tabular">&#36;0</span>
                <span class="text-xs text-slate-400 font-medium"> / month</span>
                <div class="text-[11px] text-emerald-600 font-bold mt-1">No minimum balance requirement</div>
              </div>

              <ul class="space-y-3 text-xs text-slate-700 pt-2">
                <li class="flex items-center gap-2.5">
                  <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                  <span>Contactless Visa Debit Card</span>
                </li>
                <li class="flex items-center gap-2.5">
                  <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                  <span>55,000+ Surcharge-Free ATMs</span>
                </li>
                <li class="flex items-center gap-2.5">
                  <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                  <span>Direct Deposit up to 2 days early</span>
                </li>
                <li class="flex items-center gap-2.5">
                  <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                  <span>Instant 1-click card freeze from mobile</span>
                </li>
              </ul>
            </div>

            <a routerLink="/open-account" 
               class="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-center font-bold text-xs transition shadow-sm">
              Open Everyday Checking
            </a>
          </div>

          <!-- Tier 2: Premier Horizon Checking (Featured) -->
          <div class="obsidian-card p-8 rounded-3xl bg-slate-950 text-white border-2 border-emerald-500 shadow-2xl relative flex flex-col justify-between space-y-8 transform md:-translate-y-2">
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-md">
              Best for Global Mobility
            </div>

            <div class="space-y-4">
              <span class="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-700/60">
                Multi-Currency
              </span>
              <h3 class="text-2xl font-black text-white">Premier Horizon</h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                For individuals and frequent travelers managing USD, EUR, GBP, and global foreign exchange with zero markups.
              </p>
              
              <div class="pt-4 border-t border-slate-800">
                <span class="text-4xl font-black text-white font-tabular">&#36;0</span>
                <span class="text-xs text-slate-400 font-medium"> / month</span>
                <div class="text-[11px] text-cyan-400 font-bold mt-1">Free with direct deposit or $2k balance</div>
              </div>

              <ul class="space-y-3 text-xs text-slate-300 pt-2">
                <li class="flex items-center gap-2.5">
                  <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                  <span>Everything in Everyday Checking</span>
                </li>
                <li class="flex items-center gap-2.5">
                  <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                  <span>4 Global Currency Wallets (USD, EUR, GBP, CAD)</span>
                </li>
                <li class="flex items-center gap-2.5">
                  <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                  <span>Zero Foreign Transaction Fees worldwide</span>
                </li>
                <li class="flex items-center gap-2.5">
                  <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                  <span>Free Outgoing Domestic Wire Transfers</span>
                </li>
              </ul>
            </div>

            <a routerLink="/open-account" 
               class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-center font-bold text-xs transition shadow-lg shadow-emerald-950/60">
              Open Premier Horizon
            </a>
          </div>

          <!-- Tier 3: Corporate Treasury Checking -->
          <div class="obsidian-card p-8 rounded-3xl bg-white border border-slate-200 shadow-lg flex flex-col justify-between space-y-8">
            <div class="space-y-4">
              <span class="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                Enterprises &amp; LLCs
              </span>
              <h3 class="text-2xl font-black text-slate-900">Corporate Vault</h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                Full-spectrum commercial business checking with multi-user permissions, payroll batch dispatch, and SWIFT wires.
              </p>
              
              <div class="pt-4 border-t border-slate-100">
                <span class="text-4xl font-black text-slate-900 font-tabular">&#36;0</span>
                <span class="text-xs text-slate-400 font-medium"> / month</span>
                <div class="text-[11px] text-purple-700 font-bold mt-1">High-volume clearance included</div>
              </div>

              <ul class="space-y-3 text-xs text-slate-700 pt-2">
                <li class="flex items-center gap-2.5">
                  <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                  <span>Unlimited Domestic ACH and FedWire</span>
                </li>
                <li class="flex items-center gap-2.5">
                  <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                  <span>Up to 10 Physical &amp; 50 Virtual Employee Cards</span>
                </li>
                <li class="flex items-center gap-2.5">
                  <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                  <span>Multi-User Role Permissions &amp; Audit Logs</span>
                </li>
                <li class="flex items-center gap-2.5">
                  <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                  <span>Dedicated Relationship Banker</span>
                </li>
              </ul>
            </div>

            <a routerLink="/open-account" 
               class="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-center font-bold text-xs transition shadow-sm">
              Open Corporate Vault
            </a>
          </div>

        </div>
      </section>

      <!-- FEATURE STORY SPLIT -->
      <section class="bg-slate-50 py-20 border-t border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-5 sm:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div class="rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <img src="https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1000&q=80" 
                   alt="Modern cafe contactless payment with VaultAtlantic Visa debit card" 
                   class="w-full h-[440px] object-cover">
            </div>

            <div class="space-y-6">
              <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest">Modern Experience</span>
              <h2 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Smart banking controls right from your phone.
              </h2>
              <p class="text-base text-slate-600 leading-relaxed">
                Enjoy complete peace of mind. Every VaultAtlantic checking account gives you instant transaction notifications, the ability to lock and freeze your card instantly, and zero liability fraud protection.
              </p>

              <div class="space-y-4 text-xs sm:text-sm text-slate-700">
                <div class="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
                  <div class="text-xl">⚡</div>
                  <div>
                    <strong class="text-slate-900 block font-bold">Real-time Push Notifications</strong>
                    <span class="text-slate-500">Know the second a charge, deposit, or wire settles into your account.</span>
                  </div>
                </div>

                <div class="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
                  <div class="text-xl">🔒</div>
                  <div>
                    <strong class="text-slate-900 block font-bold">1-Click Card Freezing</strong>
                    <span class="text-slate-500">Misplaced your wallet? Freeze your card in one tap and unfreeze it just as easily when found.</span>
                  </div>
                </div>

                <div class="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
                  <div class="text-xl">🛡️</div>
                  <div>
                    <strong class="text-slate-900 block font-bold">FDIC Insured up to $250,000</strong>
                    <span class="text-slate-500">Your deposits are backed by the full faith and credit of the United States Government.</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      <!-- CALL TO ACTION STRIP -->
      <section class="py-20 bg-slate-950 text-white text-center">
        <div class="max-w-3xl mx-auto px-5 sm:px-8 space-y-6">
          <h2 class="text-3xl sm:text-4xl font-black tracking-tight">Ready for a better checking experience?</h2>
          <p class="text-slate-400 text-sm sm:text-base">
            Open your account online in 3 minutes. Zero minimum deposit required to get started.
          </p>
          <div class="pt-2">
            <a routerLink="/open-account" 
               class="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base shadow-xl transition inline-block">
              Open Your Free Account Today
            </a>
          </div>
        </div>
      </section>

    </div>
  `
})
export class CheckingComponent {}
