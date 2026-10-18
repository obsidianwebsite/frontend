import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SystemSettingsService } from '../../../core/services/system-settings.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="min-h-screen flex flex-col bg-[#f9f9f9] text-[#4d4e4f] font-sans selection:bg-[#0BB4D2] selection:text-white pb-16 md:pb-0">
      
      <!-- HEADER TOP AREA (Exact otbplc.com header_top_area hta_2) -->
      <div class="bg-white border-b border-slate-200/80 py-3 hidden md:block">
        <div class="max-w-7xl mx-auto px-4 sm:px-8">
          <div class="flex items-center justify-between">
            
            <!-- Left Top Menu -->
            <ul class="flex items-center gap-6 text-xs text-slate-600 font-semibold">
              <li class="flex items-center gap-1.5 text-[#003432]">
                <svg class="w-3.5 h-3.5 text-[#0BB4D2]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                <span>{{ systemSettings.phoneNumber() }}</span>
              </li>
              <li>
                <a routerLink="/about" class="hover:text-[#0BB4D2] transition">Career</a>
              </li>
              <li>
                <a routerLink="/contact" class="hover:text-[#0BB4D2] transition">Support</a>
              </li>
            </ul>

            <!-- Center Brand Logo -->
            <div class="text-center">
              <a routerLink="/" class="inline-flex items-center gap-2.5">
                @if (systemSettings.siteLogoUrl().startsWith('http') || systemSettings.siteLogoUrl().startsWith('/assets') || systemSettings.siteLogoUrl().startsWith('data:image')) {
                  <img [src]="systemSettings.siteLogoUrl()" [alt]="systemSettings.siteName()" class="w-10 h-10 rounded-xl object-contain shadow-sm border border-slate-200 bg-white p-1" />
                } @else {
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#003432] to-[#0BB4D2] text-white flex items-center justify-center font-black text-base shadow-sm">
                    {{ systemSettings.siteName().substring(0, 2).toUpperCase() }}
                  </div>
                }
                <div class="text-left">
                  <div class="text-xl font-black text-[#003432] tracking-tight leading-none">{{ systemSettings.siteName() }}</div>
                  <div class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">{{ systemSettings.siteTagline() }}</div>
                </div>
              </a>
            </div>

            <!-- Right Social & Online Banking Shortcuts -->
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2.5 text-slate-400">
                <a href="#" class="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#0BB4D2] hover:text-white flex items-center justify-center text-xs transition">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="#" class="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#0BB4D2] hover:text-white flex items-center justify-center text-xs transition">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
                <a href="#" class="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#0BB4D2] hover:text-white flex items-center justify-center text-xs transition">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
              </div>
              <a routerLink="/login" class="text-xs font-bold text-[#003432] hover:text-[#0BB4D2] transition pl-2 border-l border-slate-200">
                Sign In
              </a>
            </div>

          </div>
        </div>
      </div>

      <!-- MAIN HEADER AREA (Exact otbplc.com main_header_area mha_2 with #003432 background) -->
      <header class="bg-[#003432] sticky top-0 z-50 shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-8">
          <div class="flex items-center justify-between h-16">
            
            <!-- Mobile Brand Logo -->
            <a routerLink="/" class="md:hidden flex items-center gap-2">
              @if (systemSettings.siteLogoUrl().startsWith('http') || systemSettings.siteLogoUrl().startsWith('/assets') || systemSettings.siteLogoUrl().startsWith('data:image')) {
                <img [src]="systemSettings.siteLogoUrl()" [alt]="systemSettings.siteName()" class="w-8 h-8 rounded-lg object-contain bg-white p-0.5" />
              } @else {
                <div class="w-8 h-8 rounded-lg bg-[#0BB4D2] text-[#003432] flex items-center justify-center font-black text-xs">
                  {{ systemSettings.siteName().substring(0, 2).toUpperCase() }}
                </div>
              }
              <span class="font-bold text-base text-white tracking-tight">{{ systemSettings.siteName() }}</span>
            </a>

            <!-- Desktop Navigation Menu -->
            <nav class="hidden md:flex items-center gap-1 lg:gap-2">
              <a routerLink="/" 
                 routerLinkActive="bg-[#0BB4D2] text-white" 
                 [routerLinkActiveOptions]="{ exact: true }"
                 class="px-4 py-2 rounded text-sm font-bold text-white hover:bg-[#0BB4D2] transition uppercase tracking-wide">
                Home
              </a>
              <a routerLink="/about" 
                 routerLinkActive="bg-[#0BB4D2] text-white"
                 class="px-4 py-2 rounded text-sm font-bold text-slate-200 hover:text-white hover:bg-[#0BB4D2] transition uppercase tracking-wide">
                About us
              </a>
              <a routerLink="/services" 
                 routerLinkActive="bg-[#0BB4D2] text-white"
                 class="px-4 py-2 rounded text-sm font-bold text-slate-200 hover:text-white hover:bg-[#0BB4D2] transition uppercase tracking-wide">
                Services
              </a>
              <a routerLink="/checking" 
                 routerLinkActive="bg-[#0BB4D2] text-white"
                 class="px-4 py-2 rounded text-sm font-bold text-slate-200 hover:text-white hover:bg-[#0BB4D2] transition uppercase tracking-wide">
                Checking
              </a>
              <a routerLink="/savings" 
                 routerLinkActive="bg-[#0BB4D2] text-white"
                 class="px-4 py-2 rounded text-sm font-bold text-slate-200 hover:text-white hover:bg-[#0BB4D2] transition uppercase tracking-wide">
                Savings
              </a>
              <a routerLink="/cards" 
                 routerLinkActive="bg-[#0BB4D2] text-white"
                 class="px-4 py-2 rounded text-sm font-bold text-slate-200 hover:text-white hover:bg-[#0BB4D2] transition uppercase tracking-wide">
                Cards
              </a>
              <a routerLink="/loans" 
                 routerLinkActive="bg-[#0BB4D2] text-white"
                 class="px-4 py-2 rounded text-sm font-bold text-slate-200 hover:text-white hover:bg-[#0BB4D2] transition uppercase tracking-wide">
                Loans
              </a>
              <a routerLink="/contact" 
                 routerLinkActive="bg-[#0BB4D2] text-white"
                 class="px-4 py-2 rounded text-sm font-bold text-slate-200 hover:text-white hover:bg-[#0BB4D2] transition uppercase tracking-wide">
                Contact us
              </a>
            </nav>

            <!-- Right CTA Button (Online Banking) -->
            <div class="hidden sm:flex items-center gap-3">
              <a routerLink="/open-account" class="theme_btn text-xs font-bold">
                Open An Account
              </a>
              <a routerLink="/login" class="theme_btn apply_btn text-xs font-bold">
                Online Banking
              </a>
            </div>

            <!-- Mobile Hamburger Button -->
            <div class="flex items-center gap-2 md:hidden">
              <a routerLink="/login" class="px-3 py-1.5 rounded bg-[#0BB4D2] text-white text-xs font-bold">
                Login
              </a>
              <button (click)="mobileMenuOpen.set(!mobileMenuOpen())"
                      aria-label="Toggle navigation menu"
                      class="p-2 text-white hover:text-[#0BB4D2] transition">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  @if (mobileMenuOpen()) {
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  } @else {
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                  }
                </svg>
              </button>
            </div>

          </div>
        </div>

        <!-- Mobile Drawer Menu -->
        @if (mobileMenuOpen()) {
          <div class="md:hidden bg-[#002625] border-t border-teal-900/60 px-5 py-5 space-y-2 animate-fade-in">
            <a routerLink="/" (click)="mobileMenuOpen.set(false)" class="block px-3 py-2 rounded text-white font-bold text-sm hover:bg-[#0BB4D2]">Home</a>
            <a routerLink="/about" (click)="mobileMenuOpen.set(false)" class="block px-3 py-2 rounded text-slate-200 font-bold text-sm hover:bg-[#0BB4D2]">About us</a>
            <a routerLink="/services" (click)="mobileMenuOpen.set(false)" class="block px-3 py-2 rounded text-slate-200 font-bold text-sm hover:bg-[#0BB4D2]">Services</a>
            <a routerLink="/checking" (click)="mobileMenuOpen.set(false)" class="block px-3 py-2 rounded text-slate-200 font-bold text-sm hover:bg-[#0BB4D2]">Checking Accounts</a>
            <a routerLink="/savings" (click)="mobileMenuOpen.set(false)" class="block px-3 py-2 rounded text-slate-200 font-bold text-sm hover:bg-[#0BB4D2]">Savings</a>
            <a routerLink="/cards" (click)="mobileMenuOpen.set(false)" class="block px-3 py-2 rounded text-slate-200 font-bold text-sm hover:bg-[#0BB4D2]">Payment Cards</a>
            <a routerLink="/loans" (click)="mobileMenuOpen.set(false)" class="block px-3 py-2 rounded text-slate-200 font-bold text-sm hover:bg-[#0BB4D2]">Loans &amp; Mortgages</a>
            <a routerLink="/contact" (click)="mobileMenuOpen.set(false)" class="block px-3 py-2 rounded text-slate-200 font-bold text-sm hover:bg-[#0BB4D2]">Contact us</a>
            
            <div class="pt-3 border-t border-teal-800 space-y-2">
              <a routerLink="/open-account" (click)="mobileMenuOpen.set(false)" class="w-full theme_btn block text-center">
                Open An Account
              </a>
              <a routerLink="/login" (click)="mobileMenuOpen.set(false)" class="w-full theme_btn apply_btn block text-center">
                Online Banking Login
              </a>
            </div>
          </div>
        }
      </header>

      <!-- Main Body Outlet -->
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>

      <!-- FOOTER AREA (Exact otbplc.com footer_area fa_2 with #002625 background) -->
      <footer class="bg-[#002625] text-slate-300 font-sans border-t-4 border-[#0BB4D2]">
        <div class="max-w-7xl mx-auto px-4 sm:px-8 py-16">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            
            <!-- Col 1: Logo & Copyright -->
            <div class="lg:col-span-4 space-y-4">
              <a routerLink="/" class="inline-flex items-center gap-3">
                @if (systemSettings.siteLogoUrl().startsWith('http') || systemSettings.siteLogoUrl().startsWith('/assets') || systemSettings.siteLogoUrl().startsWith('data:image')) {
                  <img [src]="systemSettings.siteLogoUrl()" [alt]="systemSettings.siteName()" class="w-10 h-10 rounded-xl object-contain bg-white p-1 shadow-sm" />
                } @else {
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0BB4D2] to-teal-400 text-[#003432] flex items-center justify-center font-black text-base shadow-sm">
                    {{ systemSettings.siteName().substring(0, 2).toUpperCase() }}
                  </div>
                }
                <div>
                  <div class="text-xl font-black text-white tracking-tight leading-none">{{ systemSettings.siteName() }}</div>
                  <div class="text-[10px] text-teal-300 font-semibold uppercase tracking-wider mt-0.5">{{ systemSettings.siteTagline() }}</div>
                </div>
              </a>
              <p class="text-xs text-slate-300 leading-relaxed max-w-sm">
                {{ systemSettings.siteName() }} is a full service commercial and institutional bank operating across the UK, Europe, North America and global financial centers.
              </p>
              <p class="text-xs text-slate-400">
                &copy; 2026 <strong class="text-white">{{ systemSettings.siteName() }}</strong>. All rights reserved
              </p>
              <div class="flex items-center gap-2 pt-2">
                <a href="#" class="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-[#0BB4D2] hover:text-white flex items-center justify-center text-xs transition">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
                <a href="#" class="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-[#0BB4D2] hover:text-white flex items-center justify-center text-xs transition">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" class="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-[#0BB4D2] hover:text-white flex items-center justify-center text-xs transition">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>
            </div>

            <!-- Col 2: About -->
            <div class="lg:col-span-2 space-y-3 text-xs">
              <h4 class="font-bold text-white text-base tracking-wide border-b border-teal-800/80 pb-2">About</h4>
              <ul class="space-y-2 text-slate-300">
                <li><a routerLink="/about" class="hover:text-[#0BB4D2] transition">How it Works</a></li>
                <li><a routerLink="/security" class="hover:text-[#0BB4D2] transition">Guarantee</a></li>
                <li><a routerLink="/security" class="hover:text-[#0BB4D2] transition">Security</a></li>
                <li><a routerLink="/contact" class="hover:text-[#0BB4D2] transition">Contact</a></li>
                <li><a routerLink="/about" class="hover:text-[#0BB4D2] transition">Our story</a></li>
              </ul>
            </div>

            <!-- Col 3: Solution -->
            <div class="lg:col-span-2 space-y-3 text-xs">
              <h4 class="font-bold text-white text-base tracking-wide border-b border-teal-800/80 pb-2">Solution</h4>
              <ul class="space-y-2 text-slate-300">
                <li><a routerLink="/loans" class="hover:text-[#0BB4D2] transition">Car Loan</a></li>
                <li><a routerLink="/loans" class="hover:text-[#0BB4D2] transition">Personal Loan</a></li>
                <li><a routerLink="/loans" class="hover:text-[#0BB4D2] transition">Education Loan</a></li>
                <li><a routerLink="/services" class="hover:text-[#0BB4D2] transition">Business Loan</a></li>
              </ul>
            </div>

            <!-- Col 4: Need help? -->
            <div class="lg:col-span-2 space-y-3 text-xs">
              <h4 class="font-bold text-white text-base tracking-wide border-b border-teal-800/80 pb-2">Need help?</h4>
              <ul class="space-y-2 text-slate-300">
                <li><a routerLink="/contact" class="hover:text-[#0BB4D2] transition">Find a branch</a></li>
                <li><a routerLink="/contact" class="hover:text-[#0BB4D2] transition">Contact us</a></li>
                <li><a routerLink="/security" class="hover:text-[#0BB4D2] transition">FAQ</a></li>
                <li><a routerLink="/calculator" class="hover:text-[#0BB4D2] transition">APR Calculator</a></li>
              </ul>
            </div>

            <!-- Col 5: Save & Invest -->
            <div class="lg:col-span-2 space-y-3 text-xs">
              <h4 class="font-bold text-white text-base tracking-wide border-b border-teal-800/80 pb-2">Save &amp; Invest</h4>
              <ul class="space-y-2 text-slate-300">
                <li><a routerLink="/cards" class="hover:text-[#0BB4D2] transition">Credit Cards</a></li>
                <li><a routerLink="/loans" class="hover:text-[#0BB4D2] transition">Mortgages</a></li>
                <li><a routerLink="/savings" class="hover:text-[#0BB4D2] transition">Home Equity</a></li>
                <li><a routerLink="/checking" class="hover:text-[#0BB4D2] transition">Lines of Credit</a></li>
              </ul>
            </div>

          </div>

          <!-- Bottom Branch Address Strip -->
          <div class="mt-12 pt-8 border-t border-teal-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>{{ systemSettings.siteName() }}, {{ systemSettings.address() }}</p>
            <p>Customer Support: <span class="text-white font-semibold">{{ systemSettings.phoneNumber() }}</span> | {{ systemSettings.contactEmail() }}</p>
          </div>
        </div>
      </footer>

      <!-- ========================================================================= -->
      <!-- MOBILE NATIVE APP BOTTOM QUICK NAVIGATION DOCK                            -->
      <!-- Persistent tab bar for seamless mobile phone navigation                   -->
      <!-- ========================================================================= -->
      <nav class="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around safe-area-pb">
        <a routerLink="/"
           routerLinkActive="text-[#003432] font-black"
           [routerLinkActiveOptions]="{exact: true}"
           class="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-[#003432] transition">
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span class="text-[10px]">Home</span>
        </a>

        <a routerLink="/checking"
           routerLinkActive="text-[#003432] font-black"
           class="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-[#003432] transition">
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          <span class="text-[10px]">Accounts</span>
        </a>

        <a routerLink="/cards"
           routerLinkActive="text-[#003432] font-black"
           class="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-[#003432] transition">
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          <span class="text-[10px]">Cards</span>
        </a>

        <a routerLink="/loans"
           routerLinkActive="text-[#003432] font-black"
           class="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-[#003432] transition">
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          <span class="text-[10px]">Loans</span>
        </a>

        <a routerLink="/login"
           routerLinkActive="text-[#003432] font-black"
           class="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-[#003432] transition">
          <div class="w-5 h-5 rounded-full bg-[#003432] text-white flex items-center justify-center text-[10px] font-bold mb-0.5">
            🔑
          </div>
          <span class="text-[10px]">Sign In</span>
        </a>
      </nav>

    </div>
  `
})
export class PublicLayoutComponent {
  systemSettings = inject(SystemSettingsService);
  mobileMenuOpen = signal(false);
}
