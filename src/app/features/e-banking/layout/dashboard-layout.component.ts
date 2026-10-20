import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ChatbotWidgetComponent } from '../../../shared/components/chatbot-widget.component';
import { TourGuideComponent } from '../../../shared/components/tour-guide.component';
import { TourService } from '../../../core/services/tour.service';
import { SystemSettingsService } from '../../../core/services/system-settings.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, FormsModule, ChatbotWidgetComponent, TourGuideComponent],
  template: `
    <div class="min-h-screen bg-[#f8fafc] flex antialiased text-slate-800 font-sans selection:bg-[#0BB4D2] selection:text-white">
      
      <!-- ========================================================================= -->
      <!-- STATIC DESKTOP SIDEBAR NAVIGATION                                         -->
      <!-- Dedicated full-height fixed left rail on desktop (lg+), #003432 Deep Teal  -->
      <!-- ========================================================================= -->
      <aside 
        class="fixed inset-y-0 left-0 w-64 xl:w-72 bg-[#003432] text-slate-200 border-r border-[#002625] z-40 flex flex-col h-screen select-none transition-transform duration-300 ease-in-out shadow-xl"
        [ngClass]="{
          'translate-x-0': isSidebarOpen(),
          '-translate-x-full lg:translate-x-0': !isSidebarOpen()
        }">
        
        <!-- Sidebar Brand Header -->
        <div class="p-5 border-b border-white/10 bg-[#002625] flex items-center justify-between shrink-0">
          <a routerLink="/e-banking/overview" (click)="closeMobileSidebar()" class="flex items-center gap-3 group">
            @if (systemSettings.siteLogoUrl()) {
              <img [src]="systemSettings.siteLogoUrl()" alt="Logo" class="w-9 h-9 object-contain rounded-xl bg-white/10 p-1" />
            } @else {
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0BB4D2] to-[#089bb5] flex items-center justify-center font-black text-white text-sm shadow-md tracking-wider">
                {{ systemSettings.siteName().charAt(0) || 'V' }}
              </div>
            }
            <div>
              <span class="text-base font-black tracking-tight text-white block">{{ systemSettings.siteName() }}</span>
              <span class="text-[10px] tracking-widest text-[#0BB4D2] uppercase font-bold block -mt-0.5">{{ systemSettings.siteTagline() }}</span>
            </div>
          </a>

          <!-- Mobile Close Button -->
          <button (click)="closeMobileSidebar()" 
                  class="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- User Identity Profile Capsule -->
        <div class="px-5 py-4 border-b border-white/10 bg-black/10 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#0BB4D2] text-[#003432] flex items-center justify-center font-black text-sm shadow-md shrink-0">
              {{ currentUser()?.firstName?.charAt(0) || 'U' }}{{ currentUser()?.lastName?.charAt(0) || 'C' }}
            </div>
            <div class="overflow-hidden flex-1 min-w-0">
              <div class="font-bold text-xs text-white truncate">{{ currentUser()?.fullName || 'Client Account' }}</div>
              
              <!-- Account Number & Quick Copy -->
              <button (click)="copyAccountNumber()" 
                      title="Click to copy account number"
                      class="mt-0.5 group flex items-center gap-1.5 text-[11px] text-slate-300 font-mono hover:text-[#0BB4D2] transition">
                <span>{{ currentAccount()?.accountNumber || '••••••••••' }}</span>
                <span class="text-[9px] px-1 py-0.2 rounded bg-black/30 text-slate-300 group-hover:text-[#0BB4D2]">
                  {{ copiedAccount() ? '✓ Copied' : 'Copy' }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Clean, Simplified Navigation Categories -->
        <nav class="flex-1 py-4 px-3 space-y-6 overflow-y-auto sidebar-scroll text-xs font-semibold">
          
          <!-- Group 1: Core Banking -->
          <div class="space-y-1">
            <div class="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Core Banking</div>
            
            <a routerLink="/e-banking/overview" 
               routerLinkActive="bg-[#0BB4D2] text-white shadow-sm font-bold" 
               [routerLinkActiveOptions]="{exact: true}"
               (click)="closeMobileSidebar()"
               [class.ring-2]="tourService.isOpen() && tourService.currentTourTargetId() === 'overview'"
               [class.ring-amber-400]="tourService.isOpen() && tourService.currentTourTargetId() === 'overview'"
               [class.bg-teal-900]="tourService.isOpen() && tourService.currentTourTargetId() === 'overview'"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition relative">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
              <span>Dashboard Overview</span>
              @if (tourService.isOpen() && tourService.currentTourTargetId() === 'overview') {
                <span class="ml-auto px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black animate-pulse shadow">👈 HERE</span>
              }
            </a>

            <a routerLink="/e-banking/fund-transfer" 
               routerLinkActive="bg-[#0BB4D2] text-white shadow-sm font-bold"
               (click)="closeMobileSidebar()"
               [class.ring-2]="tourService.isOpen() && tourService.currentTourTargetId() === 'transfers'"
               [class.ring-amber-400]="tourService.isOpen() && tourService.currentTourTargetId() === 'transfers'"
               [class.bg-teal-900]="tourService.isOpen() && tourService.currentTourTargetId() === 'transfers'"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition relative">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
              <span>Transfer Funds &amp; Wires</span>
              @if (tourService.isOpen() && tourService.currentTourTargetId() === 'transfers') {
                <span class="ml-auto px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black animate-pulse shadow">👈 HERE</span>
              }
            </a>

            <a routerLink="/e-banking/deposit" 
               routerLinkActive="bg-[#0BB4D2] text-white shadow-sm font-bold"
               (click)="closeMobileSidebar()"
               [class.ring-2]="tourService.isOpen() && tourService.currentTourTargetId() === 'deposits'"
               [class.ring-amber-400]="tourService.isOpen() && tourService.currentTourTargetId() === 'deposits'"
               [class.bg-teal-900]="tourService.isOpen() && tourService.currentTourTargetId() === 'deposits'"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition relative">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
              <span>Deposit Funds</span>
              @if (tourService.isOpen() && tourService.currentTourTargetId() === 'deposits') {
                <span class="ml-auto px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black animate-pulse shadow">👈 HERE</span>
              }
            </a>

            <a routerLink="/e-banking/cards" 
               routerLinkActive="bg-[#0BB4D2] text-white shadow-sm font-bold"
               (click)="closeMobileSidebar()"
               [class.ring-2]="tourService.isOpen() && tourService.currentTourTargetId() === 'cards'"
               [class.ring-amber-400]="tourService.isOpen() && tourService.currentTourTargetId() === 'cards'"
               [class.bg-teal-900]="tourService.isOpen() && tourService.currentTourTargetId() === 'cards'"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition relative">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>
              <span>Payment Cards</span>
              @if (tourService.isOpen() && tourService.currentTourTargetId() === 'cards') {
                <span class="ml-auto px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black animate-pulse shadow">👈 HERE</span>
              }
            </a>

            <a routerLink="/e-banking/wallets" 
               routerLinkActive="bg-[#0BB4D2] text-white shadow-sm font-bold"
               (click)="closeMobileSidebar()"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 000 20M2 12h20"/></svg>
              <span>Multi-Currency Wallets</span>
            </a>
          </div>

          <!-- Group 2: Financing & Wealth -->
          <div class="space-y-1">
            <div class="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Financing &amp; Wealth</div>

            <a routerLink="/e-banking/loans" 
               routerLinkActive="bg-[#0BB4D2] text-white shadow-sm font-bold"
               (click)="closeMobileSidebar()"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span>Loans &amp; Mortgages</span>
            </a>

            <a routerLink="/e-banking/investments" 
               routerLinkActive="bg-[#0BB4D2] text-white shadow-sm font-bold"
               (click)="closeMobileSidebar()"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
              <span>Fixed Yield Investments</span>
            </a>

            <a routerLink="/e-banking/withdrawals" 
               routerLinkActive="bg-[#0BB4D2] text-white shadow-sm font-bold"
               (click)="closeMobileSidebar()"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
              <span>Withdrawal Requests</span>
            </a>

            <a routerLink="/e-banking/beneficiaries" 
               routerLinkActive="bg-[#0BB4D2] text-white shadow-sm font-bold"
               (click)="closeMobileSidebar()"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <span>Saved Beneficiaries</span>
            </a>
          </div>

          <!-- Group 3: Account & Support -->
          <div class="space-y-1">
            <div class="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Account &amp; Security</div>

            <a routerLink="/e-banking/statement" 
               routerLinkActive="bg-[#0BB4D2] text-white shadow-sm font-bold"
               (click)="closeMobileSidebar()"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <span>Statements &amp; Receipts</span>
            </a>

            <a routerLink="/e-banking/settings" 
               routerLinkActive="bg-[#0BB4D2] text-white shadow-sm font-bold"
               (click)="closeMobileSidebar()"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              <span>Security &amp; PIN Settings</span>
            </a>

            <a routerLink="/e-banking/support" 
               routerLinkActive="bg-[#0BB4D2] text-white shadow-sm font-bold"
               (click)="closeMobileSidebar()"
               [class.ring-2]="tourService.isOpen() && tourService.currentTourTargetId() === 'support'"
               [class.ring-amber-400]="tourService.isOpen() && tourService.currentTourTargetId() === 'support'"
               [class.bg-teal-900]="tourService.isOpen() && tourService.currentTourTargetId() === 'support'"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition relative">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              <span>Support &amp; Disputes</span>
              @if (tourService.isOpen() && tourService.currentTourTargetId() === 'support') {
                <span class="ml-auto px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black animate-pulse shadow">👈 HERE</span>
              }
            </a>
          </div>

        </nav>

        <!-- Sidebar Bottom Admin Switcher & Sign Out -->
        <div class="p-4 border-t border-white/10 bg-[#002625] shrink-0 space-y-2">
          @if (authService.isAdmin()) {
            <a routerLink="/admin/dashboard" 
               class="w-full px-3 py-2 rounded-lg bg-[#0BB4D2] text-[#003432] font-bold text-xs flex items-center justify-center gap-2 transition hover:bg-white">
              <span>⚡</span>
              <span>Admin Control Panel</span>
            </a>
          }

          <button (click)="logout()" 
                  class="w-full px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      <!-- Desktop Sidebar Backdrop Overlay for tablet -->
      @if (isSidebarOpen()) {
        <div (click)="closeMobileSidebar()" 
             class="fixed inset-0 bg-black/50 backdrop-blur-xs z-30 lg:hidden">
        </div>
      }

      <!-- ========================================================================= -->
      <!-- MAIN WORKSPACE CANVAS                                                     -->
      <!-- Mobile Native App Shell + Desktop Responsive Layout                       -->
      <!-- ========================================================================= -->
      <div class="flex-1 flex flex-col min-h-screen lg:pl-64 xl:pl-72 transition-all duration-300 min-w-0 max-w-full overflow-x-hidden">
        
        <!-- Impersonation Alert Banner -->
        @if (authService.isImpersonated()) {
          <div class="bg-amber-600 text-white px-4 py-2 text-xs font-bold flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40">
            <div class="flex items-center gap-2">
              <span>⚠️ Viewing portal as <strong>{{ currentUser()?.fullName }}</strong> ({{ currentAccount()?.accountNumber }}).</span>
            </div>
            <button (click)="returnToAdmin()"
                    class="px-3 py-1 rounded bg-black/30 hover:bg-black/50 text-white text-xs font-bold transition">
              &larr; Return to Admin
            </button>
          </div>
        }

        <!-- ========================================================================= -->
        <!-- MOBILE NATIVE APP HEADER (Clean, minimalist, spacious)                    -->
        <!-- ========================================================================= -->
        <header class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 text-slate-800 shadow-2xs lg:hidden">
          <div class="px-4 py-2.5 flex items-center justify-between">
            
            <!-- Left: Sleek Avatar + Identity -->
            <div class="flex items-center gap-2.5">
              <button (click)="toggleServicesTray()" 
                      class="relative focus:outline-none active:scale-95 transition"
                      title="Quick Services">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#003432] to-[#0BB4D2] text-white flex items-center justify-center font-black text-xs shadow-xs">
                  {{ currentUser()?.firstName?.charAt(0) || 'U' }}
                </div>
                <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
              </button>

              <div class="leading-tight">
                <span class="text-xs font-black text-slate-900 block tracking-tight">
                  Hi, {{ currentUser()?.firstName || 'Client' }}
                </span>
                <button (click)="copyAccountNumber()" 
                        class="text-[11px] text-slate-400 font-mono flex items-center gap-1 hover:text-slate-700 transition"
                        title="Tap to copy full account number">
                  <span>••{{ currentAccount()?.accountNumber?.slice(-4) || '••••' }}</span>
                  <span class="text-[#0BB4D2] font-bold text-[10px]">{{ copiedAccount() ? '✓' : '⧉' }}</span>
                </button>
              </div>
            </div>

            <!-- Right: Clean, Spacious Tour & Menu Drawer Button -->
            <div class="flex items-center gap-2">
              <button (click)="tourService.startUserTour(true)" 
                      class="px-2.5 py-1 rounded-full bg-teal-50 hover:bg-teal-100 text-[#003432] border border-teal-200 text-[11px] font-bold transition flex items-center gap-1 active:scale-95 shadow-2xs"
                      title="Start Guide">
                <span>🎯</span>
                <span>Tour</span>
              </button>

              <button (click)="toggleSidebar()" 
                      class="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition active:scale-95"
                      aria-label="Open sidebar menu">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>

          </div>
        </header>

        <!-- ========================================================================= -->
        <!-- DESKTOP TOP HEADER (Visible on lg+ screens)                               -->
        <!-- ========================================================================= -->
        <header class="sticky top-0 z-20 bg-white border-b border-slate-200 text-slate-800 shadow-xs hidden lg:block">
          <div class="px-5 sm:px-8 py-3.5 flex items-center justify-between gap-4">
            
            <div>
              <h1 class="text-sm sm:text-base font-bold text-slate-900">
                Welcome back, {{ currentUser()?.firstName || 'Valued Client' }}
              </h1>
              <p class="text-xs text-slate-500">VaultProvenance Digital Banking &amp; Institutional Treasury</p>
            </div>

            <div class="flex items-center gap-3">
              <button (click)="tourService.startUserTour(true)"
                      class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-[#003432] bg-teal-50 hover:bg-teal-100 transition border border-teal-200 shadow-2xs">
                <span>🎯</span>
                <span>Platform Tour</span>
              </button>

              <a routerLink="/e-banking/fund-transfer" 
                 class="theme_btn apply_btn py-2 px-4 text-xs font-bold rounded-lg shadow-sm">
                Send Money &rarr;
              </a>
              
              <button (click)="logout()" 
                      class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition border border-slate-200">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                <span>Logout</span>
              </button>
            </div>

          </div>
        </header>

        <!-- Main Workspace Body with safe bottom padding on mobile -->
        <main class="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0 pb-24 lg:pb-8">
          <router-outlet></router-outlet>
        </main>

        <!-- Clean Footer Strip (Desktop only to prevent mobile clutter) -->
        <footer class="py-5 px-5 sm:px-8 border-t border-slate-200 text-xs text-slate-500 bg-white hidden lg:block">
          <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              &copy; 2026 <strong>VaultProvenance Bank Plc</strong>. All rights reserved.
            </div>
            <div class="text-[11px] text-slate-400">
              Licensed Institutional &amp; Commercial Bank &bull; London &bull; New York
            </div>
          </div>
        </footer>

      </div>

      <!-- ========================================================================= -->
      <!-- MOBILE APP BOTTOM NAVIGATION DOCK (Persistent Mobile App Tab Bar)         -->
      <!-- Displays natively on mobile screens (<1024px)                             -->
      <!-- ========================================================================= -->
      <nav class="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] py-1.5 px-3 flex items-center justify-around lg:hidden select-none">
        
        <!-- Tab 1: Home Overview -->
        <a routerLink="/e-banking/overview" 
           routerLinkActive="text-[#003432] font-black"
           [routerLinkActiveOptions]="{exact: true}"
           (click)="closeServicesTray()"
           class="flex flex-col items-center justify-center py-1 px-2.5 text-slate-400 hover:text-[#003432] transition group active:scale-90">
          <div class="p-1 rounded-xl transition group-[.font-black]:bg-teal-50 group-[.font-black]:text-[#003432]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          </div>
          <span class="text-[10px] mt-0.5 font-bold tracking-tight">Home</span>
        </a>

        <!-- Tab 2: Transfers & Wires -->
        <a routerLink="/e-banking/fund-transfer" 
           routerLinkActive="text-[#003432] font-black"
           (click)="closeServicesTray()"
           class="flex flex-col items-center justify-center py-1 px-2.5 text-slate-400 hover:text-[#003432] transition group active:scale-90">
          <div class="p-1 rounded-xl transition group-[.font-black]:bg-teal-50 group-[.font-black]:text-[#003432]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
          </div>
          <span class="text-[10px] mt-0.5 font-bold tracking-tight">Pay</span>
        </a>

        <!-- Tab 3: Payment Cards -->
        <a routerLink="/e-banking/cards" 
           routerLinkActive="text-[#003432] font-black"
           (click)="closeServicesTray()"
           class="flex flex-col items-center justify-center py-1 px-2.5 text-slate-400 hover:text-[#003432] transition group active:scale-90">
          <div class="p-1 rounded-xl transition group-[.font-black]:bg-teal-50 group-[.font-black]:text-[#003432]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2" stroke-width="2.2"></rect><line x1="2" x2="22" y1="10" y2="10" stroke-width="2.2"></line></svg>
          </div>
          <span class="text-[10px] mt-0.5 font-bold tracking-tight">Cards</span>
        </a>

        <!-- Tab 4: Ledger Activity -->
        <a routerLink="/e-banking/statement" 
           routerLinkActive="text-[#003432] font-black"
           (click)="closeServicesTray()"
           class="flex flex-col items-center justify-center py-1 px-2.5 text-slate-400 hover:text-[#003432] transition group active:scale-90">
          <div class="p-1 rounded-xl transition group-[.font-black]:bg-teal-50 group-[.font-black]:text-[#003432]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <span class="text-[10px] mt-0.5 font-bold tracking-tight">Activity</span>
        </a>

        <!-- Tab 5: Services Drawer (Bottom Sheet Trigger) -->
        <button (click)="toggleServicesTray()" 
                [ngClass]="isServicesTrayOpen() ? 'text-[#003432] font-black' : 'text-slate-400'"
                class="flex flex-col items-center justify-center py-1 px-2.5 hover:text-[#003432] transition group active:scale-90 focus:outline-none">
          <div class="p-1 rounded-xl transition" [ngClass]="isServicesTrayOpen() ? 'bg-teal-50 text-[#003432]' : ''">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
          </div>
          <span class="text-[10px] mt-0.5 font-bold tracking-tight">Services</span>
        </button>

      </nav>

      <!-- ========================================================================= -->
      <!-- MOBILE APP SERVICES TRAY (Native App Slide-Up Bottom Sheet)               -->
      <!-- ========================================================================= -->
      @if (isServicesTrayOpen()) {
        <div class="fixed inset-0 z-50 lg:hidden">
          
          <!-- Smooth Backdrop -->
          <div (click)="closeServicesTray()" 
               class="absolute inset-0 bg-black/60 backdrop-blur-xs animate-fade-in transition-opacity">
          </div>

          <!-- Slide-Up Sheet Container -->
          <div class="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl border-t border-slate-200 shadow-2xl max-h-[85vh] overflow-y-auto p-5 pb-8 space-y-6 animate-slide-up">
            
            <!-- Drag Handle Bar -->
            <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto -mt-1"></div>

            <!-- Header -->
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#003432] to-[#002625] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  VA
                </div>
                <div>
                  <h3 class="text-sm font-extrabold text-[#003432]">VaultProvenance Services</h3>
                  <p class="text-[11px] text-slate-500">Tap any module to launch</p>
                </div>
              </div>
              <button (click)="closeServicesTray()" class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-lg">
                &times;
              </button>
            </div>

            <!-- Category 1: Banking & Currency -->
            <div class="space-y-2">
              <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Banking &amp; Cashflow</span>
              <div class="grid grid-cols-4 gap-3 text-center">
                <a routerLink="/e-banking/deposit" (click)="closeServicesTray()" class="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 active:scale-95 transition">
                  <div class="w-11 h-11 rounded-2xl bg-teal-50 text-[#003432] flex items-center justify-center text-lg shadow-xs">📥</div>
                  <span class="text-[10px] font-bold text-slate-700 leading-tight">Deposit</span>
                </a>
                <a routerLink="/e-banking/withdrawals" (click)="closeServicesTray()" class="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 active:scale-95 transition">
                  <div class="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg shadow-xs">📤</div>
                  <span class="text-[10px] font-bold text-slate-700 leading-tight">Withdraw</span>
                </a>
                <a routerLink="/e-banking/wallets" (click)="closeServicesTray()" class="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 active:scale-95 transition">
                  <div class="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg shadow-xs">🌍</div>
                  <span class="text-[10px] font-bold text-slate-700 leading-tight">FX Wallets</span>
                </a>
                <a routerLink="/e-banking/beneficiaries" (click)="closeServicesTray()" class="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 active:scale-95 transition">
                  <div class="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-lg shadow-xs">👥</div>
                  <span class="text-[10px] font-bold text-slate-700 leading-tight">Contacts</span>
                </a>
              </div>
            </div>

            <!-- Category 2: Credit & Wealth -->
            <div class="space-y-2">
              <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Credit &amp; Wealth</span>
              <div class="grid grid-cols-4 gap-3 text-center">
                <a routerLink="/e-banking/loans" (click)="closeServicesTray()" class="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 active:scale-95 transition">
                  <div class="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg shadow-xs">🏛️</div>
                  <span class="text-[10px] font-bold text-slate-700 leading-tight">Loans</span>
                </a>
                <a routerLink="/e-banking/investments" (click)="closeServicesTray()" class="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 active:scale-95 transition">
                  <div class="w-11 h-11 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center text-lg shadow-xs">📈</div>
                  <span class="text-[10px] font-bold text-slate-700 leading-tight">Invest</span>
                </a>
                <a routerLink="/e-banking/copy-trading" (click)="closeServicesTray()" class="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 active:scale-95 transition">
                  <div class="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-lg shadow-xs">📡</div>
                  <span class="text-[10px] font-bold text-slate-700 leading-tight">Signals</span>
                </a>
                <a routerLink="/e-banking/grants" (click)="closeServicesTray()" class="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 active:scale-95 transition">
                  <div class="w-11 h-11 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center text-lg shadow-xs">📜</div>
                  <span class="text-[10px] font-bold text-slate-700 leading-tight">Grants</span>
                </a>
              </div>
            </div>

            <!-- Category 3: Security & Governance -->
            <div class="space-y-2">
              <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Account &amp; Security</span>
              <div class="grid grid-cols-4 gap-3 text-center">
                <a routerLink="/e-banking/tax-refund" (click)="closeServicesTray()" class="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 active:scale-95 transition">
                  <div class="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center text-lg shadow-xs">⚖️</div>
                  <span class="text-[10px] font-bold text-slate-700 leading-tight">IRS Refund</span>
                </a>
                <a routerLink="/e-banking/academy" (click)="closeServicesTray()" class="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 active:scale-95 transition">
                  <div class="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg shadow-xs">🎓</div>
                  <span class="text-[10px] font-bold text-slate-700 leading-tight">Academy</span>
                </a>
                <a routerLink="/e-banking/settings" (click)="closeServicesTray()" class="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 active:scale-95 transition">
                  <div class="w-11 h-11 rounded-2xl bg-teal-50 text-[#003432] flex items-center justify-center text-lg shadow-xs">🔒</div>
                  <span class="text-[10px] font-bold text-slate-700 leading-tight">PIN &amp; Keys</span>
                </a>
                <a routerLink="/e-banking/support" (click)="closeServicesTray()" class="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 active:scale-95 transition">
                  <div class="w-11 h-11 rounded-2xl bg-teal-50 text-[#003432] flex items-center justify-center text-lg shadow-xs">🎧</div>
                  <span class="text-[10px] font-bold text-slate-700 leading-tight">Support</span>
                </a>
                <button (click)="logout(); closeServicesTray()" class="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-rose-50 active:scale-95 transition text-left">
                  <div class="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg shadow-xs">🚪</div>
                  <span class="text-[10px] font-bold text-rose-600 leading-tight">Sign Out</span>
                </button>
              </div>
            </div>

            <!-- Admin Shortcut if applicable -->
            @if (authService.isAdmin()) {
              <div class="pt-2">
                <a routerLink="/admin/dashboard" (click)="closeServicesTray()"
                   class="w-full py-3 rounded-xl bg-[#0BB4D2] text-[#003432] font-black text-xs flex items-center justify-center gap-2 shadow-xs">
                  <span>⚡ Switch to Admin Control Center</span>
                </a>
              </div>
            }

          </div>
        </div>
      }

      <!-- 24/7 AI Banking Assistant & Live Chatpot -->
      <app-chatbot-widget />

      <!-- Interactive User Walkthrough Tour Guide -->
      <app-tour-guide />

    </div>
  `
})
export class DashboardLayoutComponent implements OnInit {
  authService = inject(AuthService);
  tourService = inject(TourService);
  systemSettings = inject(SystemSettingsService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  currentAccount = this.authService.currentAccount;
  
  isSidebarOpen = signal<boolean>(false);
  isServicesTrayOpen = signal<boolean>(false);
  copiedAccount = signal<boolean>(false);

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        this.tourService.startUserTour(false);
      }, 1200);
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(v => !v);
  }

  closeMobileSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  toggleServicesTray(): void {
    this.isServicesTrayOpen.update(v => !v);
  }

  closeServicesTray(): void {
    this.isServicesTrayOpen.set(false);
  }

  copyAccountNumber(): void {
    const acc = this.currentAccount()?.accountNumber;
    if (acc) {
      navigator.clipboard.writeText(acc);
      this.copiedAccount.set(true);
      setTimeout(() => this.copiedAccount.set(false), 2000);
    }
  }

  returnToAdmin(): void {
    this.authService.returnToAdmin();
  }

  logout(): void {
    this.authService.logout();
  }
}
