import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SystemSettingsService, SystemSettings } from '../../../core/services/system-settings.service';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto font-sans antialiased animate-fade-in">
      
      <!-- Top Title & Deployment Banner -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-teal-100 text-[#003432] text-[10px] font-black uppercase tracking-wider">
              Institutional White-Label Engine
            </span>
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-xs text-slate-500 font-semibold">Live System Configuration</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-[#003432] tracking-tight mt-1">
            System Setup &amp; Brand Customization
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">
            Configure platform branding, corporate bank logo, institution name, SWIFT clearing identifiers, and administrative communication channels.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button (click)="saveSettings()" 
                  [disabled]="isSaving()"
                  class="bg-[#003432] hover:bg-[#002625] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2 disabled:opacity-50">
            @if (isSaving()) {
              <div class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Deploying Changes...</span>
            } @else {
              <span>💾 Save &amp; Deploy Branding</span>
            }
          </button>
        </div>
      </div>

      <!-- Main Settings Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Left Column: Settings Configuration Tabs & Form (7 Cols) -->
        <div class="lg:col-span-7 space-y-6">
          
          <!-- Category 1: Visual Identity & Logo -->
          <div class="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl bg-teal-50 text-[#003432] flex items-center justify-center text-sm font-bold">
                  🎨
                </div>
                <div>
                  <h3 class="font-bold text-sm text-[#003432]">Visual Identity &amp; Platform Logo</h3>
                  <p class="text-[11px] text-slate-400">Institutional brand name and corporate logos displayed across portal and emails</p>
                </div>
              </div>
            </div>

            <div class="space-y-4 text-xs">
              <div>
                <label class="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1.5">Website / Institution Name *</label>
                <input type="text" [(ngModel)]="form.site_name" required
                       placeholder="e.g. Obsidian Trust Bancorp Plc"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0BB4D2]/40 transition" />
              </div>

              <div>
                <label class="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1.5">Brand Tagline / Commercial Subtitle</label>
                <input type="text" [(ngModel)]="form.site_tagline"
                       placeholder="e.g. Commercial Banking & Institutional Treasury"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0BB4D2]/40 transition" />
              </div>

              <!-- Logo Presets, Direct Upload, or Custom URL -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <label class="block text-slate-700 font-bold uppercase tracking-wider text-[10px]">Institutional Logo &amp; Crest</label>
                  @if (form.site_logo_url) {
                    <button type="button" (click)="clearLogo()" class="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      <span>Remove Logo</span>
                    </button>
                  }
                </div>

                <!-- Presets Selection Bar -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button type="button" (click)="selectLogoPreset('DEFAULT')"
                          [ngClass]="activeLogoPreset === 'DEFAULT' ? 'border-[#0BB4D2] bg-teal-50/70 font-bold text-[#003432]' : 'border-slate-200 hover:bg-slate-50 text-slate-600'"
                          class="p-2.5 rounded-xl border text-[11px] transition text-center flex flex-col items-center gap-1">
                    <span class="w-6 h-6 rounded-md bg-[#003432] text-[#0BB4D2] font-black text-[10px] flex items-center justify-center">OTB</span>
                    <span>Default Monogram</span>
                  </button>

                  <button type="button" (click)="selectLogoPreset('GOLD')"
                          [ngClass]="activeLogoPreset === 'GOLD' ? 'border-amber-400 bg-amber-50 font-bold text-amber-900' : 'border-slate-200 hover:bg-slate-50 text-slate-600'"
                          class="p-2.5 rounded-xl border text-[11px] transition text-center flex flex-col items-center gap-1">
                    <span class="w-6 h-6 rounded-md bg-[#001f1e] text-amber-400 font-black text-[10px] flex items-center justify-center">✦</span>
                    <span>Obsidian Gold</span>
                  </button>

                  <button type="button" (click)="selectLogoPreset('CYAN')"
                          [ngClass]="activeLogoPreset === 'CYAN' ? 'border-[#0BB4D2] bg-teal-50 font-bold text-[#003432]' : 'border-slate-200 hover:bg-slate-50 text-slate-600'"
                          class="p-2.5 rounded-xl border text-[11px] transition text-center flex flex-col items-center gap-1">
                    <span class="w-6 h-6 rounded-md bg-[#003432] text-[#0BB4D2] font-black text-[10px] flex items-center justify-center">🛡️</span>
                    <span>Sovereign Crest</span>
                  </button>

                  <button type="button" (click)="selectLogoPreset('PLATINUM')"
                          [ngClass]="activeLogoPreset === 'PLATINUM' ? 'border-slate-400 bg-slate-100 font-bold text-slate-900' : 'border-slate-200 hover:bg-slate-50 text-slate-600'"
                          class="p-2.5 rounded-xl border text-[11px] transition text-center flex flex-col items-center gap-1">
                    <span class="w-6 h-6 rounded-md bg-slate-900 text-sky-400 font-black text-[10px] flex items-center justify-center">OTB</span>
                    <span>Modern Platinum</span>
                  </button>
                </div>

                <!-- Direct Upload & Custom URL Controls -->
                <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <span>📁</span> Direct File Upload or Image URL
                    </span>

                    <div class="flex items-center gap-2">
                      <input type="file" #logoFileInput (change)="onLogoFileSelected($event)" accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif" class="hidden" />
                      <button type="button" (click)="logoFileInput.click()"
                              class="px-3 py-1.5 rounded-lg bg-[#003432] hover:bg-[#002625] text-white text-[11px] font-bold transition flex items-center gap-1.5 shadow-2xs">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                        <span>Choose Image File...</span>
                      </button>
                    </div>
                  </div>

                  @if (logoFileName()) {
                    <div class="flex items-center justify-between text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg px-2.5 py-1">
                      <span class="font-semibold truncate">Uploaded: {{ logoFileName() }}</span>
                      <span class="font-bold text-emerald-600">Ready</span>
                    </div>
                  }

                  <div class="flex items-center gap-2">
                    <input type="text" [(ngModel)]="form.site_logo_url"
                           (input)="onLogoUrlInput()"
                           placeholder="https://example.com/logo.png or data:image/... or click Choose Image File above"
                           class="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0BB4D2]/40 transition" />
                    
                    @if (form.site_logo_url) {
                      <div class="w-10 h-10 rounded-xl border border-slate-200 bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs relative" title="Logo Preview">
                        <img [src]="form.site_logo_url" alt="Logo Preview" class="max-h-full max-w-full object-contain" 
                             (load)="logoPreviewError.set(false)" 
                             (error)="logoPreviewError.set(true)" />
                      </div>
                    }
                  </div>

                  @if (logoPreviewError() && form.site_logo_url) {
                    <div class="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 flex flex-col gap-1">
                      <div class="flex items-center gap-1.5 font-bold">
                        <span>⚠️</span>
                        <span>Image could not be loaded from this URL</span>
                      </div>
                      <p class="text-[10px] text-amber-800 leading-normal">
                        Cloud storage links (like Google Drive viewer URLs) are protected web pages, not direct image files. 
                        <strong>Solution:</strong> Open your Google Drive link, download the image to your device, and click <strong>"Choose Image File..."</strong> above to upload it directly.
                      </p>
                    </div>
                  }
                </div>

                <!-- Custom Favicon Support -->
                <div class="pt-2">
                  <div class="flex items-center justify-between mb-1.5">
                    <label class="block text-slate-700 font-bold uppercase tracking-wider text-[10px]">Browser Favicon (Optional)</label>
                    @if (form.site_favicon_url) {
                      <button type="button" (click)="clearFavicon()" class="text-[10px] font-bold text-slate-500 hover:text-rose-600 transition">
                        Clear Favicon
                      </button>
                    }
                  </div>

                  <div class="flex items-center gap-2">
                    <input type="file" #faviconFileInput (change)="onFaviconFileSelected($event)" accept="image/png,image/x-icon,image/svg+xml" class="hidden" />
                    <input type="text" [(ngModel)]="form.site_favicon_url"
                           placeholder="Browser tab favicon URL or data:image/..."
                           class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0BB4D2]/40 transition" />
                    <button type="button" (click)="faviconFileInput.click()"
                            class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1">
                      <span>Upload</span>
                    </button>
                    @if (form.site_favicon_url) {
                      <div class="w-8 h-8 rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center shrink-0">
                        <img [src]="form.site_favicon_url" alt="Favicon" class="w-5 h-5 object-contain" />
                      </div>
                    }
                  </div>
                </div>

              </div>

            </div>
          </div>

          <!-- Category 2: Communications & Notification Routing -->
          <div class="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl bg-teal-50 text-[#003432] flex items-center justify-center text-sm font-bold">
                  ✉️
                </div>
                <div>
                  <h3 class="font-bold text-sm text-[#003432]">Communications &amp; Email Dispatch Routing</h3>
                  <p class="text-[11px] text-slate-400">Addresses for client support tickets and admin notifications</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label class="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1.5">Executive Admin Notification Email *</label>
                <input type="email" [(ngModel)]="form.admin_notification_email" required
                       placeholder="admin@obsidiantrustbancorp.com"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0BB4D2]/40 transition" />
                <span class="text-[10px] text-slate-400 mt-1 block">Inquiries dispatched by customers are routed to this inbox.</span>
              </div>

              <div>
                <label class="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1.5">Public Support Email *</label>
                <input type="email" [(ngModel)]="form.contact_email" required
                       placeholder="support@obsidiantrustbancorp.com"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0BB4D2]/40 transition" />
                <span class="text-[10px] text-slate-400 mt-1 block">Displayed on public footer and account statement contacts.</span>
              </div>

              <div>
                <label class="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1.5">Direct Treasury Phone</label>
                <input type="text" [(ngModel)]="form.phone_number"
                       placeholder="+44 20 7946 0912"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0BB4D2]/40 transition" />
              </div>

              <div>
                <label class="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1.5">Support Desk Operational Hours</label>
                <input type="text" [(ngModel)]="form.support_hours"
                       placeholder="24/7 Global Treasury Support Desk"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0BB4D2]/40 transition" />
              </div>
            </div>
          </div>

          <!-- Category 3: Institutional Clearing & Treasury Identifiers -->
          <div class="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl bg-teal-50 text-[#003432] flex items-center justify-center text-sm font-bold">
                  🏛️
                </div>
                <div>
                  <h3 class="font-bold text-sm text-[#003432]">Clearing Identifiers &amp; Head Office</h3>
                  <p class="text-[11px] text-slate-400">Institutional routing codes, domestic clearing, and physical incorporation</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label class="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1.5">SWIFT / BIC Clearing Code</label>
                <input type="text" [(ngModel)]="form.swift_code"
                       placeholder="OTBCGB2L"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-slate-800 uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0BB4D2]/40 transition" />
              </div>

              <div>
                <label class="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1.5">Domestic Routing Number</label>
                <input type="text" [(ngModel)]="form.routing_number"
                       placeholder="026009593"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0BB4D2]/40 transition" />
              </div>

              <div>
                <label class="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1.5">Base Operating Currency</label>
                <div class="grid grid-cols-2 gap-2">
                  <input type="text" [(ngModel)]="form.currency_code" placeholder="USD" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-center text-slate-800 uppercase" />
                  <input type="text" [(ngModel)]="form.currency_symbol" placeholder="$" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-center text-slate-800" />
                </div>
              </div>

              <div>
                <label class="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1.5">Official Copyright Notice</label>
                <input type="text" [(ngModel)]="form.copyright_text"
                       placeholder="© 2026 Obsidian Trust Bancorp Plc."
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0BB4D2]/40 transition" />
              </div>

              <div class="sm:col-span-2">
                <label class="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1.5">Registered Head Office Address</label>
                <input type="text" [(ngModel)]="form.address"
                       placeholder="12 Bridlesmith Walk, Nottingham, NG1 2HB, United Kingdom"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0BB4D2]/40 transition" />
              </div>

              <div class="sm:col-span-2">
                <label class="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1.5">About Institution Scope &amp; Disclosures</label>
                <textarea [(ngModel)]="form.about_summary" rows="3"
                          placeholder="Provide summary of commercial banking scope, licenses, and investor guarantees..."
                          class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0BB4D2]/40 transition resize-none"></textarea>
              </div>
            </div>
          </div>

        </div>

        <!-- Right Column: Live Branding & Appearance Preview Canvas (5 Cols) -->
        <div class="lg:col-span-5 space-y-6 shrink-0 sticky top-6">
          
          <div class="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-500">Live Brand Preview</span>
              <span class="px-2 py-0.5 rounded-full bg-teal-50 text-[#003432] text-[10px] font-black uppercase">Instant Reactive</span>
            </div>

            <!-- Preview Card 1: Header / Navbar Rendering -->
            <div class="space-y-1.5">
              <span class="text-[10px] font-bold text-slate-400 uppercase">1. Portal Header Bar</span>
              <div class="rounded-2xl bg-[#003432] p-4 flex items-center justify-between text-white shadow-md border-b-2 border-[#0BB4D2]">
                <div class="flex items-center gap-3">
                  @if (form.site_logo_url) {
                    <img [src]="form.site_logo_url" alt="Logo" class="w-9 h-9 object-contain rounded-xl bg-white/10 p-1" />
                  } @else {
                    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0BB4D2] to-[#089bb5] flex items-center justify-center font-black text-white text-sm shadow-md">
                      {{ form.site_name.charAt(0) || 'O' }}
                    </div>
                  }
                  <div>
                    <span class="text-sm font-black tracking-tight text-white block">{{ form.site_name || 'Obsidian Trust Bancorp' }}</span>
                    <span class="text-[9px] tracking-widest text-[#0BB4D2] uppercase font-bold block -mt-0.5">{{ form.site_tagline || 'Private Banking' }}</span>
                  </div>
                </div>

                <span class="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                  {{ form.swift_code || 'OTBCGB2L' }}
                </span>
              </div>
            </div>

            <!-- Preview Card 2: Official Client Card / Statement Preview -->
            <div class="space-y-1.5 pt-2">
              <span class="text-[10px] font-bold text-slate-400 uppercase">2. Client Card Identity</span>
              <div class="rounded-2xl bg-gradient-to-tr from-[#003432] via-[#002625] to-[#004d4a] p-5 text-white shadow-lg relative overflow-hidden border border-teal-500/20">
                <div class="flex justify-between items-start mb-6">
                  <div>
                    <span class="text-xs font-black tracking-wider text-white block">{{ form.site_name || 'Obsidian Trust Bancorp' }}</span>
                    <span class="text-[9px] text-[#5eead4] uppercase font-bold tracking-widest">Master Private Debit</span>
                  </div>
                  <span class="text-sm font-bold text-teal-300">✦</span>
                </div>

                <div class="font-mono text-sm tracking-widest text-slate-200 mb-4">
                  4820 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 9042
                </div>

                <div class="flex justify-between items-end text-[10px]">
                  <div>
                    <span class="text-slate-400 block text-[8px] uppercase">Cardholder</span>
                    <strong class="text-white font-bold">ALEXANDER VANCE</strong>
                  </div>
                  <div>
                    <span class="text-slate-400 block text-[8px] uppercase">Routing</span>
                    <strong class="text-white font-mono">{{ form.routing_number || '026009593' }}</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- Preview Card 3: Support Contact Footnote -->
            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] space-y-1.5 text-slate-600">
              <div class="flex justify-between">
                <span class="text-slate-400 font-bold">Inquiry Routing:</span>
                <span class="font-mono font-bold text-[#003432]">{{ form.admin_notification_email }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400 font-bold">Public Desk:</span>
                <span class="font-mono text-slate-700">{{ form.contact_email }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400 font-bold">Head Office:</span>
                <span class="text-slate-700 truncate max-w-[200px]" [title]="form.address">{{ form.address }}</span>
              </div>
            </div>

            <!-- Deploy Button in sidebar -->
            <button (click)="saveSettings()" 
                    [disabled]="isSaving()"
                    class="w-full bg-[#003432] hover:bg-[#002625] text-white py-3 rounded-2xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50">
              <span>🚀 Deploy Configuration Live</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  `
})
export class AdminSettingsComponent implements OnInit {
  private systemSettingsService = inject(SystemSettingsService);
  private modalService = inject(ModalService);

  isSaving = signal<boolean>(false);
  activeLogoPreset: 'DEFAULT' | 'GOLD' | 'CYAN' | 'PLATINUM' | 'CUSTOM' = 'DEFAULT';
  logoFileName = signal<string>('');
  logoPreviewError = signal<boolean>(false);

  form: SystemSettings = {
    site_name: '',
    site_tagline: '',
    site_logo_url: '',
    site_favicon_url: '',
    contact_email: '',
    admin_notification_email: '',
    phone_number: '',
    address: '',
    swift_code: '',
    routing_number: '',
    currency_code: 'USD',
    currency_symbol: '$',
    about_summary: '',
    copyright_text: '',
    support_hours: '',
    is_setup_completed: true
  };

  ngOnInit(): void {
    const current = this.systemSettingsService.settings();
    this.form = { ...current };
    if (this.form.site_logo_url) {
      this.activeLogoPreset = 'CUSTOM';
    }
  }

  selectLogoPreset(preset: 'DEFAULT' | 'GOLD' | 'CYAN' | 'PLATINUM' | 'CUSTOM'): void {
    this.activeLogoPreset = preset;
    this.logoPreviewError.set(false);
    this.logoFileName.set('');

    switch (preset) {
      case 'DEFAULT':
        this.form.site_logo_url = '';
        break;
      case 'GOLD':
        // High quality Obsidian Gold monogram crest SVG data URL
        this.form.site_logo_url = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="28" fill="%23001f1e"/><circle cx="60" cy="60" r="50" fill="none" stroke="%23f59e0b" stroke-width="2.5" stroke-dasharray="4 2"/><polygon points="60,20 95,85 25,85" fill="none" stroke="%23fbbf24" stroke-width="3"/><text x="60" y="74" font-family="sans-serif" font-weight="900" font-size="20" fill="%23fbbf24" text-anchor="middle" letter-spacing="1">OTB</text></svg>';
        break;
      case 'CYAN':
        // Deep Obsidian & Sovereign Cyan shield crest SVG data URL
        this.form.site_logo_url = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="28" fill="%23003432"/><polygon points="60,12 105,32 105,82 60,108 15,82 15,32" fill="none" stroke="%230BB4D2" stroke-width="3.5"/><polygon points="60,22 93,38 93,76 60,96 27,76 27,38" fill="%23002625" stroke="%2310b981" stroke-width="1.5"/><text x="60" y="72" font-family="sans-serif" font-weight="900" font-size="22" fill="%23ffffff" text-anchor="middle" letter-spacing="1.5">OTB</text></svg>';
        break;
      case 'PLATINUM':
        // Modern Platinum & Sky Blue geometric crest SVG data URL
        this.form.site_logo_url = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="28" fill="%230f172a"/><circle cx="60" cy="60" r="44" fill="none" stroke="%2394a3b8" stroke-width="3"/><path d="M60 26 L88 78 L32 78 Z" fill="none" stroke="%2338bdf8" stroke-width="3"/><text x="60" y="71" font-family="sans-serif" font-weight="900" font-size="19" fill="%23f8fafc" text-anchor="middle">OTB</text></svg>';
        break;
      case 'CUSTOM':
        break;
    }
  }

  onLogoUrlInput(): void {
    this.activeLogoPreset = 'CUSTOM';
    this.logoFileName.set('');
    this.logoPreviewError.set(false);

    // Auto-detect and convert Google Drive share links to direct embed if possible
    if (this.form.site_logo_url && this.form.site_logo_url.includes('drive.google.com')) {
      const match = this.form.site_logo_url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        this.form.site_logo_url = `https://lh3.googleusercontent.com/d/${match[1]}`;
      }
    }
  }

  onLogoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) {
      this.modalService.alert({
        title: 'File Too Large',
        message: 'The selected logo image exceeds the 5MB size limit. Please choose a smaller file.',
        type: 'warning'
      });
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.form.site_logo_url = reader.result as string;
      this.logoFileName.set(file.name);
      this.activeLogoPreset = 'CUSTOM';
      this.logoPreviewError.set(false);
      input.value = '';
    };
    reader.onerror = () => {
      this.modalService.alert({
        title: 'File Read Error',
        message: 'Unable to read the chosen image file. Please try another file.',
        type: 'danger'
      });
      input.value = '';
    };
    reader.readAsDataURL(file);
  }

  onFaviconFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (file.size > 2 * 1024 * 1024) {
      this.modalService.alert({
        title: 'File Too Large',
        message: 'The selected favicon image exceeds 2MB. Please choose a smaller icon file.',
        type: 'warning'
      });
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.form.site_favicon_url = reader.result as string;
      input.value = '';
    };
    reader.readAsDataURL(file);
  }

  clearLogo(): void {
    this.form.site_logo_url = '';
    this.logoFileName.set('');
    this.activeLogoPreset = 'DEFAULT';
    this.logoPreviewError.set(false);
  }

  clearFavicon(): void {
    this.form.site_favicon_url = '';
  }

  saveSettings(): void {
    if (!this.form.site_name.trim() || !this.form.contact_email.trim() || !this.form.admin_notification_email.trim()) {
      this.modalService.alert({
        title: 'Missing Required Fields',
        message: 'Institution Name, Public Support Email, and Admin Notification Email are mandatory.',
        type: 'warning'
      });
      return;
    }

    this.isSaving.set(true);
    this.systemSettingsService.updateSettings(this.form).subscribe({
      next: (res) => {
        this.isSaving.set(false);
        this.modalService.alert({
          title: 'Branding Saved & Deployed',
          message: res.message || 'Institutional branding and system setup successfully updated across all client interfaces.',
          type: 'success'
        });
      },
      error: (err) => {
        this.isSaving.set(false);
        this.modalService.alert({
          title: 'Deployment Failed',
          message: err.error?.message || 'Failed to update system settings.',
          type: 'danger'
        });
      }
    });
  }
}
