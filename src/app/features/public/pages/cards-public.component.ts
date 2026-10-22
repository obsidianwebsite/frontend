import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-cards',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="font-sans text-slate-800 antialiased selection:bg-cyan-500 selection:text-white">
      
      <!-- HERO BANNER -->
      <section class="relative bg-slate-950 text-white py-16 sm:py-24 px-5 sm:px-8 border-b border-slate-800 overflow-hidden">
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-5xl mx-auto text-center space-y-5 relative z-10">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-xs">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span class="font-bold text-cyan-400">Precision Crafted Metal &amp; Virtual Cards</span>
            <span class="text-slate-600">&bull;</span>
            <span>Worldwide Visa &amp; Mastercard Network</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Cards engineered for 
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              effortless global spending.
            </span>
          </h1>

          <p class="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Zero foreign transaction fees, instant Apple Pay &amp; Google Wallet setup, and total control from your phone. Choose the tier tailored to your lifestyle.
          </p>

          <div class="pt-2 flex flex-wrap justify-center items-center gap-4">
            <a routerLink="/open-account" 
               class="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#003432] to-[#0BB4D2] hover:opacity-95 text-white font-bold text-sm sm:text-base shadow-xl shadow-teal-950/40 transition transform hover:-translate-y-0.5">
              Order Your Obsidian Trust Bancorp Card
            </a>
            <a routerLink="/login" 
               class="px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm sm:text-base transition">
              Cardholder Sign In &rarr;
            </a>
          </div>
        </div>
      </section>

      <!-- INTERACTIVE 4-TIER SHOWCASE -->
      <section class="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        
        <div class="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span class="text-xs font-bold text-cyan-600 uppercase tracking-widest">Card Collection</span>
          <h2 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Choose your signature payment credential
          </h2>
          <p class="text-slate-600 text-sm">
            From zero-fee daily debit to solid Vault Black metal cards with global airport lounge access.
          </p>
        </div>

        <!-- 4 Card Tier Selector Tabs -->
        <div class="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-100 max-w-xl mx-auto mb-16 shadow-xs">
          <button (click)="activeTier.set('STANDARD')"
                  [ngClass]="activeTier() === 'STANDARD' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
                  class="px-4 py-2 rounded-xl text-xs font-bold transition">
            Sapphire Standard
          </button>
          <button (click)="activeTier.set('GOLD')"
                  [ngClass]="activeTier() === 'GOLD' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
                  class="px-4 py-2 rounded-xl text-xs font-bold transition">
            Gold Executive
          </button>
          <button (click)="activeTier.set('PLATINUM')"
                  [ngClass]="activeTier() === 'PLATINUM' ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
                  class="px-4 py-2 rounded-xl text-xs font-bold transition">
            Platinum Prestige
          </button>
          <button (click)="activeTier.set('BLACK')"
                  [ngClass]="activeTier() === 'BLACK' ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'"
                  class="px-4 py-2 rounded-xl text-xs font-bold transition">
            Vault Black Metal
          </button>
        </div>

        <!-- Active Card Spotlight Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Realistic Metallic Card Display (Left 6 Cols) -->
          <div class="lg:col-span-6 flex justify-center">
            
            @if (activeTier() === 'BLACK') {
              <div class="w-full max-w-md h-64 sm:h-72 rounded-3xl p-7 card-metal-dark text-white shadow-2xl border border-slate-700 relative overflow-hidden flex flex-col justify-between animate-fade-in">
                <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-cyan-500/20 rounded-full blur-2xl"></div>
                <div class="flex items-center justify-between relative z-10">
                  <span class="text-xs font-black tracking-widest text-[#0BB4D2]">OBSIDIANTRUSTBANCORP BANK</span>
                  <span class="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-white/10 border border-white/20">BLACK METAL</span>
                </div>
                <div class="w-12 h-9 rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 border border-slate-500/50 relative z-10"></div>
                <div class="text-xl sm:text-2xl font-mono tracking-widest text-white font-bold relative z-10">
                  •••• •••• •••• 9901
                </div>
                <div class="flex items-end justify-between text-xs relative z-10 border-t border-white/10 pt-3">
                  <div>
                    <span class="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Cardholder</span>
                    <strong class="uppercase text-white tracking-wide">Alexander Vance</strong>
                  </div>
                  <div>
                    <span class="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Expires</span>
                    <strong class="font-mono text-white">12/29</strong>
                  </div>
                  <div class="font-black italic text-lg text-white">VISA INFINITE</div>
                </div>
              </div>
            }

            @if (activeTier() === 'PLATINUM') {
              <div class="w-full max-w-md h-64 sm:h-72 rounded-3xl p-7 card-metal-cyan text-white shadow-2xl border border-cyan-400/30 relative overflow-hidden flex flex-col justify-between animate-fade-in">
                <div class="flex items-center justify-between relative z-10">
                  <span class="text-xs font-black tracking-widest text-white">OBSIDIANTRUSTBANCORP</span>
                  <span class="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-white/20 border border-white/30">PLATINUM PRESTIGE</span>
                </div>
                <div class="w-12 h-9 rounded-lg bg-gradient-to-br from-amber-200 to-amber-400 border border-amber-600/40 relative z-10"></div>
                <div class="text-xl sm:text-2xl font-mono tracking-widest text-white font-bold relative z-10">
                  •••• •••• •••• 7412
                </div>
                <div class="flex items-end justify-between text-xs relative z-10 border-t border-white/20 pt-3">
                  <div>
                    <span class="text-[9px] uppercase tracking-wider text-cyan-100 block font-semibold">Cardholder</span>
                    <strong class="uppercase text-white tracking-wide">Alexander Vance</strong>
                  </div>
                  <div>
                    <span class="text-[9px] uppercase tracking-wider text-cyan-100 block font-semibold">Expires</span>
                    <strong class="font-mono text-white">09/28</strong>
                  </div>
                  <div class="font-black italic text-lg text-white">MASTERCARD WORLD</div>
                </div>
              </div>
            }

            @if (activeTier() === 'GOLD') {
              <div class="w-full max-w-md h-64 sm:h-72 rounded-3xl p-7 card-metal-gold text-white shadow-2xl border border-amber-400/40 relative overflow-hidden flex flex-col justify-between animate-fade-in">
                <div class="flex items-center justify-between relative z-10">
                  <span class="text-xs font-black tracking-widest text-amber-200">OBSIDIANTRUSTBANCORP</span>
                  <span class="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-black/20 border border-white/20">GOLD EXECUTIVE</span>
                </div>
                <div class="w-12 h-9 rounded-lg bg-gradient-to-br from-amber-200 to-amber-500 border border-amber-700/50 relative z-10"></div>
                <div class="text-xl sm:text-2xl font-mono tracking-widest text-amber-100 font-bold relative z-10">
                  •••• •••• •••• 5543
                </div>
                <div class="flex items-end justify-between text-xs relative z-10 border-t border-white/20 pt-3">
                  <div>
                    <span class="text-[9px] uppercase tracking-wider text-amber-200 block font-semibold">Cardholder</span>
                    <strong class="uppercase text-white tracking-wide">Alexander Vance</strong>
                  </div>
                  <div>
                    <span class="text-[9px] uppercase tracking-wider text-amber-200 block font-semibold">Expires</span>
                    <strong class="font-mono text-white">05/27</strong>
                  </div>
                  <div class="font-black italic text-lg text-white">VISA SIGNATURE</div>
                </div>
              </div>
            }

            @if (activeTier() === 'STANDARD') {
              <div class="w-full max-w-md h-64 sm:h-72 rounded-3xl p-7 card-metal-emerald text-white shadow-2xl border border-emerald-400/30 relative overflow-hidden flex flex-col justify-between animate-fade-in">
                <div class="flex items-center justify-between relative z-10">
                  <span class="text-xs font-black tracking-widest text-emerald-200">OBSIDIANTRUSTBANCORP</span>
                  <span class="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-white/10 border border-white/20">SAPPHIRE DEBIT</span>
                </div>
                <div class="w-12 h-9 rounded-lg bg-gradient-to-br from-amber-200 to-amber-400 border border-amber-600/40 relative z-10"></div>
                <div class="text-xl sm:text-2xl font-mono tracking-widest text-white font-bold relative z-10">
                  •••• •••• •••• 4242
                </div>
                <div class="flex items-end justify-between text-xs relative z-10 border-t border-white/20 pt-3">
                  <div>
                    <span class="text-[9px] uppercase tracking-wider text-emerald-100 block font-semibold">Cardholder</span>
                    <strong class="uppercase text-white tracking-wide">Alexander Vance</strong>
                  </div>
                  <div>
                    <span class="text-[9px] uppercase tracking-wider text-emerald-100 block font-semibold">Expires</span>
                    <strong class="font-mono text-white">10/27</strong>
                  </div>
                  <div class="font-black italic text-lg text-white">VISA DEBIT</div>
                </div>
              </div>
            }

          </div>

          <!-- Tier Details & Perks (Right 6 Cols) -->
          <div class="lg:col-span-6 space-y-6">
            
            @if (activeTier() === 'BLACK') {
              <div class="space-y-4">
                <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">Ultra-High Net Worth Tier</span>
                <h3 class="text-3xl font-black text-slate-900">Vault Black Metal</h3>
                <p class="text-sm text-slate-600 leading-relaxed">
                  Crafted from 18 grams of blackened tungsten steel. Includes bespoke private underwriting, unlimited worldwide airport lounge access, and a dedicated 24/7 personal executive concierge.
                </p>
                <div class="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between text-xs">
                  <div>
                    <span class="text-slate-400 block text-[10px] uppercase font-bold">Daily Spending Limit</span>
                    <strong class="text-cyan-400 text-lg font-tabular">&#36;100,000.00</strong>
                  </div>
                  <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[10px]">
                    BY INVITATION / TIER 1
                  </span>
                </div>
              </div>
            }

            @if (activeTier() === 'PLATINUM') {
              <div class="space-y-4">
                <span class="text-xs font-bold text-cyan-600 uppercase tracking-widest">Global Travel Prestige</span>
                <h3 class="text-3xl font-black text-slate-900">Platinum Prestige</h3>
                <p class="text-sm text-slate-600 leading-relaxed">
                  The ultimate travel card for global professionals. 3% cash back on flights and hotels, complimentary Priority Pass airport lounge access, and automatic comprehensive travel medical insurance.
                </p>
                <div class="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-950 flex items-center justify-between text-xs">
                  <div>
                    <span class="text-cyan-700 block text-[10px] uppercase font-bold">Daily Spending Limit</span>
                    <strong class="text-cyan-900 text-lg font-tabular">&#36;50,000.00</strong>
                  </div>
                  <span class="px-3 py-1 rounded-full bg-white text-cyan-800 border border-cyan-300 font-bold text-[10px]">
                    PRESTIGE TIER
                  </span>
                </div>
              </div>
            }

            @if (activeTier() === 'GOLD') {
              <div class="space-y-4">
                <span class="text-xs font-bold text-amber-600 uppercase tracking-widest">Executive Rewards</span>
                <h3 class="text-3xl font-black text-slate-900">Gold Executive</h3>
                <p class="text-sm text-slate-600 leading-relaxed">
                  Optimized for business dining and entertainment. 2% cash back on groceries, dining, and transit. Includes zero foreign transaction fees and extended purchase warranty protection.
                </p>
                <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between text-xs">
                  <div>
                    <span class="text-amber-700 block text-[10px] uppercase font-bold">Daily Spending Limit</span>
                    <strong class="text-amber-900 text-lg font-tabular">&#36;25,000.00</strong>
                  </div>
                  <span class="px-3 py-1 rounded-full bg-white text-amber-800 border border-amber-300 font-bold text-[10px]">
                    EXECUTIVE TIER
                  </span>
                </div>
              </div>
            }

            @if (activeTier() === 'STANDARD') {
              <div class="space-y-4">
                <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest">Everyday Smart Banking</span>
                <h3 class="text-3xl font-black text-slate-900">Sapphire Debit</h3>
                <p class="text-sm text-slate-600 leading-relaxed">
                  The standard card included free with all Obsidian Trust Bancorp checking accounts. Contactless NFC payments, instant Apple Pay integration, and access to over 55,000 free ATMs nationwide.
                </p>
                <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between text-xs">
                  <div>
                    <span class="text-emerald-700 block text-[10px] uppercase font-bold">Daily Spending Limit</span>
                    <strong class="text-emerald-900 text-lg font-tabular">&#36;10,000.00</strong>
                  </div>
                  <span class="px-3 py-1 rounded-full bg-white text-emerald-800 border border-emerald-300 font-bold text-[10px]">
                    &#36;0 ANNUAL FEE
                  </span>
                </div>
              </div>
            }

            <!-- Universal Features Checklist -->
            <ul class="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-200">
              <li class="flex items-center gap-2">
                <span class="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">✓</span>
                <span>Zero Foreign Transaction Fees worldwide</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">✓</span>
                <span>Instant Apple Pay &amp; Google Wallet virtual card generation</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">✓</span>
                <span>Real-time push alerts and 1-click mobile freeze</span>
              </li>
            </ul>

            <div class="pt-2">
              <a routerLink="/open-account" 
                 class="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-md inline-block">
                Apply for this Card &rarr;
              </a>
            </div>

          </div>

        </div>

      </section>

      <!-- CALL TO ACTION -->
      <section class="py-20 bg-slate-950 text-white text-center">
        <div class="max-w-3xl mx-auto px-5 sm:px-8 space-y-6">
          <h2 class="text-3xl sm:text-4xl font-black tracking-tight">Experience modern card technology.</h2>
          <p class="text-slate-400 text-sm sm:text-base">
            Apply online in 3 minutes. Start using your digital card immediately in Apple Pay and Google Wallet while your physical card is in transit.
          </p>
          <div class="pt-2">
            <a routerLink="/open-account" 
               class="px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm sm:text-base shadow-xl transition inline-block">
              Open an Account &amp; Order Card
            </a>
          </div>
        </div>
      </section>

    </div>
  `
})
export class PublicCardsComponent {
  activeTier = signal<'STANDARD' | 'GOLD' | 'PLATINUM' | 'BLACK'>('BLACK');
}
