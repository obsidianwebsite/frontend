import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      
      <!-- HERO BANNER -->
      <section class="relative bg-slate-950 text-white py-16 sm:py-24 px-5 sm:px-8 border-b border-slate-800 overflow-hidden">
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-5xl mx-auto text-center space-y-5 relative z-10">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-xs">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="font-bold text-emerald-400">SOC 2 Type II Certified &bull; Member FDIC</span>
            <span class="text-slate-600">&bull;</span>
            <span>256-Bit TLS Architecture</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Security built into 
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              every single transaction.
            </span>
          </h1>

          <p class="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Your deposits, personal data, and transactions are protected by military-grade encryption, continuous automated fraud surveillance, and federal deposit insurance.
          </p>

          <div class="pt-2 flex flex-wrap justify-center items-center gap-4">
            <a routerLink="/open-account" 
               class="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-950/60 transition transform hover:-translate-y-0.5">
              Open a Protected Account
            </a>
            <a routerLink="/contact" 
               class="px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm sm:text-base transition">
              Contact Security Desk &rarr;
            </a>
          </div>
        </div>
      </section>

      <!-- 4 SECURITY PILLARS -->
      <section class="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest">Our Guarantees</span>
          <h2 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Institutional protection at every level
          </h2>
          <p class="text-slate-600 text-sm">
            We adhere to the highest international banking compliance and cryptographic standards.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div class="space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl shadow-xs">
                🏛️
              </div>
              <h3 class="text-xl font-bold text-slate-900">FDIC Insurance</h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Deposits are insured up to $250,000 per depositor. Through our Insured Cash Sweep (ICS) network, corporate balances receive up to $2,500,000 in full federal protection.
              </p>
            </div>
            <div class="pt-3 border-t border-slate-100 text-[11px] font-bold text-emerald-700">
              Federal Reserve Member Bank
            </div>
          </div>

          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div class="space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-2xl shadow-xs">
                🔒
              </div>
              <h3 class="text-xl font-bold text-slate-900">256-Bit TLS Encryption</h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                All network transmissions and ledger states are encrypted end-to-end with AES-256 GCM cryptographic ciphers, the same standard used by central banks and intelligence agencies.
              </p>
            </div>
            <div class="pt-3 border-t border-slate-100 text-[11px] font-bold text-cyan-700">
              End-to-End Encrypted Tunnel
            </div>
          </div>

          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div class="space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl shadow-xs">
                🛡️
              </div>
              <h3 class="text-xl font-bold text-slate-900">Zero Liability Guarantee</h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                You are 100% protected against unauthorized card transactions, wire fraud, or identity compromise when reported promptly to our 24/7 dedicated fraud desk.
              </p>
            </div>
            <div class="pt-3 border-t border-slate-100 text-[11px] font-bold text-indigo-700">
              100% Fraud Reimbursement
            </div>
          </div>

          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div class="space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl shadow-xs">
                ⚡
              </div>
              <h3 class="text-xl font-bold text-slate-900">Biometric &amp; 2FA</h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Every sensitive transfer requires multi-stage biometric validation, time-based OTP codes, and dedicated authorization codes (COT / Tax / IMF) for wire settlement.
              </p>
            </div>
            <div class="pt-3 border-t border-slate-100 text-[11px] font-bold text-amber-700">
              Multi-Factor Authentication
            </div>
          </div>

        </div>
      </section>

      <!-- LIVE SECURITY NODE AUDIT -->
      <section class="bg-slate-50 py-16 border-t border-b border-slate-200">
        <div class="max-w-5xl mx-auto px-5 sm:px-8">
          <div class="p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span class="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">Global Security Infrastructure</span>
                <h3 class="text-xl font-black text-white mt-1">Obsidian Trust Bancorp Core Financial Node Status</h3>
              </div>
              <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 text-xs font-bold">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>All Systems Operational (99.99%)</span>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span class="text-slate-400 block text-[10px] uppercase font-bold">Core Node</span>
                <strong class="text-white font-mono">LHR-01 (London)</strong>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span class="text-slate-400 block text-[10px] uppercase font-bold">Cipher Protocol</span>
                <strong class="text-cyan-400 font-mono">TLS 1.3 / AES-256</strong>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span class="text-slate-400 block text-[10px] uppercase font-bold">Auditing Authority</span>
                <strong class="text-white font-mono">SOC 2 Type II</strong>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span class="text-slate-400 block text-[10px] uppercase font-bold">Data Redundancy</span>
                <strong class="text-emerald-400 font-mono">Tri-Zone Replicated</strong>
              </div>
            </div>

            <p class="text-[11px] text-slate-400 leading-relaxed pt-2">
              Continuous penetration testing, SOC 2 Type II controls, and automated transaction anomaly screening protect your capital around the clock.
            </p>
          </div>
        </div>
      </section>

      <!-- CALL TO ACTION -->
      <section class="py-20 bg-slate-950 text-white text-center">
        <div class="max-w-3xl mx-auto px-5 sm:px-8 space-y-6">
          <h2 class="text-3xl sm:text-4xl font-black tracking-tight">Your money is safe with Obsidian Trust Bancorp.</h2>
          <p class="text-slate-400 text-sm sm:text-base">
            Open a fully protected commercial checking and savings account today.
          </p>
          <div class="pt-2">
            <a routerLink="/open-account" 
               class="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base shadow-xl transition inline-block">
              Open a Protected Account
            </a>
          </div>
        </div>
      </section>

    </div>
  `
})
export class SecurityComponent {}
