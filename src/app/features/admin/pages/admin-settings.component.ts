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

              <!-- Logo Presets or Custom URL -->
              <div>
                <label class="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1.5">Logo Selection / Presets</label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  <button type="button" (click)="selectLogoPreset('DEFAULT')"
                          [ngClass]="activeLogoPreset === 'DEFAULT' ? 'border-[#0BB4D2] bg-teal-50/70 font-bold text-[#003432]' : 'border-slate-200 hover:bg-slate-50 text-slate-600'"
                          class="p-2.5 rounded-xl border text-[11px] transition text-center flex flex-col items-center gap-1">
                    <span class="w-6 h-6 rounded-md bg-[#003432] text-[#0BB4D2] font-black text-[10px] flex items-center justify-center">VA</span>
                    <span>Cyan &amp; Teal Crest</span>
                  </button>

                  <button type="button" (click)="selectLogoPreset('GOLD')"
                          [ngClass]="activeLogoPreset === 'GOLD' ? 'border-amber-400 bg-amber-50 font-bold text-amber-900' : 'border-slate-200 hover:bg-slate-50 text-slate-600'"
                          class="p-2.5 rounded-xl border text-[11px] transition text-center flex flex-col items-center gap-1">
                    <span class="w-6 h-6 rounded-md bg-slate-900 text-amber-400 font-black text-[10px] flex items-center justify-center">✦</span>
                    <span>Gold Monogram</span>
                  </button>

                  <button type="button" (click)="selectLogoPreset('PLATINUM')"
                          [ngClass]="activeLogoPreset === 'PLATINUM' ? 'border-slate-400 bg-slate-100 font-bold text-slate-900' : 'border-slate-200 hover:bg-slate-50 text-slate-600'"
                          class="p-2.5 rounded-xl border text-[11px] transition text-center flex flex-col items-center gap-1">
                    <span class="w-6 h-6 rounded-md bg-slate-700 text-slate-100 font-black text-[10px] flex items-center justify-center">🛡️</span>
                    <span>Platinum Shield</span>
                  </button>

                  <button type="button" (click)="selectLogoPreset('CUSTOM')"
                          [ngClass]="activeLogoPreset === 'CUSTOM' ? 'border-[#0BB4D2] bg-teal-50 font-bold text-[#003432]' : 'border-slate-200 hover:bg-slate-50 text-slate-600'"
                          class="p-2.5 rounded-xl border text-[11px] transition text-center flex flex-col items-center gap-1">
                    <span class="w-6 h-6 rounded-md bg-teal-100 text-[#003432] font-bold text-[10px] flex items-center justify-center">🔗</span>
                    <span>Custom URL</span>
                  </button>
                </div>

                <div class="space-y-1.5">
                  <span class="text-[10px] text-slate-400 font-medium">Custom Logo Image URL (PNG / SVG / WebP):</span>
                  <div class="flex items-center gap-2">
                    <input type="text" [(ngModel)]="form.site_logo_url"
                           (input)="activeLogoPreset = 'CUSTOM'"
                           placeholder="https://example.com/logo.png or data:image/..."
                           class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0BB4D2]/40 transition" />
                    @if (form.site_logo_url) {
                      <div class="w-9 h-9 rounded-xl border border-slate-200 bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                        <img [src]="form.site_logo_url" alt="Logo Preview" class="max-h-full max-w-full object-contain" (error)="onLogoLoadError()" />
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
                      {{ form.site_name.charAt(0) || 'V' }}
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
  activeLogoPreset: 'DEFAULT' | 'GOLD' | 'PLATINUM' | 'CUSTOM' = 'DEFAULT';

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

  selectLogoPreset(preset: 'DEFAULT' | 'GOLD' | 'PLATINUM' | 'CUSTOM'): void {
    this.activeLogoPreset = preset;
    switch (preset) {
      case 'DEFAULT':
        this.form.site_logo_url = '';
        break;
      case 'GOLD':
        // High quality gold crest SVG data URL
        this.form.site_logo_url = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%230f172a"/><path d="M50 15 L85 80 L15 80 Z" fill="%23f59e0b"/><circle cx="50" cy="55" r="15" fill="%230f172a"/><text x="50" y="60" font-family="sans-serif" font-weight="900" font-size="16" fill="%23fbbf24" text-anchor="middle">VA</text></svg>';
        break;
      case 'PLATINUM':
        // Platinum shield crest SVG data URL
        this.form.site_logo_url = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="%23003432" stroke="%230BB4D2" stroke-width="4"/><text x="50" y="62" font-family="sans-serif" font-weight="900" font-size="28" fill="%23ffffff" text-anchor="middle">VA</text></svg>';
        break;
      case 'CUSTOM':
        // Keep or allow input
        break;
    }
  }

  onLogoLoadError(): void {
    this.modalService.alert({
      title: 'Invalid Logo Image URL',
      message: 'The custom logo URL provided could not be loaded as an image. Please verify the URL.',
      type: 'warning'
    });
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
