import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TourGuideComponent } from '../../../shared/components/tour-guide.component';
import { TourService } from '../../../core/services/tour.service';
import { SystemSettingsService } from '../../../core/services/system-settings.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, TourGuideComponent],
  template: `
    <div class="min-h-screen bg-[#f8fafc] flex flex-col antialiased text-slate-800 font-sans selection:bg-[#0BB4D2] selection:text-white">
      
      <!-- ========================================================================= -->
      <!-- MOBILE APP TOP BAR (Clean, spacious, uncrowded)                           -->
      <!-- ========================================================================= -->
      <header class="lg:hidden sticky top-0 z-30 bg-[#003432] text-white px-4 py-2.5 border-b border-[#002625] shadow-xs flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          @if (systemSettings.siteLogoUrl()) {
            <img [src]="systemSettings.siteLogoUrl()" alt="Logo" class="w-8 h-8 object-contain rounded-lg bg-white/10 p-1 shadow-xs" />
          } @else {
            <div class="w-8 h-8 rounded-lg bg-[#0BB4D2] text-[#003432] flex items-center justify-center font-black text-xs shadow-xs">
              {{ systemSettings.siteName().charAt(0) || 'V' }}
            </div>
          }
          <div class="leading-tight">
            <div class="text-xs font-black tracking-tight flex items-center gap-1.5">
              <span>{{ systemSettings.siteName() }}</span>
              <span class="text-[9px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black uppercase">Admin</span>
            </div>
            <div class="text-[10px] text-teal-300 font-medium mt-0.5">Control Center</div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button (click)="tourService.startAdminTour(true)" 
                  class="px-2.5 py-1 rounded-full bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border border-teal-400/40 text-[11px] font-bold transition flex items-center gap-1 active:scale-95 shadow-2xs"
                  title="Launch Admin Tour">
            <span>🎯</span>
            <span>Tour</span>
          </button>

          <button (click)="mobileMenuOpen.set(true)" 
                  class="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition active:scale-95"
                  aria-label="Open navigation menu">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- ========================================================================= -->
      <!-- STATIC MASTER ADMIN SIDEBAR NAVIGATION (Desktop lg+)                      -->
      <!-- Dedicated full-height fixed left rail, soothing Obsidian Trust Bancorp palette     -->
      <!-- ========================================================================= -->
      <aside 
        class="fixed inset-y-0 left-0 w-64 xl:w-72 bg-[#003432] text-slate-200 border-r border-[#002625] z-40 flex flex-col h-screen select-none transition-transform duration-300 ease-in-out shadow-xl"
        [ngClass]="{
          'translate-x-0': mobileMenuOpen(),
          '-translate-x-full lg:translate-x-0': !mobileMenuOpen()
        }">
        
        <!-- Sidebar Brand Header -->
        <div class="p-5 border-b border-white/10 bg-[#002625] flex items-center justify-between shrink-0">
          <a routerLink="/admin/dashboard" (click)="mobileMenuOpen.set(false)" class="flex items-center gap-3 group">
            @if (systemSettings.siteLogoUrl()) {
              <img [src]="systemSettings.siteLogoUrl()" alt="Logo" class="w-9 h-9 object-contain rounded-xl bg-white/10 p-1" />
            } @else {
              <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0BB4D2] to-teal-400 text-[#003432] flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
                {{ systemSettings.siteName().charAt(0) || 'V' }}
              </div>
            }
            <div>
              <div class="text-sm font-black text-white tracking-tight leading-none">{{ systemSettings.siteName() }}</div>
              <div class="text-[10px] text-teal-300 font-semibold tracking-wider uppercase mt-1">Admin Portal</div>
            </div>
          </a>

          <!-- Mobile Close Button -->
          <button (click)="mobileMenuOpen.set(false)" class="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Admin Identity Capsule -->
        <div class="px-5 py-4 border-b border-white/10 bg-black/10 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#0BB4D2] text-[#003432] flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
              ADM
            </div>
            <div class="overflow-hidden flex-1 min-w-0">
              <div class="font-bold text-xs text-white truncate">{{ currentUser()?.fullName || 'Systems Administrator' }}</div>
              <div class="text-[10px] text-slate-300 font-mono truncate">{{ currentUser()?.email || 'admin@obsidiantrustbancorp.com' }}</div>
              <div class="flex items-center gap-1.5 mt-0.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span class="text-[9px] font-bold text-emerald-300 uppercase">Administrator Mode</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Grouped Navigation Links -->
        <nav class="flex-1 py-4 px-3 space-y-5 overflow-y-auto sidebar-scroll text-xs font-semibold">
          
          <!-- Category 1: Command & Users -->
          <div class="space-y-1">
            <div class="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Operations</div>
            
            <a routerLink="/admin/dashboard" 
               routerLinkActive="bg-[#0BB4D2] text-white shadow-sm font-bold" 
               [routerLinkActiveOptions]="{exact: true}"
               (click)="mobileMenuOpen.set(false)"
               [class.ring-2]="tourService.isOpen() && tourService.currentTourTargetId() === 'admin-overview'"
               [class.ring-amber-400]="tourService.isOpen() && tourService.currentTourTargetId() === 'admin-overview'"
               [class.bg-teal-900]="tourService.isOpen() && tourService.currentTourTargetId() === 'admin-overview'"
               class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition relative">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
              <span>Command Center</span>
              @if (tourService.isOpen() && tourService.currentTourTargetId() === 'admin-overview') {
                <span class="ml-auto px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black animate-pulse shadow">👈 HERE</span>
              }
            </a>

            <a routerLink="/admin/users" 
               routerLinkActive="bg-[#0BB4D2] text-white shadow-sm font-bold" 
               (click)="mobileMenuOpen.set(false)"
               [class.ring-2]="tourService.isOpen() && tourService.currentTourTargetId() === 'admin-users'"
               [class.ring-amber-400]="tourService.isOpen() && tourService.currentTourTargetId() === 'admin-users'"
               [class.bg-teal-900]="tourService.isOpen() && tourService.currentTourTargetId() === 'admin-users'"
               class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition relative">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              <span>Customer Accounts</span>
              @if (tourService.isOpen() && tourService.currentTourTargetId() === 'admin-users') {
                <span class="ml-auto px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black animate-pulse shadow">👈 HERE</span>
              }
            </a>
          </div>

          <!-- Category 2: Approvals -->
          <div class="space-y-1">
            <div class="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Approval Queues</div>

            <a routerLink="/admin/deposits" 
               routerLinkActive="bg-[#0BB4D2] text-white shadow-sm font-bold"
               (click)="mobileMenuOpen.set(false)"
               [class.ring-2]="tourService.isOpen() && tourService.currentTourTargetId() === 'admin-deposits'"
               [class.ring-amber-400]="tourService.isOpen() && tourService.currentTourTargetId() === 'admin-deposits'"
               [class.bg-teal-900]="tourService.isOpen() && tourService.currentTourTargetId() === 'admin-deposits'"
               class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition relative">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
              <span>Deposit Approvals</span>
              @if (tourService.isOpen() && tourService.currentTourTargetId() === 'admin-deposits') {
                <span class="ml-auto px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black animate-pulse shadow">👈 HERE</span>
              }
            </a>

            <a routerLink="/admin/withdrawals" 
               routerLinkActive="bg-[#0BB4D2] text-white shadow-sm font-bold"
               (click)="mobileMenuOpen.set(false)"
               class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
              <span>Withdrawals Queue</span>
            </a>

            <a routerLink="/admin/loans" 
               routerLinkActive="bg-[#0BB4D2] text-white shadow-sm font-bold"
               (click)="mobileMenuOpen.set(false)"
               class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span>Loan Applications</span>
            </a>

            <a routerLink="/admin/support" 
               routerLinkActive="bg-[#0BB4D2] text-white shadow-sm font-bold"
               (click)="mobileMenuOpen.set(false)"
               [class.ring-2]="tourService.isOpen() && tourService.currentTourTargetId() === 'admin-support'"
               [class.ring-amber-400]="tourService.isOpen() && tourService.currentTourTargetId() === 'admin-support'"
               [class.bg-teal-900]="tourService.isOpen() && tourService.currentTourTargetId() === 'admin-support'"
               class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition relative">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
              <span>Support Desk</span>
              @if (tourService.isOpen() && tourService.currentTourTargetId() === 'admin-support') {
                <span class="ml-auto px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black animate-pulse shadow">👈 HERE</span>
              }
            </a>
          </div>

          <!-- Category 3: Treasury & Settings -->
          <div class="space-y-1">
            <div class="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Treasury &amp; Settings</div>

            <a routerLink="/admin/rates" 
               routerLinkActive="bg-[#0BB4D2] text-white shadow-sm font-bold"
               (click)="mobileMenuOpen.set(false)"
               class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
              <span>Exchange Rates</span>
            </a>

            <a routerLink="/admin/investments" 
               routerLinkActive="bg-[#0BB4D2] text-white shadow-sm font-bold"
               (click)="mobileMenuOpen.set(false)"
               class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
              <span>Fixed Investments</span>
            </a>

            <a routerLink="/admin/settings" 
               routerLinkActive="bg-[#0BB4D2] text-white shadow-sm font-bold"
               (click)="mobileMenuOpen.set(false)"
               [class.ring-2]="tourService.isOpen() && tourService.currentTourTargetId() === 'admin-settings'"
               [class.ring-amber-400]="tourService.isOpen() && tourService.currentTourTargetId() === 'admin-settings'"
               [class.bg-teal-900]="tourService.isOpen() && tourService.currentTourTargetId() === 'admin-settings'"
               class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition relative">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <span>Setup &amp; Branding</span>
              @if (tourService.isOpen() && tourService.currentTourTargetId() === 'admin-settings') {
                <span class="ml-auto px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black animate-pulse shadow">👈 HERE</span>
              }
            </a>
          </div>

        </nav>

        <!-- Static Sidebar Footer -->
        <div class="p-4 border-t border-white/10 bg-[#002625] shrink-0 space-y-2">
          <a routerLink="/e-banking/overview" 
             class="w-full px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition flex items-center justify-center gap-2">
            <span>Customer Portal &rarr;</span>
          </a>

          <button (click)="logout()" 
                  class="w-full px-3 py-2 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 text-xs font-semibold flex items-center justify-center gap-2 transition">
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      <!-- Mobile Backdrop Overlay -->
      @if (mobileMenuOpen()) {
        <div (click)="mobileMenuOpen.set(false)" 
             class="fixed inset-0 bg-black/50 backdrop-blur-xs z-30 lg:hidden">
        </div>
      }

      <!-- MAIN WORKSPACE CANVAS -->
      <div class="flex-1 flex flex-col min-h-screen lg:pl-64 xl:pl-72 transition-all duration-300 bg-[#f8fafc]">
        
        <!-- Desktop Top Command Bar (Hidden on Mobile) -->
        <header class="hidden lg:block bg-white text-slate-800 sticky top-0 z-20 border-b border-slate-200 shadow-xs">
          <div class="px-5 sm:px-8 py-3.5 flex items-center justify-between gap-4">
            
            <div class="flex items-center gap-3">
              <div>
                <h1 class="text-sm sm:text-base font-bold font-nunito text-[#003432]">
                  {{ systemSettings.siteName() }} Administrative Portal
                </h1>
                <p class="text-xs text-slate-500">Operational Command &amp; Approvals Center</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <button (click)="tourService.startAdminTour(true)"
                      class="px-3.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-200 text-[#003432] text-xs font-bold transition flex items-center gap-1.5 shadow-2xs">
                <span>🎯</span>
                <span>Admin Tour</span>
              </button>

              <a routerLink="/e-banking/overview" 
                 class="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 border border-slate-200">
                <span>Customer View &rarr;</span>
              </a>

              <button (click)="logout()"
                      class="px-3.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition">
                Logout
              </button>
            </div>

          </div>
        </header>

        <!-- Canvas Area with Safe Bottom Padding for Mobile Dock -->
        <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
          <router-outlet></router-outlet>
        </main>

        <!-- Admin Desktop Footer -->
        <footer class="hidden lg:block bg-white border-t border-slate-200 py-4 px-8 text-xs text-slate-500">
          <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div>
              &copy; 2026 <strong>Obsidian Trust Bancorp Plc</strong> &bull; Administrative Systems
            </div>
            <div class="text-[11px] text-slate-400">
              Nottingham, UK &bull; Internal Compliance Console
            </div>
          </div>
        </footer>

      </div>

      <!-- ========================================================================= -->
      <!-- MOBILE NATIVE APP BOTTOM NAVIGATION DOCK                                  -->
      <!-- Persistent tab bar for instant touch navigation in admin mode             -->
      <!-- ========================================================================= -->
      <nav class="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around safe-area-pb">
        <!-- Tab 1: Dashboard -->
        <a routerLink="/admin/dashboard"
           routerLinkActive="text-[#003432] font-black"
           [routerLinkActiveOptions]="{exact: true}"
           class="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-[#003432] transition group">
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
          <span class="text-[10px] tracking-tight">Overview</span>
        </a>

        <!-- Tab 2: Deposits -->
        <a routerLink="/admin/deposits"
           routerLinkActive="text-[#003432] font-black"
           class="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-[#003432] transition group">
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
          <span class="text-[10px] tracking-tight">Deposits</span>
        </a>

        <!-- Tab 3: Loans -->
        <a routerLink="/admin/loans"
           routerLinkActive="text-[#003432] font-black"
           class="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-[#003432] transition group">
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span class="text-[10px] tracking-tight">Loans</span>
        </a>

        <!-- Tab 4: Users -->
        <a routerLink="/admin/users"
           routerLinkActive="text-[#003432] font-black"
           class="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-[#003432] transition group">
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          <span class="text-[10px] tracking-tight">Users</span>
        </a>

        <!-- Tab 5: More Actions Sheet Trigger -->
        <button (click)="moreSheetOpen.set(true)"
                class="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-[#003432] transition group">
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          <span class="text-[10px] tracking-tight">More</span>
        </button>
      </nav>

      <!-- ========================================================================= -->
      <!-- MOBILE SLIDE-UP ACTIONS SHEET                                             -->
      <!-- ========================================================================= -->
      @if (moreSheetOpen()) {
        <div class="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <!-- Backdrop -->
          <div (click)="moreSheetOpen.set(false)" class="absolute inset-0 bg-black/60 backdrop-blur-xs animate-fade-in"></div>

          <!-- Sheet Container -->
          <div class="relative bg-white rounded-t-3xl shadow-2xl p-6 space-y-5 animate-slide-up max-h-[85vh] overflow-y-auto">
            <!-- Pull Bar -->
            <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto"></div>

            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-bold text-base text-[#003432]">Admin Queues &amp; Settings</h3>
                <p class="text-xs text-slate-500">Obsidian Trust Bancorp Operational Controls</p>
              </div>
              <button (click)="moreSheetOpen.set(false)" class="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <!-- Operations Grid -->
            <div class="grid grid-cols-2 gap-3 text-xs">
              <a routerLink="/admin/withdrawals" (click)="moreSheetOpen.set(false)"
                 class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#0BB4D2] transition">
                <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                </div>
                <div>
                  <div class="font-bold text-slate-800">Withdrawals</div>
                  <div class="text-[10px] text-slate-500">Payout Queue</div>
                </div>
              </a>

              <a routerLink="/admin/rates" (click)="moreSheetOpen.set(false)"
                 class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#0BB4D2] transition">
                <div class="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold shrink-0">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                </div>
                <div>
                  <div class="font-bold text-slate-800">Exchange Rates</div>
                  <div class="text-[10px] text-slate-500">FX Treasury</div>
                </div>
              </a>

              <a routerLink="/admin/investments" (click)="moreSheetOpen.set(false)"
                 class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#0BB4D2] transition">
                <div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                </div>
                <div>
                  <div class="font-bold text-slate-800">Investments</div>
                  <div class="text-[10px] text-slate-500">Portfolios</div>
                </div>
              </a>

              <a routerLink="/admin/support" (click)="moreSheetOpen.set(false)"
                 class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#0BB4D2] transition">
                <div class="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold shrink-0">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                </div>
                <div>
                  <div class="font-bold text-slate-800">Support Desk</div>
                  <div class="text-[10px] text-slate-500">Live Inquiries</div>
                </div>
              </a>

              <a routerLink="/e-banking/overview" (click)="moreSheetOpen.set(false)"
                 class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#0BB4D2] transition">
                <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </div>
                <div>
                  <div class="font-bold text-slate-800">Customer View</div>
                  <div class="text-[10px] text-slate-500">Switch Portal</div>
                </div>
              </a>
            </div>

            <!-- Sign Out Button -->
            <button (click)="logout(); moreSheetOpen.set(false)"
                    class="w-full py-3 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 transition flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              <span>Sign Out of Admin Console</span>
            </button>
          </div>
        </div>
      }

      <!-- Interactive Admin Operations Tour Guide -->
      <app-tour-guide />

    </div>
  `
})
export class AdminLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  tourService = inject(TourService);
  systemSettings = inject(SystemSettingsService);

  currentUser = this.authService.currentUser;
  mobileMenuOpen = signal<boolean>(false);
  moreSheetOpen = signal<boolean>(false);

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        this.tourService.startAdminTour(false);
      }, 1200);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
